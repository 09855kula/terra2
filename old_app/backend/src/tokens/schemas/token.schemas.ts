import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

export type TokenDocument = TokensWeb & Document;

@Schema()
class Comments  {

    @Prop()
    public user_id?: number;

    @Prop()
    public text?: string;

    @Prop()
    public created?: string;
}

@Schema()
export class TokensWeb {

    @Prop({required: true})
    public owner_tg_user_id?: number;

    @Prop({required: true})
    public id?: string;

    @Prop({required: true})
    public code?: string;

    @Prop({type: () => Comments})
    public comments?: Comments[];

    @Prop({required: true})
    public created?: Date;

    @Prop()
    public updated?: Date;

    @Prop()
    public approved?: Date;

    @Prop({required: true})
    public role?: string;

    @Prop({required: true})
    public status?: string;

    @Prop({required: true})
    public profile?: number;

    @Prop()
    public referral_tg_users_ids?: number[];
}
export const TokenSchemas = SchemaFactory.createForClass(TokensWeb)