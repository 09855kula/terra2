import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";
import {UserProducts, UsersWeb} from "../../users/schemas/users.schemas";

export type OrdersWebDocument = OrdersWeb & Document;

@Schema()
class ProductList {
    @Prop()
    public id?: string;

    @Prop()
    public count?: number;
}

@Schema()
export class Comments {

    @Prop()
    public user_id?: number;

    @Prop()
    public text?: string;

    @Prop()
    public image?: string;

    @Prop()
    public role?: string;

    @Prop({default: true})
    public isRead?: boolean;

    @Prop()
    public created?: Date;
}

@Schema()
class UsedDiscount {
    @Prop()
    public amount?: number;

    @Prop()
    public informed?: boolean;

    @Prop()
    public start_date?: Date;
}

@Schema()
class GiftPairs {
    @Prop()
    public id?: string;

    @Prop()
    public gift_holder?: string;

    @Prop()
    public is_gift?: string;
}

@Schema()
class Gifts {
    @Prop()
    public gift_of?: string;

    @Prop()
    public id?: string;

    @Prop()
    public name?: string;

    @Prop()
    public amount?: number;
}

@Schema()
class OrderBonuses {
    @Prop()
    public costs?: number;

    @Prop({type: () => [Gifts]})
    public gifts?: Gifts[];
}

@Schema()
export class OrdersWeb {
    @Prop({required: true})
    public id?: string;

    @Prop({type: () => UsersWeb})
    public user?: UsersWeb;

    @Prop()
    public driver_id?: string;

    @Prop({type: () => [UserProducts]})
    public products?: UserProducts[];

    @Prop()
    public inventory?: string;

    @Prop({type: () => [ProductList]})
    public product_list?: ProductList[];

    @Prop()
    public total?: number;

    @Prop()
    public total_after_discount?: number;

    @Prop()
    public profile?: number;

    @Prop()
    public phone?: string;

    @Prop()
    public address?: string;

    @Prop()
    public district?: string;

    @Prop({type: () => [Comments]})
    public comments?: Comments[];

    @Prop({required: true})
    public created?: Date;

    @Prop()
    public updated?: Date;

    @Prop()
    public confirmed?: Date;

    @Prop()
    public approved?: Date;

    @Prop()
    public timeslot?: string;

    @Prop()
    public cut_offs?: string;

    @Prop()
    public delivery_date?: string;

    @Prop()
    public customer_rating?: number;

    @Prop()
    public customer_comment?: string;

    @Prop()
    public driver_rating?: number;

    @Prop()
    public driver_comment?: string;

    @Prop()
    public change?: string;

    @Prop({required: true})
    public status?: string;

    @Prop({type: () => UsedDiscount})
    public used_discount?: UsedDiscount;

    @Prop()
    public pending_expired?: boolean;

    @Prop({type: () => [GiftPairs]})
    public got_gift_pairs?: GiftPairs[];

    @Prop()
    public gift_product?: string;

    @Prop({type: () => OrderBonuses})
    public order_bonuses?: OrderBonuses;

    @Prop()
    public is_use_point?: boolean;

    @Prop({default: false})
    public isClose?: boolean

    @Prop()
    public products_id?: string[];

    @Prop({default: true})
    public isWeb?: boolean

}

export const OrdersWebSchemas = SchemaFactory.createForClass(OrdersWeb)
OrdersWebSchemas.methods.all_products = async function (): Promise<null | object> {
    if (this.gift_product) return this.products_id.concat(this.gift_product);
    return this.products_id;
}