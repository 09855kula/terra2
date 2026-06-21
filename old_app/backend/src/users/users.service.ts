import {forwardRef, Inject, Injectable} from "@nestjs/common";
import {createUserInput} from "./dto/input/create-user.input";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {updateUserInput} from "./dto/input/update-user.input";
import {deleteUserInput} from "./dto/input/delete-user.input";
import {Comments, Notifications, UsersWeb, UsersWebDocument} from "./schemas/users.schemas";
import {GoogleSheetsService} from "../sheets/google-sheets.service";
import {ProductsService} from "../products/products.service";
import {ProfilesService} from "../profiles/profiles.service";
import {ProfilesWeb, ProfilesDocument} from "../profiles/schemas/profiles.schemas";
import {OrdersService} from "../orders/orders.service";
import {Inventories, InventoriesDocument} from "../inventories/schemas/inventories.schemas";
import {PubSub} from "graphql-subscriptions";
import {UsersController} from "./users.controller";
import {InventoriesService} from "../inventories/inventories.service";
import {ScriptsService} from "../scripts/scripts.service";
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const moment = require('moment');

@Injectable()
export class UsersService {
    private pubSub: PubSub

    constructor(@InjectModel(UsersWeb.name) private usersModel: Model<UsersWebDocument>,
                @InjectModel(ProfilesWeb.name) private profilesModel: Model<ProfilesDocument>,
                @InjectModel(Inventories.name) private inventoriesModel: Model<InventoriesDocument>,
                private readonly googleSheetsService: GoogleSheetsService,
                @Inject(forwardRef(() => ProductsService)) private readonly productsService: ProductsService,
                private readonly profilesService: ProfilesService,
                private readonly scriptsService: ScriptsService,
                private readonly inventoriesService: InventoriesService,
                @Inject(forwardRef(() => OrdersService)) private readonly ordersService: OrdersService,
                private readonly usersController: UsersController) {
        this.pubSub = new PubSub()

    }

    async createUser(createUserData: createUserInput): Promise<UsersWebDocument> {
        const createdUser = new this.usersModel(createUserData);
        return await createdUser.save();

    }

    async login(phone): Promise<UsersWebDocument> {
        try {
            const user = await this.usersModel.findOne({phones: phone}).exec();
            if (user == null) return null;
            if(!user.new_profile) {
                function betweenRandomNumber(min, max) {
                    return Math.floor(
                        Math.random() * (max - min + 1) + min
                    )
                }
                const body = betweenRandomNumber(1000, 9999)
                // console.log('body:',body.toString())
                if(phone.split('')[0] === '1') {
                    await this.sendMessage(phone, body)
                    await this.usersModel.findOneAndUpdate(
                        {phones: phone},
                        {$set:
                                {
                                    phone: phone,
                                    token: Number(body.toString().split('').reverse().join('')),
                                    is_token_right: false,
                                    is_token_reverse: false,
                                    is_token_invalid:  false
                                },
                            $push: {tokens: Number(body.toString().split('').reverse().join(''))}}).exec();
                } else {
                    await this.usersModel.findOneAndUpdate(
                        {phones: phone},
                        {
                            $set: {
                                phone: phone,
                                token: 9876,
                                is_token_right: false,
                                is_token_reverse: false,
                                is_token_invalid:  false
                            },
                            $push: {
                                tokens: 9876
                            }
                        }).exec();

                }

                return await this.usersModel.findOne({phones: phone}).exec();
            } else {
                return await this.usersModel.findOne({phones: phone}).exec();
            }

        } catch (err) {
            console.error(`Could not find User phone ${phone}, err = ${err}`);
            throw err;
        }

    }

    async sendMessage(phone: string, body: number){
        if(phone.split('')[0] === '1') {
            await client.messages
                .create({
                    body: `Hey! Here is your confirmation code ${body}`,
                    messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
                    from: process.env.TWILIO_FROM_NUMBER,
                    to: `+${phone}`
                    // to: '+12042932552'
                })
                .then((message: any) => console.log('message:', message))
                .catch((err: any) => console.log('error', err))
                .done();
        } else {
            console.log(`Non-North American user phone: ${phone}`)
        }




    }

    async sendSmsFromChangeOrder(phone: string, body: string){
        if(phone.split('')[0] === '1') {

            await client.messages
            .create({
                body: body,
                messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
                from: process.env.TWILIO_FROM_NUMBER,
                to: `+${phone}`
                // to: '+12042932552'
            })
            .then((message: any) => console.log('message:', message))
            .catch((err: any) => console.log('error', err))
            .done();
        } else {
            console.log(`Non-North American user phone: ${phone}`)
        }
    }

    async getUserNotification(phone): Promise<Notifications> {
        try {
            const user = await this.usersModel.findOne({phone}).exec();
            if (user == null) return null;
            const notifications = user?.notifications;
            // console.log('notifications:', notifications)
            return notifications
        } catch (err) {
            console.error(`Could not find User notifications phone ${phone}, err = ${err}`);
            throw err;
        }
    }
    async  setUserNotification(phone, title, description){
    try {
        const user = await this.usersModel.findOne({phone}).exec();
        if (user == null || phone == null) return null;

        const obj = {
            title,
            description,
            created: moment().format()
        }
        const updated = await this.usersModel.updateOne({phone},
            {$set: {notifications: obj}}
        ).exec();


        let updatedUser = await this.usersModel.findOne({phone})
        if (updatedUser == null) return null;

        return updatedUser?.notifications;
    } catch (err) {
        console.error(`Could not change User comment phone ${phone}, err = ${err}`);
        throw err;
    }
}

    async addNewAddress(addUserAddressData){
    try {
        const phone = addUserAddressData.phone
        return await this.usersModel.updateOne(
            {phone},
            {$set: {addresses: addUserAddressData.address}},
            {new: true}).exec()
    } catch (err) {
        console.error(`Could not add address to User phone ${addUserAddressData.phone}, err = ${err}`);
        throw err;
    }
}

    async getUserComments(phone): Promise<Comments[]> {
        try {
            const user = await this.usersModel.findOne({phone}).exec();
            if (user == null) return null;
            return user?.comments;
        } catch (err) {
            console.error(`Could not find User notifications phone ${phone}, err = ${err}`);
            throw err;
        }
    }

    async confirmUser(phone, token) {

        try {
            const user = await this.usersModel.findOne({phones: phone}).exec();
            if (user == null) return null;
            const expired = moment().add(3, 'd').format()

            if (user?.token === token) {
                console.log(`The user(${phone}) confirmed: ${token}`)
                await this.usersModel.updateOne({phone}, {
                    $set: {
                        limited: expired,
                        is_token_right: true,
                        is_token_reverse: false,
                        is_token_invalid:  false,
                    }})
                const fiveWeeks = moment().isAfter(user.five_weeks_limited)
                const sixWeeks = moment().isAfter(user.six_weeks_limited)
                const sevenWeeks = moment().isAfter(user.seven_weeks_limited)
                if(fiveWeeks) {
                    console.log('fiveWeeks:',fiveWeeks)
                    await this.scriptsService.afterFiveWeeksNotification(phone)
                }
                if(sixWeeks) {
                    console.log('sixWeeks:',sixWeeks)
                    await this.scriptsService.afterSixWeeksNotification(phone)
                }
                if(sevenWeeks) {
                    console.log('sevenWeeks:',sevenWeeks)
                    await this.sendSmsFromChangeOrder(phone, `It's been 7 weeks without a purchase. Unfortunately we have to freeze your account :(`)
                    await this.usersModel.deleteOne({phone})
                }
                return await this.usersModel.findOne({phones: phone}).exec();
            }
            if (user?.token === Number(token.toString().split('').reverse().join(''))) {
                console.log(`The user(${phone}) entered the token in direct sequence: ${token}`)
                await this.usersModel.updateOne({phones: phone}, {
                    $set: {
                        limited: expired,
                        is_token_right: false,
                        is_token_reverse: true,
                        is_token_invalid:  false
                    }})
                return await this.usersModel.findOne({phones: phone}).exec();
            }
            if (user?.token !== token && user?.token !== Number(token.toString().split('').reverse().join(''))) {
                console.log(`User(${phone}) entered invalid token: ${token}`)
                await this.usersModel.updateOne(
                    {phones: phone},
                    {$set: {
                        limited: expired,
                        is_token_right: false,
                        is_token_reverse: false,
                        is_token_invalid:  true
                        }})
                return await this.usersModel.findOne({phones: phone}).exec();
            }
        } catch (err) {
            console.error(`Could not add Token for User id ${phone}, err = ${err}`);
            throw err;
        }
    }

    async userComments(createUserCommentData): Promise<Comments[]> {
        try {
            const user = await this.usersModel.findOne({id: createUserCommentData.user_id}).exec();
            if (user == null) return null;
            await this.usersModel.updateOne({id: createUserCommentData.user_id},
                {
                    $push: {
                        comments: {
                            role: createUserCommentData.role,
                            user_id: createUserCommentData.user_id,
                            image: createUserCommentData.image,
                            text: createUserCommentData.text,
                            isRead: false,
                            created: moment().format()
                        }
                    }
                }
            ).exec();
            const result = await this.usersModel.findOne({id: createUserCommentData.user_id}).exec();
            return result.comments
        } catch (err) {
            console.error(`Could not create User comment id, err = ${err}`);
            throw err;
        }
    }

    async setUserCommentRead(phone) {
        try {
            const user = await this.usersModel.findOne({phone}).exec();
            if (user == null || phone == null) return null;
            //console.log(user, phone)
            const updated = await this.usersModel.updateOne({phone, "comments.isRead": false}, {
                    $set: {"comments.$[].isRead": true}
                }
            ).exec();

            let updatedUser = await this.usersModel.findOne({phone})
            if (updatedUser == null) return null;
            //console.log(updatedUser)
            return updatedUser?.comments;
        } catch (err) {
            // console.error(`Could not change User comment phone ${phone}, err = ${err}`);
            throw err;
        }
    }

    async updateUser(id, updateUserData: updateUserInput): Promise<UsersWebDocument> {
        return this.usersModel.findOneAndUpdate(id, updateUserData, {new: true})
    }

    async getUser(input): Promise<UsersWebDocument> {
        const phone = input.phone
        return await this.usersModel.findOne({phone}).exec();

    }

    async getNewUser(input): Promise<UsersWebDocument> {
        const id = input.id
        const user = await this.usersModel.findOne({id}).exec();
        let {first_name} = user
        if(!first_name) {
            await this.usersModel.findOneAndUpdate({id}, {$set: {first_name: ''}}).exec();
        }
        return await this.usersModel.findOne({id}).exec();

    }

    async getUserInventory({phone}): Promise<UsersWebDocument> {
        return await this.usersModel.findOne({phone}).exec();

    }
    async getUsers(): Promise<UsersWebDocument[]> {
        // @ts-ignore
        const not_empty: Array<Array<string>> = await this.googleSheetsService.importTrustedUsers()  //.filter(r => (r[0] && r[1]&& r[2]));
        const trustedUsers = await Promise.all(
            not_empty.map(
                async ([phone, role]) => await this.createTrustedUser(
                    {phone, role}
                )
            )
        );
        console.log(`Attention! Import ${trustedUsers.length} users from google sheets!`)
        return trustedUsers
    }

    async createTrustedUser({phone, role = 'newbie'}) {
        try {
            let user = await this.usersModel.findOne({phone}).exec();
            if (user == null) {
                user = new this.usersModel({
                    id: Number(phone),
                    phone,
                    first_name: '',
                    last_name: '',
                    username: '',
                    phones: [phone],
                    addresses: [],
                    first_order: true,
                    points: 0,
                    role,
                    created: moment().format()
                });
                await user.save();
            }
            await this.usersModel.updateOne({phone}, {
                $set: {
                    role
                }
            });
            return await this.getUser({phone});
        } catch (err) {
            console.error(`Could not create User phone ${phone}, err = ${err}`);
            throw err;
        }
    };

    async deleteUser(deleteUserData: deleteUserInput): Promise<UsersWebDocument> {
        return this.usersModel.findOneAndRemove(deleteUserData)

    }

    async updateId({phone, id}) {
        try {
            let user = await this.usersModel.findOne({phone}).exec();
            // if (user == null) {
            //     user = await this.createUser({ id, phone });
            // }
            // else {
            await this.usersModel.updateOne({phone}, {
                $set: {
                    id,
                    updated: moment().format()
                }
            }).exec();
            // }
            return await this.getUser({phone});
        } catch (err) {
            console.error(`Could not update User phone ${phone} to role ${id}, err = ${err}`);
            throw err;
        }
    };

    async updateFields({phone, first_name, last_name, username, id}) {
        try {
            let user = await this.usersModel.findOne({phone}).exec();
            // if (user == null) {
            //     user = await this.createUser({ id, phone });
            // }
            // else {
            await this.usersModel.updateOne({phone}, {
                $set: {
                    id,
                    first_name,
                    last_name,
                    username,
                    updated: moment().format()
                }
            }).exec();
            // }
            return await this.getUser({phone});
        } catch (err) {
            console.error(`Could not update User phone ${phone} to role ${id}, err = ${err}`);
            throw err;
        }
    }

    async updateRole({phone, id, referral_code, role, profile}) {
        try {
            let user = await this.usersModel.findOne({phone}).exec();
            // if (user == null) {
            //     user = await this.createUser({ phone, id });
            // }
            await this.usersModel.updateOne({phone}, {
                $set: {
                    referral_code,
                    role,
                    updated: moment().format(),
                    profiles: [profile],
                    last_profile: profile,
                    first_order: true
                }
            }).exec();
            await this.profilesModel.updateOne({id: profile}, {
                $set: {
                    user_id: user.id
                }
            }).exec();
            return await this.getUser({phone});
        } catch (err) {
            console.error(`Could not update User phone ${phone} to role ${role}, err = ${err}`);
            throw err;
        }
    }

    async addProfile({phone, profile}) {
        try {
            let user = await this.usersModel.findOne({phone}).exec();
            // if (user == null) {
            //     user = await this.createUser({ phone });
            // }
            const result = await this.usersModel.updateOne({phone}, {
                $push: {
                    profiles: profile
                }
            }).exec();
            return await this.getUser({phone});
        } catch (err) {
            console.error(`Could not update User phone ${phone} add profile ${profile}, err = ${err}`);
            throw err;
        }
    }

    async getUserByID({id}) {
        try {
            let user = await this.usersModel.findOne({id: id}).exec();
            if (user == null)
                return null;
            // console.log(user.toObject())
            return user.toObject();
        } catch (err) {
            console.error(`Could not get User id ${id}, err = ${err}`);
            throw err;
        }
    }

    async isAbleToGetPremiumGift({phone, category}) {
        try {
            if (category === '💎 Diamond' || category === '💠 Platinum') {
                let user = await this.usersModel.findOne({phone}).exec();
                if (user === null)
                    return null;
                let orders = user.toObject().orders;
                let giftProductOrderId = -1;
                let ordersObjects = [];
                let counter = -1;
                // поиск последнего заказа с подарком
                if (orders) {
                    for (let i of orders) {
                        counter++;
                        let order = await this.ordersService.getOrder({id: i});
                        if (order === null) {
                            continue;
                        }
                        if (order.gift_product) {
                            giftProductOrderId = counter;
                        }
                        ordersObjects.push(order);
                    }
                }
                let budsByCategories = {};
                let overallAmount = -1;
                let buds_count, extract_count, distillate_count, other_count;
                for (let i = giftProductOrderId + 1; i < ordersObjects.length; i++) {
                    if (ordersObjects[i] === null) {
                        return;
                    }
                    if (ordersObjects[i].status !== 'canceled' && ordersObjects[i].status !== 'draft') {
                        // общее кол-во товаров по категориям у выполненных заказов с последнего заказа с подарком
                        if (ordersObjects[i]._doc.augmented_products) {
                            buds_count = ordersObjects[i]._doc.augmented_products.buds_count || 0;
                            extract_count = ordersObjects[i]._doc.augmented_products.extract_count || 0;
                            distillate_count = ordersObjects[i]._doc.augmented_products.distillate_count || 0;
                            other_count = ordersObjects[i]._doc.augmented_products.other_count || 0;
                            overallAmount += buds_count + extract_count + distillate_count + other_count;
                            // кол-во шишек по категориям - складывается в словарь
                            let sortedBuds = ordersObjects[i]._doc.augmented_products.sorted_buds;
                            if (sortedBuds) {
                                for (let i = 0; i < sortedBuds.length; i++) {
                                    if (budsByCategories[sortedBuds[i].name] === undefined) {
                                        budsByCategories[sortedBuds[i].name] = 0;
                                    }
                                    let prev = budsByCategories[sortedBuds[i].name];
                                    budsByCategories[sortedBuds[i].name] = sortedBuds[i].count + prev;
                                }
                            }
                        }
                    }
                }
                // console.log(budsByCategories)
                // если больше 20% поинтов набрано, покупая продукты той категории, какой хочу в подарок — разрешить. Иначе дать алерт мол нихуя
                let proportion;
                budsByCategories['💎 Diamond'] = (budsByCategories['💎 Diamond'] === undefined) ? 0 : budsByCategories['💎 Diamond'];
                if (category === '💎 Diamond') {
                    proportion = budsByCategories[category] / overallAmount;
                } else {
                    budsByCategories['💠 Platinum'] = (budsByCategories['💠 Platinum'] === undefined) ? 0 : budsByCategories['💠 Platinum'];
                    proportion = (budsByCategories['💎 Diamond'] + budsByCategories['💠 Platinum']) / overallAmount;
                }
                let num = proportion * 100.00;
                num = parseFloat(num.toFixed(2));
                return num;
            } else {
                return 100;
            }
        } catch (err) {
            console.error(`Could not get User phone ${phone}, err = ${err}`);
            throw err;
        }
    }

    async getCart({phone}) {
        try {
            const user = await this.getUser({phone});
            if (user == null)
                return null;
            let cart_id = null;
            if (!user.cart) {
                const cart = await this.ordersService.createOrder({user});
                // @ts-ignore
                cart_id = cart.id;
                await this.usersModel.updateOne({phone}, {
                    $set: {cart}
                });
            } else {
                cart_id = user.cart.id;
            }
            return await this.ordersService.getOrder({id: cart_id});
        } catch (err) {
            console.error(`Could not create Cart for User phone ${phone}, err = ${err}`);
            throw err;
        }
    };

    async dropCart({phone}) {
        try {
            let user = await this.usersModel.findOne({phone}).exec();
            if (user == null)
                return null;
            await this.usersModel.updateOne({phone}, {
                $set: {cart: null}
            });
            return await this.getUser({phone});
        } catch (err) {
            console.error(`Could not create Cart for User phone ${phone}, err = ${err}`);
            throw err;
        }
    };

    async addOrder({phone, order}) {
        try {
            const user = await this.usersModel.findOne({phone}).exec();
            if (user == null)
                return null;
            const pushed = await this.usersModel.updateOne({phone}, {
                $push: {orders: order}
            }).exec();
            const {orders} = await this.getUser({phone});
            return orders[orders.length];
        } catch (err) {
            console.error(`Could not add Order to User phone ${phone}, err = ${err}`);
            throw err;
        }
    };

    async addToken({id, token}) {
        try {
            const user = await this.usersModel.findOne({id}).exec();
            if (user == null)
                return null;
            const pushed = await this.usersModel.updateOne({id}, {
                $push: {tokens: token}
            }).exec();
            const {tokens} = await this.usersModel.findOne({id}).exec();
            return tokens[tokens.length];
        } catch (err) {
            console.error(`Could not add Token for User id ${id}, err = ${err}`);
            throw err;
        }
    };

    // async addProfile({ id, profile }) {
    //     try {
    //         const user = await this.findOne({ id }).exec();
    //         if (user == null)
    //             return null;
    //         const pushed = await this.updateOne({ id }, {
    //             $push: { profiles: profile }
    //         }).exec();
    //         const { profiles } = await this.findOne({ id }).exec();
    //         return profiles[profiles.length];
    //     }
    //     catch (err) {
    //         console.error(`Could not add Profile for User id ${id}, err = ${err}`);
    //         throw err;
    //     }
    // };
    async addPhone({phone, _phone}) {
        try {
            const user = await this.usersModel.findOne({phone}).exec();
            if (user == null)
                return null;
            if (user.phones.includes(_phone))
                return user.phones;
            const pushed = await this.usersModel.updateOne({phone}, {
                $push: {phones: _phone}
            }).exec();
            const {phones} = await this.getUser({phone});
            return phones;
        } catch (err) {
            console.error(`Could not add phone to User phone ${phone}, err = ${err}`);
            throw err;
        }
    };

    async addAddress({phone, address}) {
        try {
            const user = await this.getUser({phone});
            if (user == null)
                return null;
            if (user.addresses.includes(address))
                return user.addresses;
            const pushed = await this.usersModel.updateOne({phone}, {
                $push: {addresses: address}
            }).exec();
            const {addresses} = await this.getUser({phone});
            return addresses;
        } catch (err) {
            console.error(`Could not add address to User phone ${phone}, err = ${err}`);
            throw err;
        }
    };

    async updateFromProfileRow({row}) {
        try {
            const [profile_id, name, address, phone, district, user_phone, id, special_instructions, points, vip] = row;
            const user = await this.usersModel.findOne({id}).exec();
            if (!user)
                return null;
            const updated = await this.usersModel.updateOne({id}, {
                $set: {
                    points: Math.max(user.points, points),
                    is_vip: !!vip
                }
            }).exec();
            return await this.usersModel.find({id}).exec();
        } catch (err) {
            console.error(`Could not update from row ${row}, err = ${err}`);
            throw err;
        }
    };

    async getInventory({id}) {
        try {
            let user = await this.usersModel.findOne({id}).exec();
            if (!user)
                return null;
            let inventory;
            if (user.inventory) {
                inventory = await this.inventoriesModel.findOne({id: user.inventory}).exec();
                if (inventory)
                    return inventory;
                else
                    user.inventory = null;
            }
            if (!user.inventory) {
                inventory = await this.inventoriesService.create({owner_id: user.id});
                await this.usersModel.updateOne({id}, {
                    $set: {
                        inventory: inventory.id
                    }
                }).exec();
                return inventory;
            }
            return inventory;
        } catch (err) {
            console.error(`Could not get inventory of User id ${id}, err = ${err}`);
            throw err;
        }
    };

    async setDiscountForNextOrder({phone, discount, date}) {
        //console.log(phone, discount, date);
        try {
            if (!phone || typeof phone !== 'string') {
                return null;
            }
            const user = await this.getUser({phone});
            if (user == null)
                return null;
            await this.usersModel.updateOne({phone}, {
                $set: {
                    next_order_discount: {
                        amount: discount,
                        start_date: date
                    }
                }
            }).exec();
            const {next_order_discount} = await this.getUser({phone});
            return next_order_discount;
        } catch (err) {
            console.error(`Could not add discount to User phone ${phone}, err = ${err}`);
            throw err;
        }
    };

    async kickUser({phone}) {
        try {
            const user = await this.getUser({phone});
            if (user == null)
                return null;
            await this.usersModel.updateOne({phone}, {
                $unset: {next_order_discount: "", notification: ""},
            }).exec();
            if (user.cart) {
                await this.usersModel.updateOne({phone}, {
                    $set: {
                        role: "newbie",
                        'cart.user.role': "newbie",
                        next_order_discount: {}
                    }
                }).exec();
            } else {
                await this.usersModel.updateOne({phone}, {
                    $set: {
                        role: "newbie",
                        next_order_discount: {}
                    }
                }).exec();
            }
            return await this.getUser({phone});
        } catch (err) {
            console.error(`Could not set a notification to user ${phone}, err = ${err}`);
            throw err;
        }
    };

    async addNotification({phone, five_week, seven_week}) {
        try {
            const user = await this.getUser({phone});
            if (user == null)
                return null;
            await this.usersModel.updateOne({phone}, {
                $set: {notification: {five_week_expired: five_week, seven_week_expired: seven_week}}
            }).exec();
            return await await this.getUser({phone});
        } catch (err) {
            console.error(`Could not set anotification to user ${phone}, err = ${err}`);
            throw err;
        }
    }

    async setUserFirstName(input) {
        try {
            const phone = input.phone
            const first_name = input.first_name
            const user = await this.getUser({phone});
            if (user == null)
                return null;
            await this.usersModel.updateOne({phone}, {
                $set: {first_name}
            }).exec();
            return await await this.getUser({phone});
        } catch (err) {
            console.error(`Could not set first_name to user ${input.phone}, err = ${err}`);
            throw err;
        }
    }

    async newProfileFalse(input) {
        try {
            const phone = input.phone
            const user = await this.getUser({phone});
            if (user == null)
                return null;
            await this.usersModel.updateOne({phone}, {
                $set: {
                    new_profile: false,
                    cart: null
                }
            }).exec();
            return await this.getUser({phone});
        } catch (err) {
            console.error(`Could not set first_name to user ${input.phone}, err = ${err}`);
            throw err;
        }
    }

    async setUseSafari(input) {
        try {
            const phone = input.phone
            const user = await this.getUser({phone});
            if (user == null)
                return null;
            await this.usersModel.updateOne({phone}, {
                $set: {use_safari: true}
            }).exec();
            return await this.getUser({phone});
        } catch (err) {
            console.error(`Could not set first_name to user ${input.phone}, err = ${err}`);
            throw err;
        }
    }

    async referFriend(input) {
        const address_friend = input.address_friend
        const phoneUser = input.phone
        const phone_friend = input.phone_friend
        const user = await this.usersModel.findOne({phoneUser});
        if (user === null || !user.id) {
            return;
        }
        const token = Math.floor(1000 + Math.random() * 9000)
        const id = Math.floor(1000 + Math.random() * 9000000000)
        const newUser = await new this.usersModel({
            id: id,
            first_name: 'Guest',
            last_name: 'Guest',
            username: 'Guest',
            phone: phone_friend,
            phones: [phone_friend],
            addresses: [address_friend],
            role: 'trusted',
            first_order: true,
            points: 0,
            tokens: [token],
            token,
            new_profile: true,
            created: moment().format(),
        })
        const referFriend = await newUser.save()
        let profile = await this.profilesService.createProfileFriend({
            user_id: newUser.id,
            address: address_friend,
            phone: phone_friend,
            friend: phoneUser
        });
        const newProfile = await profile.save();
        await this.usersController.getReferFriend(newProfile, referFriend)
        return user


    }
}
