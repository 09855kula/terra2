// interface RouteType {
//     name: string,
//     id: string,
//     cut_offs: {
//         Monday: string,
//         Tuesday: string,
//         Wednesday: string,
//         Thursday: string,
//         Friday: string,
//         Saturday: string,
//         Sunday: string
//     },
//     cut_offs_2: {
//         Monday: string,
//         Tuesday: string,
//         Wednesday: string,
//         Thursday: string,
//         Friday: string,
//         Saturday: string,
//         Sunday: string
//     },
//     points: [{
//         _id: string,
//         index: number,
//         weekday: string,
//         district: string,
//         timeslot: string
//     }]
// }

interface PointsType {
    index: number
    district: string
    timeslot: string
    weekday: string
}