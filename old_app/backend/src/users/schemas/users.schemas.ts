import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UsersWebDocument = UsersWeb & Document;
@Schema()

class Costs   {
    @Prop()
    public cost?: number;

    @Prop()
    public unit?: number;
}
@Schema()
export class Notifications {
    @Prop()
    public title?: string;

    @Prop()
    public description?: string;

    @Prop()
    public created?: string;
}
@Schema()
class Notification  {
    @Prop()
    public five_week_expired?: Date;

    @Prop()
    public seven_week_expired?: Date;
}
@Schema()
export class Next_order_discount  {
    @Prop()
    public amount?: number;

    @Prop()
    public start_date?: Date;
}
@Schema()
export class GiftPairs  {
    @Prop()
    public id?: string;

    @Prop()
    public gift_holder?: string;

    @Prop()
    public is_gift?: string;

    @Prop()
    public name?: string;

    @Prop()
    public cost?: number;
}
@Schema()
export class UserProducts{
    @Prop()
    public name?: string;

    @Prop()
    public pack?: number;

    @Prop()
    public measure?: string;

    @Prop()
    public category?: string;

    @Prop()
    public id?: string;

    @Prop()
    public img_url?: string;

    @Prop()
    public group?: string;

    @Prop()
    public cost?: number;

    @Prop()
    public count?: number;

    @Prop({ type: () => [Costs] })
    public costs?: Costs[];

    @Prop({ type: () => GiftPairs })
    public got_gift_pairs?: GiftPairs;
}
@Schema()
export class Comments {
    @Prop()
    public role?: string;

    @Prop()
    public user_id?: number;

    @Prop()
    public text?: string;

    @Prop()
    public image?: string;

    @Prop()
    public isRead?: boolean;

    @Prop()
    public created?: string;
}

@Schema()
export class Carts  {
    @Prop({ type: () => [UserProducts] })
    public products?: UserProducts[];

    @Prop()
    public id?: string;

    @Prop()
    public status?: string;

    @Prop()
    public created?: Date;

    @Prop()
    public updated?: Date;

    @Prop()
    public address?: string;

    @Prop()
    public delivery_date?: string;

    @Prop()
    public timeslot?: string;

    @Prop()
    public products_list?: string[];

    @Prop()
    public cut_offs?: string;

    @Prop()
    public total_after_discount?: number;

    @Prop({ type: () => [Comments] })
    public comments?: Comments[];
}
@Schema()
export class UsersWeb {
    @Prop()
    public id?: number;

    @Prop()
    public first_name?: string;

    @Prop()
    public last_name?: string;

    @Prop({ required: true })
    public phone?: string;

    @Prop()
    public username?: string;

    @Prop({ required: true })
    public role?: string;

    @Prop({ required: true, default: false})
    public first_order?: boolean;

    @Prop()
    public is_vip?: boolean;

    @Prop()
    public points?: number;

    @Prop()
    public created?: Date;

    @Prop()
    public updated?: Date;

    @Prop()
    public referral_code?: string;

    @Prop({ type: () => [Number] })
    public orders?: number[];

    @Prop({ type: () => [Number] })
    public tokens?: number[];

    @Prop()
    public token?: number;

    @Prop({ type: () => [String] })
    public profiles?: number[];

    @Prop()
    public inventory?: string;

    @Prop()
    public route?: string;

    @Prop()
    public last_profile?: number;

    @Prop()
    public profile_confirmed?: boolean;

    @Prop({ type: () => [String] })
    public phones?: string[];

    @Prop({ type: () => [String] })
    public addresses?: string[];

    @Prop()
    public limited?: Date;

    @Prop()
    public five_weeks_limited?: Date;

    @Prop()
    public six_weeks_limited?: Date;

    @Prop()
    public seven_weeks_limited?: Date;

    @Prop({ type: () => Carts })
    public cart?: Carts;

    @Prop({ type: () => [Comments] })
    public comments?: Comments[];

    @Prop({ type: () => Notifications })
    public notifications?: Notifications;

    @Prop({ type: () => Notification })
    public notification?: Notification;

    @Prop({ type: () => Next_order_discount })
    public next_order_discount?: Next_order_discount;

    @Prop( {default: true})
    public new_profile?:  boolean;

    @Prop({default: false})
    public use_safari?:  boolean;

    @Prop({default: false})
    public is_token_right?:  boolean;

    @Prop({default: false})
    public is_token_reverse?:  boolean;

    @Prop({default: false})
    public is_token_invalid?:  boolean;
}


export const UsersWebSchemas = SchemaFactory.createForClass(UsersWeb)