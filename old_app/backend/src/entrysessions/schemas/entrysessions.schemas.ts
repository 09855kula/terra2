import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {Document} from "mongoose";

export type EntrysessionDocument = EntrysessionsWeb&Document;

@Schema()
export class Data {

    @Prop({required: true})
    public last_message_from_side?: string;

    @Prop({required: true})
    public phone?: string;

    @Prop({required: true})
    public last_message_id?: string;

    @Prop({required: true})
    public current_group?: string;

    @Prop({required: true})
    public current_category?: string;

    @Prop({required: true})
    public notified_about_freebie?: number;

    @Prop({required: true})
    public current_order?: number;

    @Prop({required: true})
    public profile_for_route?: string;

    @Prop({required: true})
    public profile_address?: string;

    @Prop({required: true})
    public profile_phone?: string;

    @Prop({required: true})
    public profile_instructions?: string;

    @Prop({required: true})
    public current_profile?: number;
}
@Schema()
export class EntrysessionsWeb {

    @Prop({required: true})
    public entry_id?: string;

    @Prop({required: true})
    public platform_id?: string;

    @Prop({required: true})
    public user_id?: string;

    @Prop({required: true})
    public state_id?: string;

    @Prop({required: true})
    public lang?: string;

    @Prop({required: true})
    public data?: Data;

    @Prop({required: true})
    public created_at?: Date;

    @Prop({required: true})
    public updated_at?: Date;

}
export const EntrysessionSchemas = SchemaFactory.createForClass(EntrysessionsWeb)

