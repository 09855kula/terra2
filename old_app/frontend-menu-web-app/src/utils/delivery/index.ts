import "moment-timezone"

import {RouteResponseType} from '../../types';
import moment, {now} from 'moment';
import {assertUnionType} from "graphql";

const map_day = {
    "Monday": '1',
    "Tuesday": '2',
    "Wednesday": '3',
    "Thursday": '4',
    "Friday": '5',
    "Saturday": '6',
    "Sunday": '7',
} as { [key: string]: string }
const map = {
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6,
    'Sunday': 7
} as { [key: number]: number }
const mapIndex = (index: number) => {
    switch (index) {
        case 7:
            return 0
        case 8:
            return 1
        default:
            return index
    }
}
const mapEnd = {
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6,
    'Sunday': 7
} as { [key: string]: number }

const delivery = {
    getDileveryWindows: (routes: RouteResponseType[]): RouteResponseType[] => {
        const currentDay = moment().format('dddd')
        const tomorrow = moment().add(1, 'day').format('dddd');
        const dayAfterTomorrow = moment().add(2, 'day').format('dddd');

        const index = routes.findIndex(el => el.weekday === currentDay)
        let temp = [] as RouteResponseType[]
        if (routes.length > 0) {
            const scheduleChanges = moment().startOf('week').add(1, 'week').fromNow()
            //console.log('scheduleChanges:', scheduleChanges)
            // const todayDateObj = moment().day('Sunday').hour(11).minutes(31).format('dddd, MMMM Do, h:mm:ss a');
            // console.log('todayDateObj:', todayDateObj)
            // const changes = moment().startOf('isoWeek').add(1, 'week').format('dddd, MMMM Do, h:mm:ss a')
            // console.log('changes:', changes)
            // const weekday = 'Thursday'
            const minutes = 30
            const hours = 11
            const scheduleChangesTime = moment().startOf('week').add(1, 'week')
            //console.log('scheduleChangesTime:', scheduleChangesTime)
            const presentTime = moment().format('dddd, MMMM Do, h:mm:ss a')
            const sunday = moment().startOf('week').add(1, 'week').format(`dddd, MMMM Do, ${hours}:${minutes}:ss a`)
            const isAfter = moment().isAfter(sunday)
            console.log('presentTime:',presentTime)
            //console.log('sunday:', sunday)
            //console.log('isAfter:', isAfter)

            // if (index > 4) {
            //     for (let i = 6; i <= 8; i++) {
            //         let idx = mapIndex(i)
            //
            //         let {cutOff, timeslot, weekday} = routes[idx]
            //         temp.push({cutOff, timeslot, weekday})
            //         // if (weekday === 'Monday' || weekday === 'Tuesday') {
            //         //     // temp.push({cutOff: '', timeslot: `Menu changes ${scheduleShanges}`, weekday})
            //         //     temp.push({cutOff, timeslot, weekday})
            //         //
            //         // } else {
            //         //
            //         // }
            //     }
            // }
            for (let i = index; i < routes.length; i++) {
                let {cutOff, timeslot, weekday} = routes[i]
                if (weekday === tomorrow) {
                    if (isAfter && tomorrow === 'Monday') {
                        temp.push({cutOff: '', timeslot: `Menu changes ${scheduleChanges}`, weekday})
                    } else {
                        temp.push({cutOff, timeslot, weekday})

                    }
                }
                if (weekday === currentDay) {
                    temp.push({cutOff, timeslot, weekday})
                }
                if (weekday === dayAfterTomorrow) {
                    if (isAfter && dayAfterTomorrow === 'Monday') {
                        temp.push({cutOff: '', timeslot: `Menu changes ${scheduleChanges}`, weekday})
                    } else if (isAfter && dayAfterTomorrow === 'Tuesday') {
                        temp.push({cutOff: '', timeslot: `Menu changes ${scheduleChanges}`, weekday})
                    } else {
                        temp.push({cutOff, timeslot, weekday})

                    }
                }


            }

        } else {
            return [
                {weekday: 'Monday', timeslot: 'Day Off!', cutOff: ''},
                {weekday: 'Tuesday', timeslot: 'Day Off!', cutOff: ''},
                {weekday: 'Wednesday', timeslot: 'Day Off!', cutOff: ''},
                {weekday: 'Thursday', timeslot: 'Day Off!', cutOff: ''},
                {weekday: 'Friday', timeslot: 'Day Off!', cutOff: ''},
                {weekday: 'Saturday', timeslot: 'Day Off!', cutOff: ''},
                {weekday: 'Sunday', timeslot: 'Day Off!', cutOff: ''},
            ]
        }


        console.log('temp:', temp)
        return temp.map(i => {
            return {cutOff: i.cutOff, timeslot: i.timeslot.replace(/[a-zа-яё]/gi, ''), weekday: i.weekday}
        })

    },

    getChooseDeliveryWindow: (routes: RouteResponseType[]): RouteResponseType[] => {
        const currentDay = moment().format('dddd')
        const tomorrow = moment().add(1, 'day').format('dddd');
        const dayAfterTomorrow = moment().add(2, 'day').format('dddd');
        let temp = [] as RouteResponseType[]
        if (routes.length > 0) {
            let lastCutOff
            const newTime = moment().format('YYYY-MM-DD HH:mma')
            const sundayArray = routes.filter(i => i.weekday === 'Sunday')
            if(sundayArray && sundayArray.length === 1){
                lastCutOff = sundayArray[0].cutOff
            }
            if(sundayArray && sundayArray.length === 2){
                if(sundayArray[0].cutOff === sundayArray[1].cutOff) {
                    lastCutOff = sundayArray[0].cutOff
                }
                if(moment(`${newTime.split(' ')[0]} ${sundayArray[0].cutOff}`).isAfter(`${newTime.split(' ')[0]} ${sundayArray[1].cutOff}`)) {
                    lastCutOff = sundayArray[0].cutOff
                } else {
                    lastCutOff = sundayArray[1].cutOff
                }
            }
            let presentTime
            if(lastCutOff && lastCutOff.includes('am')) {
                let hours = Number(lastCutOff.split(':')[0])
                let minutes = Number(lastCutOff.split(':')[1].replace(/[a-zа-яё]/gi, ''))
                presentTime = moment().hour(hours).minutes(minutes)
                if(currentDay === "Saturday") {
                    presentTime = moment().hour(hours).minutes(minutes).add(1, 'day')
                }
                if(currentDay === "Sunday") {
                    presentTime = moment().hour(hours).minutes(minutes)
                }
            }
            if(lastCutOff && lastCutOff.includes('pm')) {
                let hours = Number(lastCutOff.split(':')[0])
                if(hours !== 12) {
                    hours += 12
                }
                let minutes = Number(lastCutOff.split(':')[1].replace(/[a-zа-яё]/gi, ''))
                presentTime = moment().hour(hours).minutes(minutes)
                if(currentDay === "Saturday") {
                    presentTime = moment().hour(hours).minutes(minutes).add(1, 'day')
                }
                if(currentDay === "Sunday") {
                    presentTime = moment().hour(hours).minutes(minutes)
                }
            }

            const isBeforeCutoffSunday = moment().isBefore(presentTime)
            const scheduleChanges = moment(presentTime).fromNow()
            // console.log('lastCutOff:',lastCutOff)
            // console.log('scheduleChanges:',scheduleChanges)
            // console.log('presentTime:', presentTime)
            // console.log('sundayArray:', sundayArray)
            // console.log('isBeforeCutoffSunday:', isBeforeCutoffSunday)
            for (let i = 0; i < routes.length; i++) {
                let {cutOff, timeslot, weekday} = routes[i]
                if (weekday === currentDay) {
                    temp.push({cutOff, timeslot: `${timeslot}pm`, weekday})
                }
                if (weekday === tomorrow) {
                    if (tomorrow === 'Monday') {
                        if(isBeforeCutoffSunday){
                            temp.push({cutOff: '', timeslot: `Menu changes ${scheduleChanges.replace(/ago/g, '')}`, weekday})
                        } else {
                            temp.push({cutOff, timeslot: `${timeslot}pm`, weekday})
                        }
                    } else {
                        temp.push({cutOff, timeslot: `${timeslot}pm`, weekday})
                    }
                }
                //ПОСЛЕЗАВТРА ВЫКЛЮЧЕНО

                // if (weekday === dayAfterTomorrow) {
                //     if (dayAfterTomorrow === 'Monday') {
                //         if(isBeforeCutoffSunday){
                //             temp.push({cutOff: '', timeslot: `Menu changes ${scheduleChanges.replace(/ago/g, '')}`, weekday})
                //         } else {
                //             temp.push({cutOff, timeslot: `${timeslot}pm`, weekday})
                //         }
                //     } else if (dayAfterTomorrow === 'Tuesday') {
                //         if(isBeforeCutoffSunday){
                //             temp.push({cutOff: '', timeslot: `Menu changes ${scheduleChanges.replace(/ago/g, '')}`, weekday})
                //         } else {
                //             temp.push({cutOff, timeslot: `${timeslot}pm`, weekday})
                //         }
                //     } else {
                //         temp.push({cutOff, timeslot: `${timeslot}pm`, weekday})
                //     }
                // }
            }
        } else {
            const newRoutes = [
                {weekday: 'Monday', timeslot: 'Day Off!', cutOff: ''},
                {weekday: 'Tuesday', timeslot: 'Day Off!', cutOff: ''},
                {weekday: 'Wednesday', timeslot: 'Day Off!', cutOff: ''},
                {weekday: 'Thursday', timeslot: 'Day Off!', cutOff: ''},
                {weekday: 'Friday', timeslot: 'Day Off!', cutOff: ''},
                {weekday: 'Saturday', timeslot: 'Day Off!', cutOff: ''},
                {weekday: 'Sunday', timeslot: 'Day Off!', cutOff: ''},
            ]
            for (let i = 0; i < newRoutes.length; i++) {
                let {cutOff, timeslot, weekday} = newRoutes[i]
                if (weekday === tomorrow) {
                        temp.push({cutOff, timeslot, weekday})
                }
                if (weekday === currentDay) {
                    temp.push({cutOff, timeslot, weekday})
                }
                //ПОСЛЕЗАВТРА ВЫКЛЮЧЕНО
                // if (weekday === dayAfterTomorrow) {
                //     temp.push({cutOff, timeslot, weekday})
                // }
            }
        }

            return temp.sort((a, b) => mapEnd[a.weekday] - mapEnd[b.weekday])
    },
    formatTimeForDelivery: (day: string, time: string) => {
        const currentDay = moment().format('dddd')
        const isDayOff = currentDay === 'Sunday' || currentDay === 'Saturday' ? -1 : 0;
        const delivery_day = moment().day(map_day[day]).format('DD-MM-YYYY')
        // const delivery_date = moment(`${delivery_day} ${time}`,'DD-MM-YYYY h:mma').format();
        const delivery_date = moment.tz(`${delivery_day} ${time}`, 'DD-MM-YYYY h:mma', "America/Winnipeg").format();
        const current = moment().format('DD-MM-YYYY h:mma')
        moment.tz.setDefault('America/Winnipeg')
        const current_date = moment.tz(`${current}`, 'DD-MM-YYYY h:mma', "America/Winnipeg").format();
        return {delivery_date, current_date, currentDay}
    },
    checkCutoff: (deliveryDate: string, cutoff: string): boolean => {
        const currentDay = moment().format('DD-MM-YYYY h:mma')
        const delivery_day = moment(deliveryDate).format('DD-MM-YYYY')
        // console.log('delivery_day:', delivery_day)
        const cutoff_day = moment.tz(`${delivery_day} ${cutoff}`, 'DD-MM-YYYY h:mma', "America/Winnipeg").format();
        const formattedDay = moment.tz(`${currentDay}`, 'DD-MM-YYYY h:mma', "America/Winnipeg").format();
        moment.tz.setDefault('America/Winnipeg')
        // console.log('cutoff_day:', cutoff_day)
        const isExpired = formattedDay > cutoff_day
        // console.log('formattedDay:', formattedDay)
        // console.log('isExpired:', isExpired)
        // console.log('deliveryDate:', deliveryDate)
        // console.log('cutoff:', cutoff)
        return isExpired
    },
    isSaturdayOrSunady: (): boolean => {
        const include = ['Saturday', 'Sunday']
        const currentDay = moment().format('dddd')

        return include.includes(currentDay)
    },
//     formattedTimeCutoff:(times):string => {
//     const hour = times.split(":")[0] * 1;
//     const min = times.split(":")[1];
//     const HourFormatted = hour >= 1 && hour <= 6 ? hour + 12 : hour;
//     return HourFormatted * 60 + min * 1
// }
    formatTimeForDelivery2: (routes: RouteResponseType[]) => {
        let data = [] as deliveryTimeType[];
        const currentDay = moment().format('dddd')
        const tomorrow = moment().add(1, 'day').format('dddd');
        const dayAfterTomorrow = moment().add(2, 'day').format('dddd');

        const isDayOff = currentDay === 'Sunday' || currentDay === 'Saturday' ? -1 : 0;
        const current = moment().format('DD-MM-YYYY h:mma')
        const current_date = moment.tz(`${current}`, 'DD-MM-YYYY h:mma', "America/Winnipeg").format();

        routes.forEach((route, idx) => {
            const delivery_day = moment().day(map_day[route.weekday]).add(isDayOff, 'week').format('DD-MM-YYYY')
            const delivery_date = moment.tz(`${delivery_day} ${route.timeslot}`, 'DD-MM-YYYY h:mma', "America/Winnipeg").format();

            if (route.weekday === currentDay && delivery_date < current_date) {
                data.push({...route, isCutoff: true, day: ''})
            } else {
                data.push({...route, isCutoff: false, day: ''})
            }

            if (route.timeslot === 'Day Off!') {
                data[idx] = {...data[idx], dayOff: true}
            } else {
                data[idx] = {...data[idx], dayOff: false}
            }

            if (route.timeslot.slice(0, 4) === 'Menu') {
                data[idx] = {...data[idx], changedPeriod: true}
            } else {
                data[idx] = {...data[idx], changedPeriod: false}
            }
            if (route.weekday === tomorrow) {
                data[idx] = {...data[idx], day: 'Tomorrow'}
            }
            if (route.weekday === currentDay) {
                data[idx] = {...data[idx], day: 'Today'}
            }
            if (route.weekday === dayAfterTomorrow) {
                data[idx] = {...data[idx], day: route.weekday}
            }

        });

        return data
    },
    formatRoutesDeliveryWindows: (routes: RouteResponseType[]) => {
        let schedule = [] as deliveryWindowsTwoTimeslotType[];

        console.log('routes:', routes)
        let monday = routes.filter((route, idx) => {
            if (route.weekday === 'Monday') {
                return route
            }
        })
        if (monday.length === 0) {
            monday = [{weekday: 'Monday', timeslot: 'Day Off!', cutOff: ''}]
        }

        if (!monday) return null
        let tuesday = routes.filter((route, idx) => {
            if (route.weekday === 'Tuesday') {
                return route
            }
        })
        if (tuesday.length === 0) {
            tuesday = [{weekday: 'Tuesday', timeslot: 'Day Off!', cutOff: ''}]
        }
        if (!tuesday) return null
        let wednesday = routes.filter((route, idx) => {
            if (route.weekday === 'Wednesday') {
                return route
            }
        })
        if (wednesday.length === 0) {
            wednesday = [{weekday: 'Wednesday', timeslot: 'Day Off!', cutOff: ''}]
        }
        if (!wednesday) return null
        let thursday = routes.filter((route, idx) => {
            if (route.weekday === 'Thursday') {
                return route
            }
        })
        if (thursday.length === 0) {
            thursday = [{weekday: 'Thursday', timeslot: 'Day Off!', cutOff: ''}]
        }
        if (!thursday) return null
        let friday = routes.filter((route, idx) => {
            if (route.weekday === 'Friday') {
                return route
            }
        })
        if (friday.length === 0) {
            friday = [{weekday: 'Friday', timeslot: 'Day Off!', cutOff: ''}]
        }
        if (!friday) return null
        let saturday = routes.filter((route, idx) => {
            if (route.weekday === 'Saturday') {
                return route
            }
        })
        if (saturday.length === 0) {
            saturday = [{weekday: 'Saturday', timeslot: 'Day Off!', cutOff: ''}]
        }
        if (!saturday) return null

        let sunday = routes.filter((route, idx) => {
            if (route.weekday === 'Sunday') {
                return route
            }
        })
        if (sunday.length === 0) {
            sunday = [{weekday: 'Sunday', timeslot: 'Day Off!', cutOff: ''}]
        }
        if (!sunday) return null
        return {monday, tuesday, wednesday, thursday, friday, saturday, sunday}
    },
}

export default delivery;

interface deliveryTimeType {
    timeslot: string
    weekday: string
    cutOff: string
    isCutoff?: boolean
    dayOff?: boolean
    changedPeriod?: boolean
    day: string
}

interface deliveryWindowsTwoTimeslotType {

    weekday: string
    one: {
        cutOff: string
        timeslot: string
    },
    two: {
        cutOff: string
        timeslot: string
    },


}

interface deliveryWindowsOneTimeslotType {
    timeslot: string
    weekday: string
    cutOff: string

}
