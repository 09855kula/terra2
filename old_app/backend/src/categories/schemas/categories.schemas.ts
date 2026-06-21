import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

export type CategoriesDocument = CategoriesWeb& Document;

@Schema()
class Cost {
    @Prop()
    public unit?: number;

    @Prop()
    public cost?: number;
}

@Schema()
class Gift {
    @Prop()
    public active?: boolean;

    @Prop()
    public gift_group?: string;

    @Prop()
    public gift_category?: string;
}

@Schema()
export class CategoriesWeb {

    @Prop({ required: true })
    public name?: string;

    @Prop({ required: true })
    public group?: string;

    @Prop({ required: true })
    public index?: number;

    @Prop({ type: () => [Cost] })
    public costs?: Cost[];

    @Prop()
    public pack?: number;

    @Prop()
    public giftable?: boolean;

    @Prop()
    public sativa?: boolean;

    @Prop()
    public indica?: boolean;

    @Prop()
    public lso?: boolean;

    @Prop()
    public effect?: string;

    @Prop()
    public measure?: string;

    @Prop({ type: () => Gift })
    public got_gift?: Gift;

    @Prop()
    public pic_url?: string;
}

export const CategoriesSchemas = SchemaFactory.createForClass(CategoriesWeb)