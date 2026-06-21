import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

export type ProfilesDocument = ProfilesWeb& Document;

@Schema()
export class ProfilesWeb {

    @Prop({required: true})
    public id?: string;

    @Prop({required: true})
    public address?: string;

    @Prop()
    public district?: string;

    @Prop()
    public phone?: string;

    @Prop()
    public friend?: string;

    @Prop()
    public user_id?: number;

    @Prop()
    public token_id?: number;

    @Prop()
    public special_instructions?: string;

    @Prop()
    public created?: string;

    @Prop()
    public updated?: string;

    @Prop()
    public approved?: string;

    @Prop({required: true})
    public status?: string;

    @Prop()
    public comment?: string;
}

export const ProfilesSchemas = SchemaFactory.createForClass(ProfilesWeb)