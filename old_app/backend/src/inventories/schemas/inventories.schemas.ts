import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

export type InventoriesDocument = Inventories&Document;

@Schema()
class Reserved {
    @Prop()
    public id?: string;

    @Prop()
    public count?: number;

    @Prop()
    public name?: string;

    @Prop()
    public category?: string;

    @Prop()
    public available?: number;

    @Prop()
    public id_product_bot?: string;

    @Prop()
    public id_product_web?: string;
}

@Schema()
class Sold {
    @Prop()
    public id?: string;

    @Prop()
    public count?: number;

    @Prop()
    public name?: string;

    @Prop()
    public category?: string;

    @Prop()
    public available?: number;

    @Prop()
    public id_product_bot?: string;

    @Prop()
    public id_product_web?: string;
}

@Schema()
class Products {
    @Prop()
    public id?: string;

    @Prop()
    public count?: number;

    @Prop()
    public name?: string;

    @Prop()
    public category?: string;

    @Prop()
    public available?: number;

    @Prop()
    public id_product_bot?: string;

    @Prop()
    public id_product_web?: string;

}

@Schema()
export class Inventories {

    @Prop()
    public id?: string;

    @Prop()
    public created?: Date;
    @Prop()
    public owner_id?: string;

    @Prop()
    public driver_id?: string;

    @Prop({ type: () => [Products] })
    public products?: Products[];

    @Prop({ type: () => [Reserved] })
    public reserved?: Reserved[];

    @Prop({ type: () => [Sold] })
    public sold?: Sold[];

    @Prop({ type: () => [String] })
    public notified?: string[];

    @Prop({ type: () => [Number] })
    public orders?: number[];

    @Prop()
    public inventories_for_web?: boolean;

    @Prop()
    public working?: boolean;

}
export const InventoriesWebSchemas = SchemaFactory.createForClass(Inventories)

InventoriesWebSchemas.methods.available = async function(): Promise<null | object> {
    return this.products.reduce(
        (acc, p) => {
            const { count: reserved } = this.reserved.find(e => e.id === p.id) || { count: 0 };
            const { count: sold } = this.sold.find(e => e.id === p.id) || { count: 0 };
            return Object.assign(acc, {
                [p.id]: p.count - reserved - sold
            });
        }, {}
    );
}