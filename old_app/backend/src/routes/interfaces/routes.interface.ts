import {Document} from 'mongoose';

export interface RoutesWeb extends Document {
    readonly name: string,
    readonly id: string,
    readonly cut_offs: {
        Monday: string,
        Tuesday: string,
        Wednesday: string,
        Thursday: string,
        Friday: string,
        Saturday: string,
        Sunday: string
    },
    readonly cut_offs_2: {
        Monday: string,
        Tuesday: string,
        Wednesday: string,
        Thursday: string,
        Friday: string,
        Saturday: string,
        Sunday: string
    },
    readonly points: {
        _id: string,
        index: number,
        weekday: string,
        district: string,
        timeslot: string
    }[]
}