import {Field, ObjectType} from "@nestjs/graphql";
import {UserProductsType, UserType} from "../../users/models/user";
import {Prop} from "@nestjs/mongoose";


@ObjectType()
class ProductListType  {
    @Field({nullable: true})
    public id?: string;

    @Field({nullable: true})
    public count?: number;
}
@ObjectType()
export class CommentsOrderType  {

    @Field({nullable: true})
    public user_id?: number;

    @Field({nullable: true})
    public text?: string;

    @Field({nullable: true})
    public image?: string;

    @Field({nullable: true, defaultValue: true})
    public isRead?: boolean;

    @Field({nullable: true})
    public created?: Date;

    @Field()
    public role?: string;
}

@ObjectType()
class UsedDiscountType {
    @Field({nullable: true})
    public amount?: number;

    @Field({nullable: true})
    public informed?: boolean;

    @Field({nullable: true})
    public start_date?: Date;
}

@ObjectType()
class GiftPairsOrderType {
    @Field({nullable: true})
    public id?: string;

    @Field({nullable: true})
    public gift_holder?: string;

    @Field({nullable: true})
    public is_gift?: string;
}

@ObjectType()
class GiftsType {
    @Field({nullable: true})
    public gift_of?: string;

    @Field({nullable: true})
    public id?: string;

    @Field({nullable: true})
    public name?: string;

    @Field({nullable: true})
    public amount?: number;
}

@ObjectType()
class OrderBonusesType  {
    @Field({nullable: true})
    public costs?: number;

    @Field( () => [GiftsType], {nullable: 'items'} )
    public gifts?: GiftsType[];
}

@ObjectType()
export class OrderType  {
    @Field({ nullable: true })
    public id?: string;

    @Field( () => UserType)
    public user?: UserType;

    @Field({nullable: true})
    public driver_id?: string;

    @Field( () => [UserProductsType], {nullable: 'items'} )
    public products?: UserProductsType[];

    @Field({nullable: true})
    public inventory?: string;

    @Field( () => [ProductListType], {nullable: 'items'} )
    public product_list?: ProductListType[];

    @Field({nullable: true})
    public total?: number;

    @Field({nullable: true})
    public total_after_discount?: number;

    @Field({nullable: true})
    public profile?: number;

    @Field({nullable: true})
    public phone?: string;

    @Field({nullable: true})
    public address?: string;

    @Field({nullable: true})
    public district?: string;

    @Field( () => [CommentsOrderType], {nullable: true} )
    public comments?: CommentsOrderType[];

    @Field({nullable: true})
    public created?: Date;

    @Field({nullable: true})
    public updated?: Date;

    @Field({nullable: true})
    public confirmed?: Date;

    @Field({nullable: true})
    public approved?: Date;

    @Field({nullable: true})
    public timeslot?: string;

    @Field({nullable: true})
    public cut_offs?: string;

    @Field({nullable: true})
    public delivery_date?: string;

    @Field({nullable: true})
    public customer_rating?: number;

    @Field({nullable: true})
    public customer_comment?: string;

    @Field({nullable: true})
    public driver_rating?: number;

    @Field({nullable: true})
    public driver_comment?: string;

    @Field({nullable: true})
    public change?: string;

    @Field({nullable: true})
    public status?: string;

    @Field( () => UsedDiscountType, {nullable: true} )
    public used_discount?: UsedDiscountType;

    @Field({nullable: true})
    public pending_expired?: boolean;

    @Field( () => [GiftPairsOrderType], {nullable: true} )
    public got_gift_pairs?: GiftPairsOrderType[];

    @Field({nullable: true})
    public gift_product?: string;

    @Field( () => OrderBonusesType, {nullable: true} )
    public order_bonuses?: OrderBonusesType;

    @Field({nullable: true})
    public is_use_point?: boolean;

    @Field({nullable: true})
    public isClose?: boolean

    @Field(() => [String], {nullable: true})
    public products_id?: string[];

    @Field({nullable: true})
    public isWeb?: boolean

}