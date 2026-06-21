import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

export type SchedulesDocument = SchedulesWeb&Document;

@Schema()
export class SchedulesWeb {

    @Prop()
    public id?: string;

    @Prop()
    public product_sheet?: string;

    @Prop()
    public mode?: string;

    @Prop()
    public alone?: boolean;

    @Prop({ type: () => [String] })
    public drivers?: string[];

}
export const SchedulesWebSchemas = SchemaFactory.createForClass(SchedulesWeb)
