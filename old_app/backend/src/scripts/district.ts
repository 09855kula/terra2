const D0 = '0. Out of range';
const D0b = '0b. Out of range';
const D1 = '1. Transcona';
const D2 = '2. East Kildonan, North Kildonan, Elmwood';
const D3a = '3a. Osborne Village, Downtown, Wolseley, Point Douglas';
const D3b = '3b. Polo Area, Portage to Perimeter, Sturgeon Creek';
const D4 = '4. River Heights, Grant Park, Tuxedo, Charleswood';
const D5 = '5. Pembina, Fort Rouge, Lindenwoods';
const D6 = '6. St Vital, Norwood, Niakwa';
const D7 = '7. Windsor Park, Southdale, St. Boniface';
const D8 = '8. Luxton, Riverbend, Garden City';
const D9 = '9. Tyndall, Maples';

const district_map = {
    ['Monday']: {
        workhours: '4pm-8pm',
        districts: [
            D0, D0b, D2, D1, D7, D6, D5, D4, D3b, D3a
        ],
        timeslots: [
            '4:00-4:10',
            '4:00-5:30',
            '5:00-6:30',
            '5:30-7:00',
            '5:45-7:15',
            '6:00-7:30',
            '6:15-7:45',
            '6:45-8:30',
            '7:00-8:45'
        ]
    },

    ['Tuesday']: {
        workhours: '5pm-9pm',
        districts: [
            D0, D1, D7, D6, D5, D4, D3b, D3a, D2
        ],
        timeslots: [
            '5:00-5:10',
            '5:00-6:30',
            '5:30-7:00',
            '6:00-7:30',
            '6:15-7:45',
            '6:45-8:15',
            '7:00-8:30',
            '7:30-9:00',
            '8:00-9:30'
        ]
    },

    ['Wednesday']: {
        workhours: '5pm-9pm',
        districts: [
            D0, D2, D3a, D3b, D4, D5, D6, D7, D1
        ],
        timeslots: [
            '5:00-5:10',
            '5:00-6:30',
            '5:45-7:15',
            '6:15-7:45',
            '6:45-8:15',
            '7:15-8:45',
            '7:30-9:00',
            '7:45-9:15',
            '8:00-9:30'
        ]
    },

    ['Thursday']: {
        workhours: '5pm-9pm',
        districts: [
            D0, D1, D7, D6, D5, D4, D3b, D3a, D2
        ],
        timeslots: [
            '5:00-5:10',
            '5:00-6:30',
            '5:30-7:00',
            '6:00-7:30',
            '6:15-7:45',
            '6:45-8:15',
            '7:00-8:30',
            '7:30-9:00',
            '8:00-9:30'
        ]
    },

    ['Friday']: {
        workhours: '4pm-8pm',
        districts: [
            D0, D2, D3a, D3b, D4, D5, D6, D7, D1
        ],
        timeslots: [
            '4:00-4:10',
            '4:00-5:45',
            '5:00-6:45',
            '5:30-7:15',
            '6:00-7:45',
            '6:15-8:00',
            '6:45-8:30',
            '7:15-9:00',
            '7:45-9:30'
        ]
    },

    ['Saturday']: {
        workhours: '2pm-6pm',
        districts: [
            D0, D2, D3a, D3b, D4, D5, D6, D7, D1
        ],
        timeslots: [
            '2:00-2:10',
            '2:00-3:30',
            '2:30-4:00',
            '3:00-3:30',
            '3:15-4:45',
            '3:30-5:00',
            '3:45-5:15',
            '4:00-5:30',
            '4:30-6:00'
        ]
    },

    ['Sunday']: {
        workhours: '2pm-6pm',
        districts: [
            D0, D1, D7, D6, D5, D4, D3b, D3a, D2
        ],
        timeslots: [
            '2:00-2:10',
            '2:00-3:30',
            '2:30-4:00',
            '2:45-4:15',
            '3:00-4:30',
            '3:30-5:00',
            '3:45-5:15',
            '4:15-5:45',
            '4:30-6:00'
        ]
    },

    ['List']: {
        districts: [
            D0, D0b, D1, D2, D3a, D3b, D4, D5, D6, D7, D8, D9
        ]
    },

    timeslot_for_district: (district, weekday) => {
        const { timeslots, districts } = district_map[weekday];

        const index = districts.findIndex(
            d => d.indexOf(district) >= 0
        );

        if (index < 0) return 'can\'t get the timeslots';

        return timeslots[index];
    },

    index_for_weekday: (district, weekday) => {
        const { timeslots, districts } = district_map[weekday];

        const index = districts.findIndex(
            d => d.indexOf(district) >= 0
        );

        return index;
    }

};

try {
  if (global) {
      // work just for sheets scripts
      global.districts = district_map;
  }
} catch (err) {}




// db.userswebs.insert({
//
//     "orders": [
//         8241
//     ],
//     "tokens": [],
//     "phones": [
//         "12045574931"
//     ],
//     "profiles": [
//         5555
//     ],
//     "addresses": ["761 Stewart St"],
//     "phone": "12045574931",
//     "role": "admin",
//     "created": {
//         "$date": {
//             "$numberLong": "1552926595000"
//         }
//     },
//     "__v": 0,
//     "id": 780458896,
//     "first_name": "Travis",
//     "last_name": null,
//     "username": null,
//     "updated": {
//         "$date": {
//             "$numberLong": "1552927747000"
//         }
//     },
//     "cart": {
//         "products": [],
//         "_id": {
//             "$oid": "5c8fe1ee654cc1000925e930"
//         },
//         "comments": [],
//         "id": "8241",
//         "user": {
//             "orders": [],
//             "tokens": [],
//             "phones": [
//                 "12045574931"
//             ],
//             "addresses": [],
//             "_id": {
//                 "$oid": "5c8fc783d2acb9001d1c58f1"
//             },
//             "phone": "12045574931",
//             "role": "trusted",
//             "created": {
//                 "$date": {
//                     "$numberLong": "1552926595000"
//                 }
//             },
//             "__v": 0,
//             "id": 780458896,
//             "first_name": "Travis",
//             "last_name": null,
//             "username": null,
//             "updated": {
//                 "$date": {
//                     "$numberLong": "1552927747000"
//                 }
//             }
//         },
//         "status": "draft",
//         "created": {
//             "$date": {
//                 "$numberLong": "1552933358000"
//             }
//         },
//         "__v": 0
//     },
//     "inventory": "6329993d38251d0ef0b9defb",
//     "route": "12045574931",
//     "new_profile": false,
//     "last_profile": 5555,
//     "average_rate": 4.9531810035842465,
//     "rates_count": 13392,
//     "user": {
//         "role": "admin"
//     },
//     "points": 10
// })
//
// db.profileswebs.insert({
//
//     "id": "5555",
//     "user_id": 780458896,
//     "address": "761 Stewart St",
//     "district": "3b. Polo Area, Portage to Perimeter, Sturgeon Creek",
//     "status": "approved",
//     "phone": "12045574931",
//     "created": {
//         "$date": {
//             "$numberLong": "1556364459000"
//         }
//     },
//     "__v": 0,
//     "special_instructions": "Cash in Mailbox",
//     "approved": {
//         "$date": {
//             "$numberLong": "1565380577000"
//         }
//     },
//     "updated": {
//         "$date": {
//             "$numberLong": "1565380577000"
//         }
//     },
//     "token_id": 5555
// })