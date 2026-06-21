import {Controller, forwardRef, Get, Post, Res, Req, Inject} from '@nestjs/common';
import {ClientProxy, EventPattern} from '@nestjs/microservices';
import {NewOrder, OrderId, Warning} from './new-order.event';
import {ScriptsService} from "../scripts/scripts.service";
import {UsersService} from "../users/users.service";
import {OrdersService} from "./orders.service";
import {InjectModel, Prop} from "@nestjs/mongoose";
import {UsersWeb, UsersWebDocument} from "../users/schemas/users.schemas";
import {Model} from "mongoose";
import {OrdersWeb, OrdersWebDocument} from "./schemas/orders.schemas";
import {InventoriesService} from "../inventories/inventories.service";
const moment = require("moment");
const webPush = require("web-push");

const vapidKey = {
    publicKey: 'BCPZdsNw8jmtJ5Uxde6NMIJlekUsaXj7VMKRXCOdbBGYosB20kM-wKqPr8DO5pbqriZktlLjI5NhOwruHDG69ho',
    privateKey: '9ns_HgoLWY1H9WoYzIgBTBKUhZndS2fMBdL65o5ferE'
}


// console.log(webPush.generateVAPIDKeys())

@Controller()
export class OrdersController {
    constructor(@Inject('CREATE_ORDER') private readonly client: ClientProxy,
                @InjectModel(UsersWeb.name) private usersModel: Model<UsersWebDocument>,
                @InjectModel(OrdersWeb.name) private ordersModel: Model<OrdersWebDocument>,
                private readonly scriptsService: ScriptsService,
                @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
                private readonly ordersService: OrdersService,
                @Inject(forwardRef(() => InventoriesService)) private readonly inventoriesService: InventoriesService,
    ) {
    }

    async onApplicationBootstrap() {
        await this.client.connect();

    }

    @Post('api/graphql/notifications/subscribe')
    async webPushNotification(@Req() req, @Res() res) {

        await webPush.setVapidDetails("mailto: `terra.menu`", vapidKey.publicKey, vapidKey.privateKey)
        console.log(req.body);
        const payload = JSON.stringify({
            title: req.body.title,
            description: req.body.description,
            icon: req.body.icon
        })

        webPush.sendNotification(req.body.subscription, payload)
            .then(result => console.log('result:',result))
            .catch(e => console.log(e.stack))
        res.status(200).json({'success': true})
    }

    @Get()
    getAvailableWarning(warning) {
        // console.log('warning:',warning)
        this.client.emit<any>('available_warning', new Warning(warning));
        return console.log('Products are running out:', warning)
    }

    @Get()
    getCreatedOrder(newOrder) {
        this.client.emit<any>('create_order', new NewOrder(newOrder));
        return console.log('New order send to TG-BOT:', newOrder)
    }

    @Get()
    getDeleteOrder(orderId) {
        this.client.emit<any>('delete_order', new OrderId(orderId));
        return orderId
    }

    @Get()
    getUpdateOrder(newOrder) {
        this.client.emit<any>('update_order', new NewOrder(newOrder));
        return console.log('Update order send to TG-BOT:', newOrder)
    }

    @EventPattern("BOT_ORDER")
    async getOrderFromTG_BOT(data: Record<string, unknown>) {
        if (data.toString() === 'Order no approved') {
            console.log('Order no approved')
        }
        if (data.toString() !== 'Order no approved') {
            // @ts-ignore
            const order = JSON.parse(data)
            const phone = order.phone
            const status = order.status
            const inputDeleteOrder = {
                phone,
                id: order.id,
                bot: true
            }
            const user = await this.usersModel.findOne({phone}).exec()
            if(!user) return null
            if (status === 'approved') {
                const webOrder = await this.ordersModel.findOne({id: order.id}).exec()
                await this.scriptsService.orderStatusNotification(phone, webOrder, status)
                await this.ordersModel.findOneAndUpdate({id: order.id}, {$set: {status: order.status}}).exec()
                if(user.use_safari) {
                    await this.usersService.sendSmsFromChangeOrder(phone, `Your order №${order.id} is accepted!`)
                }
            }
            if (status === 'completed') {
                const id = order.id
                const orderWeb = await this.ordersModel.findOne({id: order.id}).exec()
                await this.scriptsService.checkOrder(user.id, orderWeb)
                await this.ordersModel.findOneAndUpdate({id: order.id}, {$set: {status: order.status, isClose: true}}).exec()
                await this.scriptsService.orderStatusNotification(phone, orderWeb, status)

                // let updateTable = {
                //     lastProducts: await this.scriptsService.formatOrderForUpdate(orderWeb.products),
                //     products: await this.scriptsService.formatOrderForUpdate(orderWeb.products),
                //     orderId: order.id,
                //     driverId: orderWeb.driver_id
                // }
                // await this.ordersService.updateProducts(updateTable, 'completed order')

                const expired = moment().add(3, 'd').format()
                const five_weeks_limited = moment().add(5, 'week').format()
                const six_weeks_limited = moment().add(6, 'week').format()
                const seven_weeks_limited = moment().add(7, 'week').format()
                console.log('expired:',expired ,five_weeks_limited, six_weeks_limited, seven_weeks_limited)
                await this.usersModel.updateOne({phone}, {
                    $set: {
                        cart: null,
                        limited: expired,
                        five_weeks_limited,
                        six_weeks_limited,
                        seven_weeks_limited
                    }
                }).exec();

                const driver = await this.usersModel.findOne({phone: orderWeb.driver_id}).exec()
                if(orderWeb && orderWeb.product_list) {
                    orderWeb.product_list.map(async i => {
                        await this.inventoriesService.redeemProduct({id: driver.inventory, order_id: order.id, product: i })
                        await this.inventoriesService.addSold({id: driver.inventory, order_id: order.id, product: i })
                    })
                }
                if(user.use_safari) {
                    await this.usersService.sendSmsFromChangeOrder(phone, `Your order №${order.id} is completed!`)
                }
                this.client.close()

            }
            if (status === 'etf') {
                await this.scriptsService.orderStatusNotification(phone, order, status)
                const id = order.id
                const orderWeb = await this.ordersModel.findOne({id}).exec()
                // let updateTable = {
                //     lastProducts: await this.scriptsService.formatOrderForUpdate(orderWeb.products),
                //     products: await this.scriptsService.formatOrderForUpdate(orderWeb.products),
                //     orderId: id,
                //     driverId: orderWeb.driver_id
                // }
                // await this.ordersService.updateProducts(updateTable, 'completed order')

                await this.usersModel.updateOne({phone}, {
                    $set: {
                        cart: null
                    }
                }).exec();
                await this.ordersModel.findOneAndUpdate({id: order.id}, {$set: {status: order.status, isClose: true}}).exec()
                const driver = await this.usersModel.findOne({phone: orderWeb.driver_id}).exec()
                if(orderWeb && orderWeb.product_list) {
                    orderWeb.product_list.map(async i => {
                        await this.inventoriesService.redeemProduct({id: driver.inventory, order_id: id, product: i })
                        await this.inventoriesService.addSold({id: driver.inventory, order_id: id, product: i })
                    })
                }
                if(user.use_safari) {
                    await this.usersService.sendSmsFromChangeOrder(phone, `Your order №${order.id} is completed!`)
                }

                await this.client.close()
            }
            if (status === 'canceled') {

                await this.ordersModel.findOneAndUpdate({id: order.id}, {$set: {status: order.status, isClose: true}}).exec()
                await this.scriptsService.orderStatusNotification(phone, order, status)
                await this.ordersService.deleteOrder(inputDeleteOrder)
                if(user.use_safari) {
                    await this.usersService.sendSmsFromChangeOrder(phone, `Your order №${order.id} is canceled!`)
                }
                await this.client.close()
            }
            if (status === 'in 20 min' || 'in 10 min' || 'in 5 min' || 'here') {
                await this.ordersModel.findOneAndUpdate({id: order.id}, {$set: {status: order.status}}).exec()
                await this.scriptsService.orderStatusNotification(phone, order, status)
            }
            if (status === 'etf-completed') {
                const orderWeb = await this.ordersModel.findOne({id: order.id}).exec()
                const expired = moment().add(3, 'd').format()
                const five_weeks_limited = moment().add(5, 'week').format()
                const six_weeks_limited = moment().add(6, 'week').format()
                const seven_weeks_limited = moment().add(7, 'week').format()
                console.log('expired:',expired ,five_weeks_limited, six_weeks_limited, seven_weeks_limited)
                await this.usersModel.updateOne({phone}, {
                    $set: {
                        limited: expired,
                        five_weeks_limited,
                        six_weeks_limited,
                        seven_weeks_limited
                    }
                }).exec();
                await this.scriptsService.checkOrder(user.id, orderWeb)
                await this.scriptsService.orderStatusNotification(phone, order, status)
                if(user.use_safari) {
                    await this.usersService.sendSmsFromChangeOrder(phone, `We received your payment for this order №${order.id}. Thank you!`)
                }
            }
            console.log(`Order ${order.id} status: ${order.status}`)
        }
    }

}