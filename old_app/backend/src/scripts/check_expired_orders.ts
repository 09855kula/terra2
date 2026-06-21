//@ts-nocheck
// import { Orders } from '../db/models/order.models';
// import { Token } from '../db/models/token.models';
// import { Users } from '../db/models/user.models';
// import {getModelForClass} from "@typegoose/typegoose";
import moment from 'moment'
import { sendMessage } from './twilioSms';
// const Slimbot = require('../botforge/lib/slimbot/src/slimbot');
// const TOKEN = process.env.BOT_TOKEN;
// const api = new Slimbot(TOKEN);
import { userResolvers } from '../db/resolvers';

const OrderModel = getModelForClass(Orders);
const UserModel = getModelForClass(Users);
const TokenModel = getModelForClass(Token);

// let x = check_expired_orders_and_discounts();

export async function check_expired_orders_and_discounts() {

    const time = moment().format();
    const allOrders = await OrderModel.find({"status": {$nin: ["draft", "canceled"]}})
    
    const allUsers = await UserModel.find({role: "trusted"})


    console.log("Started everyday check for inactive users");
    // await UserModel.setDiscountForNextOrder({phone: "380632631628", discount: 10, date: time})
    allUsers
        .map(async user => {
            const user_orders = allOrders.filter(order => order.user && order.user.id == user.id);
            if (user_orders.length > 0) {
                const last_order = user_orders.sort((a, b) => (a.updated - b.updated)).pop();

                if (!last_order.updated && (last_order.status === 'completed' || last_order.status === 'etf-completed')) {
                    console.log("something is wrong, order is not updated but completed");
                    console.log(user.phone);
                    console.log("-----------")
                    return
                }

                if ((last_order.status === 'completed' || last_order.status === 'etf-completed')) {
                    const latestUserTokenDate = await TokenModel.find({referral_tg_users_ids: user.id}).sort({"updated": -1}).limit(1)
                    
                    if ((moment(last_order.updated).diff(time, 'weeks') <= -5) && (latestUserTokenDate[0] && (moment(latestUserTokenDate[0].updated).diff(time, 'weeks') <= -5)) && (!user.notification?.five_week_expired)) {   // TODO: change back to == weeks

                        // send 5 weeks notification to user

                        const {id} = last_order.user;
                        if (id) {
                            const notification = new Notification(id, five_week_notification);
                        }

                        userResolvers.Mutation.userComments('',{id: user.id, comment: five_week_notification, role: 'notification'},{})
                        userResolvers.Mutation.setUserNotification('',{phone: user.phone, title: five_week_notificationTitle, description: five_week_notificationDesc},{})
                        await UserModel.addNotification({phone: user.phone, five_week: time, seven_week: null})
                        // await UserModel.userComments({id: user.id, comment: five_week_notification, role: 'notification'})
                        // await UserModel.setUserNotification({phone: user.phone, title: five_week_notificationTitle, description: five_week_notificationDesc})

                        console.log("------------------- 5 WEEKS NOTIFICATION--------");
                        console.log(user.phone + 'got 5 week notif');
                        console.log("Last order status: " + last_order.status);
                        console.log("Last order update date: " + last_order.updated);
                        console.log("Last order id: " + last_order.id);
                        console.log("------------------------------------------------");
                    } else if ((moment(last_order.updated).diff(time, 'weeks') <= -6) && (latestUserTokenDate[0] && (moment(latestUserTokenDate[0].updated).diff(time, 'weeks') <= -6))) {  // TODO: change back to weeks

                        // send 6 weeks notification and set 10% discount for the next order
                        // debugger;
                        if (!user.notification?.seven_week_expired) {

                            const {id} = last_order.user;
                            const notification = new Notification(id, seven_week_Notification)

                            userResolvers.Mutation.userComments('',{id: user.id, comment: five_week_notification, role: 'notification'},{})
                            userResolvers.Mutation.setUserNotification('',{phone: user.phone, title: seven_week_NotificationTitle, description: seven_week_NotificationDesc},{})
                            
                            await UserModel.addNotification({phone: user.phone, five_week: time, seven_week: time})
                            await UserModel.setDiscountForNextOrder({phone: user.phone, discount: 10, date: time})
                            
                            console.log("------------------- 6 WEEKS NOTIFICATION--------");
                            console.log(user.phone + ' got 6 week notif and discount');
                            console.log("Last order status: " + last_order.status);
                            console.log("Last order update date: " + last_order.updated);
                            console.log("Last order id: " + last_order.id);
                            console.log("------------------------------------------------");
                        }
                    }
                }
            }
        
            if (user.next_order_discount?.amount) {

                if (moment(user.next_order_discount?.start_date).diff(time, 'days') <= -7) {  // TODO: change back to weeks

                    // cancel 10% if it's expired
                    const phone = user.phone
                    const notification = new Notification(user.id, expired_discount)
                    // await UserModel.setDiscountForNextOrder({phone : user.phone, discount : null, date : null, toKick:true})
                    
                    //send sms message
                    // sendMessage(phone, expired_discount)

                    // await UserModel.kickUser({phone: phone})
                    console.log("------------------- USER IS KICKED--------");
                    console.log(user.phone + ' got kicked since discount wasnt used');
                    console.log("Last discount start date: " + user.next_order_discount?.start_date);
                    console.log("------------------------------------------------");
                    const messageForAdmin = `
                        User <a href="tg://user?id=${user.id}">${user.first_name} ${user.last_name || ''}${user.username ? ' @' + user.username : ''}</a> is kicked due to long time of inactivity.
                    `;
                    const admins = await UserModel.find({role: 'admin'});

                    // for (const admin of admins) {
                    //     if (admin.id) api.sendMessage(admin.id, messageForAdmin, {parse_mode: 'html'})
                    // }
                }
            } else {
                return
            }
            // console.log(user)
        })
    //console.log("Inactive users check added");
}

const five_week_notification = "We miss you... It's been over 2 months since we last saw you 😭 hope all is well and if there's anything we can do message us @terracesupport. Hope to see you again soon"
const five_week_notificationTitle = "We miss you!"
const five_week_notificationDesc = "It's been a few months since your last order. Hope all is well! Is there anything we can do to earn more of your business?"

const seven_week_Notification = "We're a mess without you... It's been a while! Here take this. 10% off your next order within the next 7 days 😊 \n" +
    "\n\n*to keep our service tidy, inactive members will be removed from our service after discount will be expired. But it's ok! You can still be referred by someone who is still an active member*"

const seven_week_NotificationTitle = "We're a mess without you.."

const seven_week_NotificationDesc = `It's been a while! Take 10% off your next order. It's automatically added at checkout. The offer only lasts 7 days though!"
<br/> <br/>*to keep our service safe and tidy, inactive member accounts will be frozen after the discount expires. 
<br/> <br/>But it's ok! You can still be referred by someone who is still an active member and your account will the thawed out 😉`

const expired_discount = 'Unfortunately, your discount for the next order is expired and you was removed from our bot. You can still be referred by someone who is still an active member'

class Notification {

    constructor(id, text) {

        this.send_notification(id, text)
    }

    send_notification(id, text) {

        // async function send() {

        //     await api.sendMessage(id, text)
        // }

        // setTimeout(send, 1000)
    }
}
