import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {GetMessageArgs} from "./dto/args/get-message.args";
import {createMessageInput} from "./dto/input/create-message.input";
import {updateMessageInput} from "./dto/input/update-message.input";
import {deleteMessagesInput} from "./dto/input/delete-message.input";
import {MessagesWeb, MessagesDocument} from "./schemas/messages.schemas";
import {GoogleSheetsService} from "../sheets/google-sheets.service";
import moment from "moment";

@Injectable()
export class MessagesService {
    constructor(@InjectModel(MessagesWeb.name) private messagesModel: Model<MessagesDocument>,
                private googleSheetsService: GoogleSheetsService) {
    }
    products: []
    async createMessage(createMessageData: createMessageInput): Promise<MessagesDocument> {
        const createdCategories = new this.messagesModel(createMessageData);
        return await createdCategories.save();

    }

    async updateMessage(id, updateMessageData: updateMessageInput): Promise<MessagesDocument> {
        return this.messagesModel.findOneAndUpdate(id, updateMessageData, {new: true})
    }

    async getMessage(getMessageArgs: GetMessageArgs): Promise<MessagesDocument> {
        return await this.messagesModel.findOne(getMessageArgs).exec();

    }

    async getMessages(): Promise<MessagesDocument[]> {
        try {
            return await this.messagesModel.find().exec();
        } catch (err) {
            // logger.error(`Can not get messages, err = ${err}`);
            console.log(`Can not get messages, err = ${err}`);
            throw err;
        }
    }

    async removeMessage(deleteMessageData: deleteMessagesInput): Promise<MessagesDocument> {
        return this.messagesModel.findOneAndRemove(deleteMessageData)

    }
   async addMessage(chat_id: string, message_id: string): Promise<object> {
        try {
            const message = await new this.messagesModel(
                {
                    chat_id,
                    message_id,
                    created_at: moment()
                }
            );
            await message.save();
            return await this.messagesModel.findOne({message_id, chat_id});
        } catch (err) {
            // logger.error(`Can not add message: message_id = ${message_id}, chat_id = ${chat_id}, err = ${err}`);
            console.log(`Can not add message: message_id = ${message_id}, chat_id = ${chat_id}, err = ${err}`)
            throw err;
        }
    }
    async deleteMessage(chat_id: string, message_id: string): Promise<object> {
        try {
            let message = {};
            message = await this.messagesModel.deleteOne({
                message_id,
                chat_id
            }).exec();
            console.log(`Currently deleting message message_id=${message_id}, chat_id=${chat_id}`)
            return message;
        } catch (err) {
            // logger.error(`Can not delete message: message_id = ${message_id}, chat_id = ${chat_id}, err = ${err}`);
            console.log(`Can not delete message: message_id = ${message_id}, chat_id = ${chat_id}, err = ${err}`)
            throw err;
        }
    }
    // async getMessagesGroupedByChatIdAndSorted(): Promise<object> {
    //     try {
    //         let yesterday = moment();
    //         yesterday.subtract(1, 'days');
    //         const yesterdayDate = yesterday.toDate();
    //         console.log("Messages older than: "+yesterdayDate)
    //         const match = {$match:{created_at:{$lte: yesterdayDate }}};
    //         const sort = {$sort: {created_at: 1}};
    //
    //         const group = {$group:{_id: {chat_id:"$chat_id"}, messages: {$push:"$$ROOT"} }};
    //         const agg = this.aggregate([match, sort, group ]).allowDiskUse(true);
    //
    //         const messages = await agg.exec(); //, sort, group]);
    //         const flatMessages = messages.reduce((a,c)=>{
    //             c.messages.pop();
    //             return a.concat(c.messages);
    //         },[]);
    //         console.log(`messages to delete: ${flatMessages.length}`)
    //         return flatMessages;
    //     } catch (err) {
    //         logger.error(`Can not get messages, err = ${err}`);
    //         throw err;
    //     }
    // }

}
