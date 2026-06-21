import {forwardRef, Inject, Injectable} from "@nestjs/common";
import {createOrderInput} from "./dto/input/create-order.input";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {v4 as uuidv4} from 'uuid';
import {GetOrderArgs} from "./dto/args/get-order.args";
import {Comments, OrdersWeb, OrdersWebDocument} from "./schemas/orders.schemas";
import moment from "moment";
import {UsersWeb, UsersWebDocument} from "../users/schemas/users.schemas";
import {UsersService} from "../users/users.service";
import {RoutesWeb} from "../routes/interfaces/routes.interface";
import {ScriptsService} from "../scripts/scripts.service";
import {GoogleSheetsService} from "../sheets/google-sheets.service";
import {ProductsService} from "../products/products.service";
import {InventoriesService} from "../inventories/inventories.service";

@Injectable()
export class OrdersService {
    constructor(@InjectModel(OrdersWeb.name) private ordersModel: Model<OrdersWebDocument>,
                @InjectModel(UsersWeb.name) private usersModel: Model<UsersWebDocument>,
                @InjectModel('RoutesWeb') private readonly routesModel: Model<RoutesWeb>,
                @Inject(forwardRef(() => UsersService))
                private readonly usersService: UsersService,
                @Inject(forwardRef(() => InventoriesService))
                private readonly inventoriesService: InventoriesService,
                private readonly scriptsService: ScriptsService,
                @Inject(forwardRef(() => ProductsService)) private readonly productsService: ProductsService,
                private readonly googleSheetsService: GoogleSheetsService) {
    }



    async getOrders(phone): Promise<OrdersWebDocument[]> {
        return await this.ordersModel.find(phone).exec();
    }

    async getDraftOrders(phone): Promise<OrdersWebDocument> {
        try {
            let order = await this.ordersModel.findOne(phone).exec();
            if (order == null) return null;
            return order;
        } catch (err) {
            console.error(`Could not get DraftOrders phone = ${phone}, err = ${err}`);
            throw err;
        }
    }

    async getOrderComments(phone): Promise<Comments[]> {
        try {
            let order = await this.ordersModel.findOne(phone).exec();
            if (order == null) return null;
            return order.comments
        } catch (err) {
            console.error(`Could not get OderComments phone = ${phone}, err = ${err}`);
            throw err;
        }
    }


    async getOrder(GetOrderArgs: GetOrderArgs): Promise<OrdersWebDocument> {
        try {
            let order = await this.ordersModel.findOne(GetOrderArgs).exec();
            if (order == null) return null;
            return order;
        } catch (err) {
            console.error(`Could not get Order id ${GetOrderArgs}, err = ${err}`);
            throw err;
        }
    }

    async createdOrder(createOrderData: createOrderInput): Promise<OrdersWebDocument> {
        const createdOrder = new this.ordersModel(createOrderData);
        return await createdOrder.save();
    }

    async createUserOrder(input) {
        const phone = input.phone
        const products = input.products
        const delivery = input.delivery
        try {

            let user = await this.usersModel.findOne({phone}).exec();
            if (user == null) return null;
            let id = '0';
            do {
                id = Math.floor(1000 + Math.random() * 90000).toString()
            } while (await this.ordersModel.findOne({id}).exec());
            await this.usersModel.findOneAndUpdate({phone}, {$push: {orders: Number(id)}}).exec()
            const routes = await this.routesModel.find({}).exec()
            const driver_id = await this.scriptsService.getDriver(routes, delivery.district, delivery.date, delivery.timeslot)
            const {order, cart} = await this.scriptsService.formatOrder(products, delivery, user, id, phone, driver_id)
            // let updateTable = {
            //     products: await this.scriptsService.formatOrderForUpdate(order.products),
            //     orderId: id,
            //     driverId: driver_id
            // }
            // await this.updateProducts(updateTable)
            await this.ordersModel.create(order)
            await this.usersModel.findOneAndUpdate({phone}, {$set: {cart}}, {new: true}).exec()
            const driver = await this.usersModel.findOne({phone: driver_id}).exec()
            if(order.product_list) {
                order.product_list.map(async i => {
                    // await this.inventoriesService.reserveProductTGBOT({driver_id: driver_id, id: driver.inventory, order_id: id, product: i })
                    await this.inventoriesService.changeProducts({id: driver.inventory, product: i })

                    await this.inventoriesService.changeProductsTGBOT({ driver_id: driver_id, product: i, order_id: id,  })
                    await this.inventoriesService.reserveProduct({id: driver.inventory, order_id: id, product: i })

                })
            }
            const lastOrder = await this.ordersModel.findOne({id}).exec()
            // const countPoints = await this.scriptsService.checkOrder(user.id, lastOrder)
            // console.log('countPoints:', countPoints)
            // await this.scriptsService.usePoints(phone, lastOrder)
            await this.scriptsService.orderCreateNotification(phone)
            return lastOrder
        } catch (err) {
            console.error(`Could not create Order for user ${phone}, err = ${err}`);
            throw err;
        }
    }
    async updateOrder(input) {
        const {phone, id, products} = input
        try {
            let user = await this.usersModel.findOne({phone}).exec();
            let currentOrder = await this.ordersModel.findOne({id}).exec()
            if (user == null) return null;

            // points.removePoints(user.id, currentOrder)

            const {order, cart} = await this.scriptsService.updateOrderFormat(products, user, id, phone, currentOrder)
            //update google sheet
            // let updateTable = {
            //     lastProducts: await this.scriptsService.formatOrderForUpdate(currentOrder.products),
            //     products: await this.scriptsService.formatOrderForUpdate(products),
            //     orderId: id,
            //     driverId: currentOrder.driver_id
            // }
            // await this.updateProducts(updateTable, 'update order')

            await this.ordersModel.updateOne({id}, {$set: order}, {new: true}).exec()
            await this.usersModel.findOneAndUpdate({phone}, {$set: {cart}}, {new: true}).exec()
            const driver = await this.usersModel.findOne({phone: currentOrder.driver_id}).exec()
            // console.log('driver:', driver)
            if(currentOrder.product_list) {
                currentOrder.product_list.map(async i => {
                    // await this.inventoriesService.redeemProductTGBOT({driver_id: currentOrder.driver_id, id: driver.inventory, order_id: id, product: i })
                    await this.inventoriesService.redeemProduct({id: driver.inventory, order_id: id, product: i })
                    // await this.inventoriesService.changeAvailableProductsTGBOT({driver_id: currentOrder.driver_id, id: driver.inventory, product: i })
                    await this.inventoriesService.changeAvailableProducts({id: driver.inventory, product: i })
                })
            }


            order.product_list.map(async i => {
                await this.inventoriesService.changeProducts({id: driver.inventory, product: i })
                await this.inventoriesService.changeProductsTGBOT({ driver_id: currentOrder.driver_id, product: i, order_id: id,  })
                // await this.inventoriesService.reserveProductTGBOT({driver_id: currentOrder.driver_id, id: driver.inventory, order_id: id, product: i })
                await this.inventoriesService.reserveProduct({id: driver.inventory, order_id: id, product: i })
                })

            return await this.ordersModel.findOne({id}).exec()
        } catch (err) {
            console.error(`Could not get Order id ${id}, err = ${err}`);
            throw err;
        }
    }
    async deleteOrder(input): Promise<any> {
        // console.log('input:',input)
        const phone = input.phone;
        const id = input.id;
        try {
            let user = await this.usersModel.findOne({phone}).exec();
            let currentOrder = await this.ordersModel.findOne({id}).exec();
            if (user == null || currentOrder === null) return null;

            // let updateTable = {
            //     lastProducts: await this.scriptsService.formatOrderForUpdate(currentOrder.products),
            //     orderId: id,
            //     driverId: currentOrder.driver_id
            // }
            // await this.updateProducts(updateTable, 'remove order')


            //update points after remove the order - flag true = means that this order is to be deleted
            // await this.scriptsService.updatePoints(phone, currentOrder, true)

            await this.usersModel.findOneAndUpdate(
                {phone},
                {$pull: {orders: Number(id)}},
                {new: true}).exec()
            await this.usersModel.findOneAndUpdate(
                {phone},
                {$set: {cart: null}},
                {new: true}).exec()

            const driver = await this.usersModel.findOne({phone: currentOrder.driver_id}).exec()
            // console.log('driver:', driver)
            if(currentOrder.product_list) {
                currentOrder.product_list.map(async i => {
                    // await this.inventoriesService.changeAvailableProductsTGBOT({driver_id: currentOrder.driver_id, id: driver.inventory, product: i })
                    await this.inventoriesService.changeAvailableProducts({id: driver.inventory, product: i })
                    // console.log('input.bot:',input.bot)
                    if(!input.bot) {
                        // await this.inventoriesService.redeemProductTGBOT({driver_id: currentOrder.driver_id, id: driver.inventory, order_id: id, product: i })
                    }
                    await this.inventoriesService.redeemProduct({id: driver.inventory, order_id: id, product: i })


                })
            }


            // console.log('driver.inventory:', driver.inventory)
            // console.log('order.product_list:', currentOrder.product_list)
            await this.scriptsService.orderStatusNotification(phone, currentOrder,  'canceled')
            const removeOrder = await this.ordersModel.findOneAndDelete({id}).exec();
            return id
        } catch (err) {
            console.error(`Could not get Order id ${id}, err = ${err}`);
            throw err;
        }

    }
    async updateProducts(order: any, status: string = 'new order') {
        //console.log('update');

        const auth = await this.googleSheetsService.authGoogleSheets();
        const rows = await this.googleSheetsService.getSheetsProductsForAppAll(auth) as any[];

        let data = []
        const products = []

        switch (status) {
            case 'new order':
                data = await this.scriptsService.updateTable_newOrder(rows, order)
                break;
            case 'update order':
                data = await this.scriptsService.updateTable_removeOrder(rows, order)
                //console.log('order:',order)
                data = await this.scriptsService.updateTable_newOrder(data, order)
                break;
            case 'remove order':
                data = await this.scriptsService.updateTable_removeOrder(rows, order)
                break;
            case 'completed order':
                data = await this.scriptsService.updateTable_CompletedOrder(rows, order)
                break;
            case 'change week':
                data = await this.scriptsService.updateTableARS(rows)
                break;
        }
        JSON.stringify(data)
        //console.log('update row');
        await this.googleSheetsService.updateSheetForAppNewt(auth, data)

        for (let i = 0; i < data.length; i++) {
            const res = await this.productsService.updateFromRow(data[i])
            products.push(res)
        }
    }
    async updateSheetsFromChangeWeek(status: string = 'change week') {
        //console.log('update');

        const auth = await this.googleSheetsService.authGoogleSheets();
        const rows = await this.googleSheetsService.getSheetsProductsForAppAll(auth) as any[];

        let data = []
        const products = []

        switch (status) {
            case 'change week':
                data = await this.scriptsService.updateTableARS(rows)
                break;
        }
        JSON.stringify(data)
        //console.log('update row');
        await this.googleSheetsService.updateSheetForAppNewt(auth, data)

        for (let i = 0; i < data.length; i++) {
            const res = await this.productsService.updateFromRow(data[i])
            products.push(res)
        }
    }
    async createOrder({
                          user,
                          products = [],
                          status = 'draft'
                      }): Promise<null | object> {
        try {
            const id = uuidv4();
            await this.getOrder({id})
            const created = moment().format();
            let order = new this.ordersModel({
                id,
                user,
                status,
                created,
                products
            });

            await order.save();
            const {phone} = user;
            await this.usersService.addOrder({
                phone: user.phone,
                order: id
            });

            return await this.getOrder({id});
        } catch (err) {
            console.error(`Could not create Order for user ${user}, err = ${err}`);
            throw err;
        }
    };

    async updateStatus({
                           id,
                           status,
                           driver_id,
                           inventory
                       }): Promise<null | object> {
        try {
            const order = await this.ordersModel.findOne({id}).exec();

            if (order == null) return null;

            const updated = await this.ordersModel.updateOne({id}, {
                $set: {
                    status,
                    driver_id: driver_id || order.driver_id,
                    inventory: inventory || order.inventory,
                    updated: moment().format()
                }
            }).exec();

            return await this.ordersModel.findOne({id}).exec();
        } catch (err) {
            console.error(`Could not create Order id ${id}, err = ${err}`);
            throw err;
        }
    }

    async addProduct({
                         id,
                         product,
                         amount
                     }): Promise<null | object> {
        try {
            if (!amount) {
                amount = 1;
            }
            let order = await this.ordersModel.findOne({id}).exec();
            if (order == null) return null;
            const products = [];
            for (let i = 0; i < amount; i++) {
                products.push(product);
            }

            const updated = await this.ordersModel.updateOne(
                {id},
                {$push: {products: {$each: products}}}
            )

            return await this.getOrder({id});
        } catch (err) {
            console.error(
                `Could not add product ${product} to Order id ${id}, err = ${err}`
            );
            throw err;
        }
    }

    async setProductMap({
                            id,
                            product_map
                        }): Promise<null | object> {
        try {
            let order = await this.ordersModel.findOne({id}).exec();
            if (order == null) return null;

            const products = Object.keys(product_map).reduce(
                (a, p) => {
                    const count = Math.max(product_map[p], 0);
                    return a.concat(
                        (new Array(count)).fill(p)
                    );
                }, []
            );

            if (order.gift_product) {
                const gift = products.indexOf(order.gift_product);
                if (gift >= 0) {
                    products.splice(gift, 1);
                } else {
                    const removed_gift = await this.ordersModel.updateOne({id}, {
                        $set: {gift_product: null}
                    }).exec();
                }
            }

            const updated = await this.ordersModel.updateOne({id}, {
                $set: {products}
            }).exec();

            return await this.getOrder({id});
        } catch (err) {
            console.error(
                `Could not set product_map for Order id ${id}, err = ${err}`
            );
            throw err;
        }
    }

    async clearProducts({
                            id
                        }): Promise<null | object> {
        try {
            let order = await this.ordersModel.findOne({id}).exec();
            if (order == null) return null;

            const updated = await this.ordersModel.updateOne({id}, {
                $set: {
                    products: [],
                    gift_product: null
                }
            }).exec();

            return await this.getOrder({id});
        } catch (err) {
            console.error(`Could not add product to Order id ${id}, err = ${err}`);
            throw err;
        }
    }

    async removeProduct({
                            id,
                            product
                        }): Promise<null | object> {
        try {
            let order = await this.ordersModel.findOne({id}).exec();
            if (order == null) return null;

            const found = order.products.lastIndexOf(product);
            // console.log('gift product in curr order : ')
            // console.log(found)

            if (found >= 0) {
                const removed = order.products.splice(found, 1);

                const updated = await this.ordersModel.updateOne({id}, {
                    $set: {products: order.products}
                }).exec();

                return removed[0];
            }

            return null;
        } catch (err) {
            console.error(`Could not add product to Order id ${id}, err = ${err}`);
            throw err;
        }
    }

    async addPhone({
                       id,
                       phone
                   }): Promise<null | object> {
        try {
            const order = await this.ordersModel.findOne({id}).exec();
            if (order == null) return null;

            await this.usersService.addPhone({
                phone: order.user.phone,
                _phone: phone
            });

            const updated = await this.ordersModel.updateOne({id}, {
                $set: {phone}
            }).exec();

            return await this.getOrder({id});
        } catch (err) {
            console.error(
                `Could not set phone ${phone} to order ${id}, err = ${err}`
            );
            throw err;
        }
    }

    async addAddress({
                         id,
                         address
                     }): Promise<null | object> {
        try {
            const order = await this.getOrder({id});
            if (order == null) return null;

            await this.usersService.addAddress({
                phone: order.user.phone,
                address
            });

            const updated = await this.ordersModel.updateOne({id}, {
                $set: {address}
            }).exec();

            return await this.getOrder({id});
        } catch (err) {
            console.error(
                `Could not set address ${address} to order ${id}, err = ${err}`
            );
            throw err;
        }
    }

    async addDistrict({
                          id,
                          district
                      }): Promise<null | object> {
        try {
            const order = await this.getOrder({id});
            if (order == null) return null;

            const updated = await this.ordersModel.updateOne({id}, {
                $set: {district}
            });

            return await this.getOrder({id});
        } catch (err) {
            console.error(
                `Could not set address ${district} to order ${id}, err = ${err}`
            );
            throw err;
        }
    }

    async addComment({
                         id,
                         comment
                     }): Promise<null | object> {
        try {
            const order = await this.getOrder({id});
            if (order == null) return null;

            comment.created = moment().format();

            const updated = await this.ordersModel.updateOne({id}, {
                $push: {comments: comment}
            }).exec();

            return await this.getOrder({id});
        } catch (err) {
            console.error(
                `Could not add comment ${comment} to order ${id}, err = ${err}`
            );
            throw err;
        }
    }

    async addProfile({
                         id,
                         profile
                     }): Promise<null | object> {
        try {
            const order = await this.ordersModel.findOne({id}).exec();
            if (order == null) return null;

            const updated = await this.ordersModel.updateOne({id}, {
                $set: {profile}
            }).exec();

            return await this.getOrder({id});
        } catch (err) {
            console.error(
                `Could not set profile ${profile} to order ${id}, err = ${err}`
            );
            throw err;
        }
    }

    async addDiscount({
                          id,
                          discount,
                          new_total
                      }): Promise<null | object> {
        try {
            const order = await this.getOrder({id});
            if (order == null) return null;

            await this.ordersModel.updateOne({id}, {
                $set: {
                    total_after_discount: new_total,
                    used_discount: {amount: discount}
                }
            }).exec();

            return await this.getOrder({id});
        } catch (err) {
            console.error(
                `Could not set discount ${discount} to order ${id}, err = ${err}`
            );
            throw err;
        }
    }

    async addGiftPair({
                          id,
                          gift_pair,
                          product
                      }): Promise<null | object> {
        try {
            const order = await this.getOrder({id});
            if (order == null) return null;

            await this.ordersModel.updateOne({id}, {
                $push: {
                    got_gift_pairs: gift_pair,
                    products: product
                }
            }).exec();

            return await this.getOrder({id});

        } catch (err) {
            console.error(
                `Could not add gift pair to order ${id}, err = ${err}`
            );
            throw err;
        }
    }

    async removeGiftPair({
                             id,
                             gift_pair
                         }): Promise<null | object> {
        try {
            let order = await this.ordersModel.findOne({id}).exec();
            if (order == null) return null;

            const delete_pair = order.got_gift_pairs.filter(pair => pair.id !== gift_pair.id)

            if (delete_pair.length > 0) {

                const updated = await this.ordersModel.updateOne({id}, {
                    $set: {got_gift_pairs: delete_pair}
                }).exec();

            }

            return null;

        } catch (err) {
            console.error(`Could not add product to Order id ${id}, err = ${err}`);
            throw err;
        }
    }

    async removeAllGiftPairs({
                                 id
                             }): Promise<null | object> {
        try {
            let order = await this.ordersModel.findOne({id}).exec();
            if (order == null) return null;

            const updated = await this.ordersModel.updateOne({id}, {
                $set: {got_gift_pairs: []}
            }).exec();

            return null;

        } catch (err) {
            console.error(`Could not add product to Order id ${id}, err = ${err}`);
            throw err;
        }
    };
}
