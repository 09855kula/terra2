import {forwardRef, Inject, Injectable} from "@nestjs/common";
import {UsersService} from "../users/users.service";
import {UsersWeb, UsersWebDocument} from "../users/schemas/users.schemas";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {GoogleSheetsService} from "../sheets/google-sheets.service";
import {OrdersWeb, OrdersWebDocument, OrdersWebSchemas} from "../orders/schemas/orders.schemas";

const moment = require("moment");
const momentTZ = require('moment-timezone');
const MAX_POINTS = 20;
const map = {
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6,
    'Sunday': 7
};

const map_day = {
    0: 'Monday',
    1: 'Tuesday',
    2: 'Wednesday',
    3: 'Thursday',
    4: 'Friday',
    5: 'Saturday',
    6: 'Sunday'
};

const map_index = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
]

@Injectable()
export class ScriptsService {
    constructor(
        @InjectModel(UsersWeb.name) private readonly usersModel: Model<UsersWebDocument>,
        @InjectModel(OrdersWeb.name) private ordersModel: Model<OrdersWebDocument>,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        private readonly googleSheetsService: GoogleSheetsService,
    ) {
    }

    //================================Points============================//
    async checkOrder(id, order) {
        const user = await this.usersModel.findOne({id}).exec()
        const orderWeb = await this.ordersModel.findOne({id: order.id}).exec()
        // const user = await this.usersModel.findOne({phone})
        if (!user && !orderWeb) return null
        const {first_order, orders} = user;
        // console.log('orderWeb++++++++++++++:', orderWeb);
        let pointClient
        if (first_order && orders.length <= 1) {

                // this for new
                await this.usersModel.updateOne({id}, {
                    $inc: {points: 4}
                }).exec();
                await this.usersModel.updateOne({id}, {
                $set: {first_order: false}
            }).exec();
            pointClient = 4
        }
         else {
            await this.usersModel.updateOne({id}, {
                $set: {first_order: false}
            }).exec()
            const {total_after_discount, is_use_point, used_discount} = orderWeb
            const multiplier = (user.is_vip) ? 1.5 : 1;
            const points = Math.min(Math.floor(total_after_discount / 50), MAX_POINTS) * multiplier;
            //
            const count = user.points;
            // console.log('points', points);
            // console.log('count', count);
            // console.log('is_use_point', is_use_point);

            const accessPoints = count % 2 === 0 ? count : count - 1;
            // console.log('accessPoints', accessPoints);
            const different = (count + points);
            // console.log('different', different);
            const differentPoints = (count + points) - accessPoints;
            const used_discountPoints = (count + points) - used_discount?.amount;
            // console.log('differentPoints', differentPoints);
            // console.log('used_discountPoints', used_discountPoints);

            if (is_use_point) {
                // console.log('isUse', points)
                //work fine
                await this.usersModel.updateOne({id}, {
                    $set: {points: used_discountPoints}
                }).exec();
                pointClient = used_discountPoints
            } else {
                // console.log('isNoUse', points)
                await this.usersModel.updateOne({id}, {
                    $inc: {points: differentPoints}
                }).exec();
                pointClient = differentPoints

            }

        }
         // console.log('pointClient:',pointClient)
            return pointClient
    }

    async orderPoints(phone, order) {
        const user = await this.usersModel.findOne({phone}).exec()
        if (!user && !order) return null
        console.log('order:',order)
        const {total_after_discount, is_use_point, used_discount} = order

        const multiplier = (user.is_vip) ? 1.5 : 1;
        const points = Math.min(Math.floor(total_after_discount / 50), MAX_POINTS) * multiplier;
        //
        const count = user.points;
        console.log('points', points);
        console.log('count', count);
        console.log('is_use_point', is_use_point);

        // const accessPoints = count % 2 === 0 ? count : count - 1;
        // const isUsePoints = is_use_point;
        // const differentPoints = (count + points) - accessPoints;
        // const differentPoints = (count + points) - used_discount?.amount;

        if (is_use_point) {
            console.log('isUse', points)
            //work fine
            await this.usersModel.updateOne({phone}, {
                $set: {points: points}
            }).exec();
        } else {
            console.log('isNoUse', points)
            await this.usersModel.updateOne({phone}, {
                $inc: {points: points}
            }).exec();
        }

        return Math.floor(points * 2.5)
    }

    async usePoints(phone, order) {
        const user = await this.usersModel.findOne({phone}).exec()
        if (!user && !order) return null

        const {total_after_discount, is_use_point, used_discount} = order

        const points = user.points;
        // console.log('is_use_point', is_use_point);

        const differentPoints = points - used_discount?.amount;
        if (is_use_point) {
            await this.usersModel.updateOne({phone}, {
                $set: {points: differentPoints}
            }).exec()
        }

    }

    async updatePoints(phone: string, order, deleteOrder: boolean = false) {
        const user = await this.usersModel.findOne({phone}).exec()
        // const order = await orders.findOne({orderId})
        //console.log('user', user.id);
        //console.log(user)
        if (!user && !order) return null

        const {total_after_discount, is_use_point, used_discount} = order

        const multiplier = (user.is_vip) ? 1.5 : 1;
        const points = Math.min(Math.floor(total_after_discount / 50), MAX_POINTS) * multiplier;
        //
        const count = user?.points;
        const lastPoints = used_discount?.amount
        //console.log('points', points);
        //console.log('total_after_discount', total_after_discount);

        const updatedPoints = count + points
        // const removeOrder = (count - points) + lastPoints
        const removeOrder = lastPoints
        const withoutDiscount = count - points


        if (is_use_point) {
            if (deleteOrder) {
                // console.log('delete1', removeOrder);
                //work fine
                await this.usersModel.updateOne({phone}, {
                    $set: {points: removeOrder}
                }).exec();
            } else {
                // console.log('is_use', points);
                //work fine
                await this.usersModel.updateOne({phone}, {
                    $inc: {points: points}
                }).exec();
            }
        } else {
            // if (deleteOrder) {
            //     // console.log('delete2', withoutDiscount);
            //     //work fine
            //     await users.updateOne({phone}, {
            //         $set: {points: withoutDiscount}
            //     }).exec();
            // } else {
            //     console.log('updatedPoints', updatedPoints)
            //     await users.updateOne({phone}, {
            //     $set: {points: updatedPoints}
            //     }).exec();
            // }

        }
    }

    async removePoints(id: number, order) {
        const user = await this.usersModel.findOne({id})
        if (!user && !order) return null
        const {total_after_discount, is_use_point, used_discount} = order
        const multiplier = (user.is_vip) ? 1.5 : 1;
        const points = Math.min(Math.floor(total_after_discount / 50), MAX_POINTS) * multiplier;
        const count = user?.points;
        const updatedPoints = count - points
        // console.log('remove and update', updatedPoints);
        await this.usersModel.updateOne({id}, {
            $set: {points: updatedPoints}
        }).exec();
    }

    //end=============================Points============================//

    //================================UsersNotifications============================//
    async formatDate(day) {
        const deliveryDay = moment(day).day()
        const currentDay = moment().day()
        // const presentTime = moment()
        // console.log('presentTime:', presentTime)
        const date = moment(day).format('dddd')
        // console.log('day:', day)
        // console.log('date:', date)
        // console.log('currentDay:', currentDay)
        // console.log('deliveryDay:', deliveryDay)
        if (deliveryDay === currentDay + 1) return 'Today'
        if (deliveryDay === currentDay + 2) return 'Tomorrow'
        return `on ${date}`
    }

    async resolver(phone, title, description) {
        return await this.usersService.setUserNotification(phone, title, description)
    }

    async orderCreateNotification(phone) {
        const title = 'Your order has been made'
        const description = 'You will be notified once we confirm it'
       return  await this.resolver(phone, title, description)
    }

    async orderStatusNotification(phone, order, status) {
        if (status === 'approved') {
            const title = 'Your order is accepted!'
            const description = `Delivery is scheduled for: ${await this.formatDate(order?.delivery_date)}, ${order.timeslot}`
            return await this.resolver(phone, title, description)

        }

        if (status === 'canceled') {
            const title = 'Your order was canceled'
            const description = 'Your delivery wasn’t confirmed. Contact us for more details'
            return await this.resolver(phone, title, description)
        }

        if (status === 'completed') {
            const user = await this.usersModel.findOne({phone}).exec()
            const {total_after_discount} = order
            const multiplier = (user.is_vip) ? 1.5 : 1;
            const points = Math.min(Math.floor(total_after_discount / 50), MAX_POINTS) * multiplier;
            let totalPoints = (points % 2 === 0 ? points : points - 1) * 2.5;
            let title
            let description
            if(totalPoints === 0) {
                title = 'Order is delivered!'
                description = `Thank you for using Terra!`
            } else {
                title = 'Order is delivered!'
                description = `Thank you for using Terra! Here's $${totalPoints} :) use it on whatever you'd like in our store.`
            }
            return await this.resolver(phone, title, description)
        }

        if (status === 'etf') {
            const title = 'Order is delivered!'
            const description = `🔔 Your order is waiting for us to deposit your etransfer. Once that's done your order will be complete!`
            return await this.resolver(phone, title, description)
        }

        if (status === 'etf-completed') {
            const title = 'Order is delivered!'
            const description = `🔔 We received your payment for this order. Thank you!`
            return await this.resolver(phone, title, description)
        }

        if (status === 'in 20 min') {
            const title = 'Your order will arrive in 20 minutes.'
            const description = 'Your order will be delivered soon!'
            return await this.resolver(phone, title, description)
        }

        if (status === 'in 10 min') {
            const title = 'Your order will arrive in 10 minutes.'
            const description = 'Your order will be delivered soon!'
            return await this.resolver(phone, title, description)
        }
        if (status === 'in 5 min') {
            const title = 'Your order will arrive in 5 minutes.'
            const description = 'Your order will be delivered soon!'
            return await this.resolver(phone, title, description)
        }
        if (status === 'here') {
            const title = 'Your order has arrived!'
            const description = 'The driver is at your instructed destination.'
            return await this.resolver(phone, title, description)
        }
    }

    async profileApprovedNotification(phone) {
        const title = 'Address is approved'
        const description = 'Your new address was approved'
        await this.resolver(phone, title, description)
    }

    async afterFiveWeeksNotification(phone) {
        const title = 'It\'s been 5 weeks'
        const description = 'It has been 5 weeks since the last completed order!'
        await this.resolver(phone, title, description)
    }

    async afterSixWeeksNotification(phone) {
        const title = 'You were gone for 6 weeks'
        const description = 'You have received a 10% discount!'
        await this.resolver(phone, title, description)
    }

    async referFriendNotification(newProfile) {
        const title = `Refer code from you Friend`
        const description = `${newProfile.refer_code}`
        const phone = newProfile.friend
        await this.resolver(phone, title, description)
    }

    //end=============================UsersNotifications============================//

    //================================Route============================//
    async getDriver(routes, district: string, day, timeslot) {
        let driver_id = ''
        let route = district.split('.')[0];
        await routes.forEach(r => {
            if (r.cut_offs || r.cut_offs_2) {
                const name = r.name
                r.points.forEach(p => {
                    if (p.district === route && p.weekday === day && p.timeslot === timeslot.replace(/[a-zа-яё]/gi, '')) {
                        driver_id = name
                    }
                })
            }
        })
        return driver_id
    }

    //end================================Route============================//
    //================================Order============================//
    async updateTable_newOrder(rows: any[], order: updateOrderType) {
        const header = rows[1];
        const _drivers = header.map(
            async col => {
                const splitted = col.split("/");
                if (splitted.length !== 2 || !(/^\d+$/.test(splitted[1]))) { //testing if the format for driver is name/tel.num.
                    return Promise.resolve()
                }
                return await this.usersService.getUser({phone: splitted[1]})
            }
        );
        const drivers = (await Promise.all(_drivers)).map(
            (d, i) => d && Object.assign(d, {column: i})
        ).filter(d => d);
        // console.log('drivers:',drivers)
        // console.log('order.driverId:',order.driverId)
        const data = rows?.map(element => {
            if(order.driverId === drivers[0].phone){
                if (element[15]) {
                    let o = order.products.find(prod => prod.name === element[0])
                    if (o) {
                        let {count} = o
                        //console.log('count:', count)
                        let available = Number(element[15].split('/')[0])
                        let reserve = Number(element[15].split('/')[1])
                        let sold = Number(element[15].split('/')[2])
                        element[15] = [available - count, reserve + count, sold].join(' / ')
                        let orders = element[16].trim().split(',') as string[]
                        // console.log('orders:',orders)
                        let result = orders.filter(o => o !== '')
                        // console.log('resultFind:',result)

                        const array = result.find(i => i.split(':')[0] === 'reserved' )
                        // console.log('array:',array)
                        const soldOrder = result.find(i => i.includes('sold'))
                        if(!array){
                            result.unshift(`reserved: ${count} \n${order.orderId} - x${count}\n`)
                            // console.log('resultPush[]:',result)

                        } else {

                            result = result.map(i => {
                                if(i.split(':')[0] === 'reserved') {
                                    i.split(':')[1].trim().split('\n')[0] = (Number(i.split(':')[1].trim().split('\n')[0]) + count).toString()
                                    return`${i.split(':')[0]}: ${(Number(i.split(':')[1].trim().split('\n')[0]) + count).toString()} \n${i.split(':')[1].trim().split('\n')[1]}`
                                }
                                return i
                            })
                            // console.log('resultMapNoEmptyArray:',result)
                            if(soldOrder) {
                                result.splice(1,0, `\n${order.orderId} - x${count}`)
                            } else {
                                result.push(`\n${order.orderId} - x${count}`)
                            }

                            // console.log('resultPushMapNoEmptyArray:',result)

                        }
                        if (result.length > 1) {
                            element[16] = result.join(',\n')
                            // console.log('IF:element[16] = result.join(\',\'):',element[16] = result.join(','))

                        } else {
                            element[16] = result.join(' ')
                            // console.log('ELSE:element[16] = result.join(\' \'):', element[16] = result.join(' '))

                        }
                        // console.log('resultCreateOneDriver:',result)

                        return element
                    } else {
                        return element
                    }
                } else {
                    return element
                }
            } else {
                if (element[18]) {
                    let o = order.products.find(prod => prod.name === element[0])
                    if (o) {
                        let {count} = o
                        let available = Number(element[18].split('/')[0])
                        let reserve = Number(element[18].split('/')[1])
                        let sold = Number(element[18].split('/')[2])
                        element[18] = [available - count, reserve + count, sold].join(' / ')
                        let orders = element[19].trim().split(',') as string[]
                        // console.log('orders:',orders)
                        let result = orders.filter(o => o !== '')
                        // console.log('resultFind:',result)

                        const array = result.find(i => i.split(':')[0] === 'reserved' )
                        // console.log('array:',array)
                        const soldOrder = result.find(i => i.includes('sold'))
                        if(!array){
                            result.unshift(`reserved: ${count} \n${order.orderId} - x${count}\n`)
                            // console.log('resultPush[]:',result)

                        } else {

                            result = result.map(i => {
                                if(i.split(':')[0] === 'reserved') {
                                    i.split(':')[1].trim().split('\n')[0] = (Number(i.split(':')[1].trim().split('\n')[0]) + count).toString()
                                    return`${i.split(':')[0]}: ${(Number(i.split(':')[1].trim().split('\n')[0]) + count).toString()} \n${i.split(':')[1].trim().split('\n')[1]}`
                                }
                                return i
                            })
                            // console.log('resultMapNoEmptyArray:',result)
                            if(soldOrder) {
                                result.splice(1,0, `\n${order.orderId} - x${count}`)
                            } else {
                                result.push(`\n${order.orderId} - x${count}`)
                            }

                            // console.log('resultPushMapNoEmptyArray:',result)

                        }
                        if (result.length > 1) {
                            element[19] = result.join(',\n')
                            // console.log('IF:element[16] = result.join(\',\'):',element[19] = result.join(','))

                        } else {
                            element[19] = result.join(' ')
                            // console.log('ELSE:element[16] = result.join(\' \'):', element[19] = result.join(' '))

                        }
                        // console.log('resultCreateTwoDriver:',result)

                        return element
                    } else {
                        return element
                    }
                } else {
                    return element
                }
            }

        });

        return data
    }
    async updateTable_removeOrder(rows: any[], order: updateOrderType) {
        const header = rows[1];
        const _drivers = header.map(
            async col => {
                const splitted = col.split("/");
                if (splitted.length !== 2 || !(/^\d+$/.test(splitted[1]))) { //testing if the format for driver is name/tel.num.
                    return Promise.resolve()
                }
                return await this.usersService.getUser({phone: splitted[1]})
            }
        );
        const drivers = (await Promise.all(_drivers)).map(
            (d, i) => d && Object.assign(d, {column: i})
        ).filter(d => d);

        const data = rows?.map(element => {
            if(order.driverId === drivers[0].phone) {
                if (element[15]) {

                    let o = order.lastProducts.find(prod => prod.name === element[0])
                    if (o) {
                        let {count} = o
                        let available = Number(element[15].split('/')[0])
                        let reserve = Number(element[15].split('/')[1])
                        let sold = Number(element[15].split('/')[2])
                        element[15] = [available + count, reserve - count, sold].join(' / ')
                        let orders = element[16].trim().split(',') as string[]
                        // console.log('ordersDelete:', orders)
                        let result = orders
                            .filter(o => o !== `${order.orderId} - x${count},`)
                            .filter(o => o !== `${order.orderId} - x${count}`)
                            .map(i => {
                                if(i.split(':')[0] === 'reserved') {
                                    if(i.split(':')[0] === 'reserved' && Number(i.split(':')[1].split('\n')[0].trim()) - count === 0) {
                                        return ''
                                    } else {
                                        return `${i.split(':')[0]}: ${(Number(i.split(':')[1].trim().split('\n')[0].trim()) - count).toString()}`

                                    }
                                }

                                return i
                            })

                        if (result.length) {
                            element[16] = result.join(',')
                        } else {
                            element[16] = result.join('')
                        }

                        return element
                    } else {
                        return element
                    }
                } else {
                    return element
                }
            } else {
                if (element[18]) {

                    let o = order.lastProducts.find(prod => prod.name === element[0])
                    if (o) {
                        let {count} = o
                        let available = Number(element[18].split('/')[0])
                        let reserve = Number(element[18].split('/')[1])
                        let sold = Number(element[18].split('/')[2])

                        element[18] = [available + count, reserve - count, sold].join(' / ')

                        let orders = element[19].trim().split(',') as string[]
                        // console.log('ordersDelete:', orders)
                        let result = orders
                            .filter(o => o !== `${order.orderId} - x${count},`)
                            .filter(o => o !== `${order.orderId} - x${count}`)
                            .map(i => {
                            if(i.split(':')[0] === 'reserved') {
                                if(i.split(':')[0] === 'reserved' && Number(i.split(':')[1].split('\n')[0].trim()) - count === 0) {
                                    return ''
                                } else {
                                    return `${i.split(':')[0]}: ${(Number(i.split(':')[1].trim().split('\n')[0].trim()) - count).toString()}`

                                }
                            }

                            return i
                        })

                        if (result.length) {
                            element[19] = result.join(',')
                        } else {
                            element[19] = result.join('')
                        }

                        return element
                    } else {
                        return element
                    }
                } else {
                    return element
                }
            }



        });

        return data
    }
    async updateTable_CompletedOrder(rows: any[], order: updateOrderType) {
        const header = rows[1];
        const _drivers = header.map(
            async col => {
                const splitted = col.split("/");
                if (splitted.length !== 2 || !(/^\d+$/.test(splitted[1]))) { //testing if the format for driver is name/tel.num.
                    return Promise.resolve()
                }
                return await this.usersService.getUser({phone: splitted[1]})
            }
        );
        const drivers = (await Promise.all(_drivers)).map(
            (d, i) => d && Object.assign(d, {column: i})
        ).filter(d => d);
        const data = rows?.map(element => {
            if(order.driverId === drivers[0].phone) {
                if (element[15]) {

                    let o = order.lastProducts.find(prod => prod.name === element[0])
                    if (o) {
                        let {count} = o
                        let available = Number(element[15].split('/')[0])
                        let reserve = Number(element[15].split('/')[1])
                        let sold = Number(element[15].split('/')[2])

                        element[15] = [available, reserve - count, sold + count].join(' / ')

                        let orders = element[16].trim().split(',') as string[]
                        console.log('soldOrder:', orders)
                        let result = orders
                            .filter(o => o !== `${order.orderId} - x${count}`)
                            .filter(o => o!== `reserved: ${count} \n${order.orderId} - x${count}`)
                            .filter(o => o!== `\n${order.orderId} - x${count}`)
                            .filter(o => o!== `${order.orderId} - x${count},`)
                        const soldOrder = result.find(i => i.includes('sold'))
                        console.log('filteredOrder:', orders)
                        result = result.map(i => {
                            if(i.includes('reserved')){
                                if(i.includes(`\n${order.orderId} - x${count}`)){

                                    return i.split('\n')[0]
                                } else {
                                    return`reserved: ${Number(i.split(':')[1].split('\n')[0].trim()) - count} \n${i.split(':')[1].split('\n')[1]}`
                                }
                            }


                            if(i.includes('sold')){

                                return `\nsold: ${Number(i.split(':')[1].split('\n')[0].trim()) + count} \n${i.split('\n')[1]}`
                            }
                            return i
                        })
                        if(soldOrder) {
                            result.push(`\n${order.orderId} - x${count}`)
                        } else {
                            result.push(`\nsold: ${count} \n${order.orderId} - x${count}`)

                        }

                        console.log('resultOrder:', result)

                        if (result.length) {


                            element[16] = result.join(',')
                            console.log('resultJoin:', result)
                        } else {
                            element[16] = result.join('')
                            console.log('resultJoin2:', result)

                        }

                        return element
                    } else {
                        return element
                    }
                } else {
                    return element
                }
            } else {
                if (element[18]) {

                    let o = order.lastProducts.find(prod => prod.name === element[0])
                    if (o) {
                        let {count} = o
                        let available = Number(element[18].split('/')[0])
                        let reserve = Number(element[18].split('/')[1])
                        let sold = Number(element[18].split('/')[2])

                        element[18] = [available, reserve - count, sold + count].join(' / ')

                        let orders = element[19].trim().split(',') as string[]
                        console.log('soldOrder:', orders)
                        let result = orders
                            .filter(o => o !== `${order.orderId} - x${count}`)
                            .filter(o => o!== `reserved: ${count} \n${order.orderId} - x${count}`)
                            .filter(o => o!== `\n${order.orderId} - x${count}`)
                            .filter(o => o!== `${order.orderId} - x${count},`)
                        const soldOrder = result.find(i => i.includes('sold'))
                        console.log('filteredOrder:', orders)
                        result = result.map(i => {
                            if(i.includes('reserved')){
                                if(i.includes(`\n${order.orderId} - x${count}`)){

                                    return i.split('\n')[0]
                                } else {
                                    return`reserved: ${Number(i.split(':')[1].split('\n')[0].trim()) - count} \n${i.split(':')[1].split('\n')[1]}`
                                }
                            }


                            if(i.includes('sold')){

                                return `\nsold: ${Number(i.split(':')[1].split('\n')[0].trim()) + count} \n${i.split('\n')[1]}`
                            }
                            return i
                        })
                        if(soldOrder) {
                            result.push(`\n${order.orderId} - x${count}`)
                        } else {
                            result.push(`\nsold: ${count} \n${order.orderId} - x${count}`)

                        }

                        console.log('resultOrder:', result)

                        if (result.length) {


                            element[19] = result.join(',')
                            console.log('resultJoin:', result)
                        } else {
                            element[19] = result.join('')
                            console.log('resultJoin2:', result)

                        }

                        return element
                    } else {
                        return element
                    }
                } else {
                    return element
                }
            }



        });
        return data
    }



    async formatOrderForUpdate(products) {
        let temp = [] as { name: string | undefined, count: number, id: string | undefined }[]

        products.forEach(prod => {
            let {id, count, name} = prod
            temp.push({id, name, count})

            if (prod.got_gift_pairs) {
                //@ts-ignore
                let {is_gift, name} = prod.got_gift_pairs
                temp.push({id: is_gift, name, count: 1})
            }
        })
        //console.log('temp:', newTemp)
        return temp.reduce((acc, item) => {
            let oneProduct = acc.find(oneProduct => oneProduct.id === item.id)
            if (oneProduct) {
                oneProduct.count = oneProduct.count + item.count
                oneProduct.name = item.name
            } else {
                acc.push(item)
            }
            return acc
        }, [])
    }

    //end================================Order============================//
    //================================formatOrder============================//
    async formatOrder(products: ProductType[], delivery: DeliveryType, user: any, id: string, phone: string, driver_id: string) {
        const {
            address,
            district,
            change,
            timeslot,
            date,
            total,
            total_after_discount,
            used_discount,
            cut_offs,
            customer_comment
        } = delivery
       const delivery_day = moment().day(date).format('DD-MM-YYYY')
        //const delivery_day = moment().format('DD-MM-YYYY')

        const delivery_date = momentTZ.tz(
            `${delivery_day} ${timeslot}`,
            'DD-MM-YYYY h:mma', "America/Winnipeg"
        ).format();

// console.log(delivery_date);

        const created = momentTZ.tz("America/Winnipeg").format();
        const status = 'draft'
        let {start_date, informed} = used_discount

        if (informed) {
            start_date = momentTZ.tz("America/Winnipeg").format();
        }

        const giftPairs = await this.getGiftPairs(products)
        const orderBonuses = await this.getOrderBonuses(products)
        const product_list = products.map(i => {
            return {
                id: i.id,
                count: i.count
            }

        })

        const products_id = products.map(i => i.id)

// console.log('gift',giftPairs);

        const order = {
            id,
            user,
            phone,
            status,
            created,
            products,
            address,
            district,
            change,
            driver_id,
            delivery_date,
            timeslot,
            customer_comment,
            cut_offs,
            total,
            product_list,
            products_id,
            total_after_discount,
            got_gift_pairs: giftPairs,
            order_bonuses: orderBonuses,
            used_discount: {...used_discount, start_date},
            is_use_point: informed
        }

        const cart = {
            id,
            user,
            status,
            created,
            products,
            address,
            delivery_date,
            timeslot,
            cut_offs,
            total_after_discount,
        }

        return {order, cart}
    }

    async getGiftPairs(products: ProductType[]) {
        const res = [] as { id: string, gift_holder: string, is_gift: string }[]

        products.forEach(prod => {
                if (prod?.got_gift_pairs) {
                    // console.log(prod);

                    res.push({
                        gift_holder: prod.got_gift_pairs.gift_holder,
                        is_gift: prod.got_gift_pairs.is_gift,
                        id: prod.got_gift_pairs.id
                    })
                }
            }
        );

        return res
    }

    async getOrderBonuses(products: ProductType[]) {
        const gifts = [] as { id: string, gift_of: string, name: string, amount: number }[]

        products.forEach(prod => {
            if (prod?.got_gift_pairs) {
                const {is_gift, name, gift_holder} = prod?.got_gift_pairs
                gifts.push({id: is_gift, gift_of: gift_holder, name, amount: 1})
            }
        })

        const costs = products.reduce((a, b) => b.got_gift_pairs ? a + b.got_gift_pairs.cost : a, 0)

        return gifts.length ? {costs, gifts} : {}
    }

    //end=============================formatOrder============================//
    //=============================updateFormatOrder============================//

    async updateOrderFormat(products: ProductType[], user: any, id: string, phone: string, currentOrder: any) {
        const {
            address,
            created,
            delivery_date,
            timeslot,
            change,
            status,
            district,
            cut_offs,
            customer_comment
        } = currentOrder

        const updated = momentTZ.tz("America/Winnipeg").format();
        const giftPairs = await this.updatedGetGiftPairs(products)
        const orderBonuses = await this.updatedGetOrderBonuses(products)
        const {defaultCost, withDiscount} = await this.updatedDiscountCalculation(products)

        const {is_use_point, used_discount} = currentOrder
        let useDictount = 0

        if (is_use_point) {
            let total = used_discount.amount * 2.5

            useDictount = total
        }
        const product_list = products.map(i => {
            return {
                id: i.id,
                count: i.count
            }

        }).reduce((acc, item) => {
            let oneProduct = acc.find(oneProduct => oneProduct.id === item.id)
            if (oneProduct) {
                oneProduct.count = oneProduct.count + item.count
                oneProduct.id = item.id
            } else {
                acc.push(item)
            }
            return acc
        }, [])

        const products_id = products.map(i => i.id).reduce((acc, item) => {
            let oneProduct = acc.find(oneProduct => oneProduct.id === item)
            if (oneProduct) {
                oneProduct.id = item
            } else {
                acc.push(item)
            }
            return acc
        }, [])
        const order = {
            id,
            user,
            phone,
            status,
            created,
            updated,
            products,
            address,
            district,
            change,
            delivery_date,
            timeslot,
            cut_offs,
            product_list,
            products_id,
            customer_comment,
            total: defaultCost,
            total_after_discount: withDiscount - useDictount,
            got_gift_pairs: giftPairs,
            order_bonuses: orderBonuses
        }

        const cart = {
            id,
            user,
            status,
            created,
            updated,
            products,
            address,
            delivery_date,
            timeslot,
            cut_offs,
            total_after_discount: withDiscount - useDictount,
        }

        return {order, cart}
    }

    async updatedGetGiftPairs(products: ProductType[]) {
        const res = [] as { id: string, gift_holder: string, is_gift: string }[]

        products.forEach(prod => {
                if (prod?.got_gift_pairs) {

                    res.push({
                        gift_holder: prod.got_gift_pairs.gift_holder,
                        is_gift: prod.got_gift_pairs.is_gift,
                        id: prod.got_gift_pairs.id
                    })
                }
            }
        );

        return res
    }

    async updatedGetOrderBonuses(products: ProductType[]) {
        const gifts = [] as { id: string, gift_of: string, name: string, amount: number }[]

        products.forEach(prod => {
            if (prod?.got_gift_pairs) {
                const {is_gift, name, gift_holder} = prod?.got_gift_pairs
                gifts.push({id: is_gift, gift_of: gift_holder, name, amount: 1})
            }
        })

        const costs = products.reduce((a, b) => b.got_gift_pairs ? a + b.got_gift_pairs.cost : a, 0)

        return gifts.length ? {costs, gifts} : {}
    }

    async updatedDiscountCalculation(products: ProductType[]) {
        let withDiscount = 0
        let defaultCost = 0

        products.forEach(el => {
            let arr = [] as number[]

            for (let i = 0; i < el.count; i++) {
                arr.push(i)
            }

            defaultCost += arr.reduce((a, b) => a + el.cost, 0)
            withDiscount += arr.reduce((a, b) => a + el.costs[b].cost, 0)
        })

        const discount = (((defaultCost - withDiscount) / defaultCost) * 100).toFixed(0)
        const total = withDiscount < defaultCost

        return {withDiscount, defaultCost, discount, total}
    }

    //end==========================updateFormatOrder============================//

    //================================Timeslot============================//
    async getTimeSlot(routes, district: string) {
        let schedules = [] as RouteResponseType[]
        let route = district.split('.')[0];
        routes.forEach(element => {
            if (element.cut_offs) {

                element.points.forEach(async (point) => {
                    if (point.district === route) {
                        let changeCutoff
                        let {timeslot, weekday} = point
                        if (
                            await this.formattedTime(timeslot.split('-')[1])
                            > await this.formattedTimeCutoff(element.cut_offs_2[weekday])
                        ) {
                            changeCutoff = element.cut_offs_2[weekday]
                        } else {
                            changeCutoff = element.cut_offs[weekday]
                        }
                        let cutOff = await this.formatTime(changeCutoff)
                        let changedTime = await this.formatTime(timeslot)
                        let scedule = {timeslot: changedTime.replace(/[a-zа-яё]/gi, ''), weekday: weekday, cutOff}
                        // @ts-ignore
                        return schedules.push(scedule)
                    }

                })
            }
        })

        let sorted = schedules.sort((a, b) => map[a.weekday] - map[b.weekday])
        let temp = []
        if (sorted.length !== 7) {
            let dayOff = map_index.filter(el => !sorted.find(route => route.weekday === el))
            temp.push(...sorted)

            for (let i = 0; i < dayOff.length; i++) {
                temp.push({timeslot: 'Day Off!', weekday: dayOff[i], cutOff: ''})
            }
        } else {
            temp.push(...sorted)
        }
        return sorted.sort((a, b) => map_day[a.weekday] - map_day[b.weekday])
    }

    async formatTime(time: string) {
        let compare = '12:00'
        return time > compare ? `${time}pm` : `${time}am`

    }

    async formattedTimeCutoff(times) {
        const hour = times.split(":")[0] * 1;
        const min = times.split(":")[1];
        const HourFormatted = hour >= 1 && hour <= 6 ? hour + 12 : hour;
        return HourFormatted * 60 + min * 1
    }

    async formattedTime(times) {
        // console.log('times:',times)
        const hour = times.split(":")[0] * 1;
        const min = times.split(":")[1] * 1;
        const deleteDay = times.split(":")[2]
        if (deleteDay === 'am') {
            if (hour === 12) {
                return min
            }
            return hour * 60 + min
        } else {
            const HourFormatted = hour >= 1 && hour <= 11 ? hour + 12 : hour;
            return HourFormatted * 60 + min
        }
    }

//end================================Timeslot============================//
    //================================getWeek============================//
    async getWeek() {
        const weekNumber = moment().format('D');
        const weekOfCurrentMonth = Math.ceil(Number(weekNumber)/ 7);

        switch(weekOfCurrentMonth) {
            case 1:
                return 'Products Wk1'
            case 2:
                return 'Products Wk2'
            case 3:
                return 'Products Wk3'
            case 4:
                return 'Products Wk4'
            default:
                return 'Products Wk1'
        }
    }
    //end================================getWeek============================//
    //===============================Update sheets A/R/S change Week==============================//
    async updateTableARS(rows: any[]) {



        const data = rows?.map(element => {
            if(element[15]) {
                return element[15] = [element[14], '0', '0'].join(' / ')
            } else {
                return element

            }
            if(element[18]) {
                element[18] = [element[17], '0', '0'].join(' / ')
            } else {

                return element

            }
            return element

        });
        return data
    }


    //end============================Update sheets A/R/S change Week==============================//
}




