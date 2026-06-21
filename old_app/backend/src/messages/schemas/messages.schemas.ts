import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

export type MessagesDocument = MessagesWeb&Document;

@Schema()
export class MessagesWeb {

    @Prop({required: true, index: true})
    public message_id?: string;

    @Prop({required: true})
    public chat_id?: string;

    @Prop()
    public createdAt?: Date;

    @Prop()
    public updatedAt?: Date;
}
export const MessagesSchemas = SchemaFactory.createForClass(MessagesWeb)

