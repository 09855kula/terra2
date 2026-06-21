import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {GetScheduleArgs} from "./dto/args/get-schedule.args";
import {createSchedulesInput} from "./dto/input/create-schedule.input";
import {updateScheduleInput} from "./dto/input/update-schedule.input";
import {deleteScheduleInput} from "./dto/input/delete-schedule.input";
import {SchedulesWeb, SchedulesDocument} from "./schemas/schedules.schemas";
import {GoogleSheetsService} from "../sheets/google-sheets.service";

@Injectable()
export class SchedulesService {
    constructor(@InjectModel(SchedulesWeb.name) private schedulesModel: Model<SchedulesDocument>,
                private googleSheetsService: GoogleSheetsService) {
    }
    async createSchedule(createScheduleData: createSchedulesInput): Promise<SchedulesDocument> {
        const createdSchedules = new this.schedulesModel(createScheduleData);
        return await createdSchedules.save();

    }

    async updateSchedule(id, updateScheduleData: updateScheduleInput): Promise<SchedulesDocument> {
        return this.schedulesModel.findOneAndUpdate(id, updateScheduleData, {new: true})
    }

    async getSchedule(getScheduleArgs: GetScheduleArgs): Promise<SchedulesDocument> {
        return await this.schedulesModel.findOne(getScheduleArgs).exec();

    }

    async getSchedules(): Promise<SchedulesDocument[]> {
        return await this.schedulesModel.find().exec();
    }

    async deleteSchedule(deleteScheduleData: deleteScheduleInput): Promise<SchedulesDocument> {
        return this.schedulesModel.findOneAndRemove(deleteScheduleData)

    }
    async create({id,product_sheet='Products Wk1'}): Promise<SchedulesDocument> {
        const schedule = await new this.schedulesModel({
            id,
            product_sheet
        });
        await schedule.save();
        return schedule;
    }
    async getCreate(
        id: String
    ): Promise<SchedulesDocument> {
        let schedule = await this.schedulesModel.findOne({ id }).exec();
        if (!schedule) {
            await this.create({ id });
        }
        return schedule;
    }
    async main(): Promise<SchedulesDocument> {
        return await this.getCreate('main');
    }

}
