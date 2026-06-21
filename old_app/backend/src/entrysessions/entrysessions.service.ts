import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {GetEntrysessionArgs} from "./dto/args/get-entrysession.args";
import {createEntrysessionInput} from "./dto/input/create-entrysession.input";
import {updateEntrysessionInput} from "./dto/input/update-entrysession.input";
import {deleteEntrysessionInput} from "./dto/input/delete-entrysession.input";
import {EntrysessionsWeb, EntrysessionDocument} from "./schemas/entrysessions.schemas";
import {GoogleSheetsService} from "../sheets/google-sheets.service";

@Injectable()
export class EntrysessionsService {
    constructor(@InjectModel(EntrysessionsWeb.name) private entrysessionsModel: Model<EntrysessionDocument>,
                private googleSheetsService: GoogleSheetsService) {
    }
    products: []
    async createEntrysession(createEntrysessionData: createEntrysessionInput): Promise<EntrysessionDocument> {
        const createdCategories = new this.entrysessionsModel(createEntrysessionData);
        return await createdCategories.save();

    }

    async updateEntrysession(updateEntrysessionData: updateEntrysessionInput): Promise<EntrysessionDocument> {
        return this.entrysessionsModel.findOneAndUpdate(updateEntrysessionData, {new: true})
    }

    async getEntrysession(getEntrysessionArgs: GetEntrysessionArgs): Promise<EntrysessionDocument> {
        return await this.entrysessionsModel.findOne(getEntrysessionArgs).exec();

    }

    async getEntrysessions(): Promise<EntrysessionDocument[]> {
        return await this.entrysessionsModel.find().exec();
    }

    async deleteEntrysession(deleteEntrysessionData: deleteEntrysessionInput): Promise<EntrysessionDocument> {
        return this.entrysessionsModel.findOneAndRemove(deleteEntrysessionData)

    }
    async getEntrySession(entry_id, platform_id, user_id) {
        try {
            let entry_session = await this.entrysessionsModel.findOne({ entry_id, platform_id, user_id }).exec();
            if (entry_session == null) {
                return null;
            }
            return entry_session.toObject();
        }
        catch (err) {
            // logger.error(`Can not get entry session: entry_id = ${entry_id}, platform_id = ${platform_id}, user_id = ${user_id}, err = ${err}`);
            throw err;
        }
    }
    async getAllEntrySessions(entry_id, platform_id) {
        try {
            return (await this.entrysessionsModel.find({ entry_id, platform_id }).exec() || []).map(doc => doc.toObject());
        }
        catch (err) {
            // logger.error(`Can not get all entry sessions: entry_id = ${entry_id}, platform_id = ${platform_id}, err = ${err}`);
            throw err;
        }
    }
    async createEntrySession(entry_id, platform_id, user_id, lang, state_id) {
        try {
            const entry_session = await this.entrysessionsModel.findOne({ entry_id, platform_id, user_id }).exec();
            if (entry_session == null) {
                const new_entry_session = await new exports.EntrySessionModel({
                    entry_id,
                    platform_id,
                    user_id,
                    lang,
                    state_id,
                });
                await new_entry_session.save();
            }
            return await this.getEntrySession(entry_id, platform_id, user_id);
        }
        catch (err) {
            // logger.error(`Can not create entry session: entry_id = ${entry_id}, platform_id = ${platform_id}, user_id = ${user_id}, err = ${err}`);
            throw err;
        }
    }
    async updateEntrySession(entry_id, platform_id, user_id, path, value) {
        try {
            await this.entrysessionsModel.updateOne({ entry_id, platform_id, user_id }, { $set: { [path]: value } }).exec();
            return await this.getEntrySession(entry_id, platform_id, user_id);
        }
        catch (err) {
            // logger.error(`Can not update entry session: entry_id = ${entry_id}, platform_id = ${platform_id}, user_id = ${user_id}, err = ${err}`);
            throw err;
        }
    }
}
