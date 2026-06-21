import * as mongoose from 'mongoose';

export const RoutesWebSchema = new mongoose.Schema({
    name: String,
    id: String,
    cut_offs: {
        Monday: String,
        Tuesday: String,
        Wednesday: String,
        Thursday: String,
        Friday: String,
        Saturday: String,
        Sunday: String
    },
    cut_offs_2: {
        Monday: String,
        Tuesday: String,
        Wednesday: String,
        Thursday: String,
        Friday: String,
        Saturday: String,
        Sunday: String
    },
    points: [{
        _id: String,
        index: Number,
        weekday: String,
        district: String,
        timeslot: String
    }]


});




