import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType()
class GotGiftPairsType{

    @Field({nullable: true})
    public cost?: number;

    @Field({nullable: true})
    public gift_holder?: string;

    @Field({nullable: true})
    public id?: string;

    @Field({nullable: true})
    public name?: string;

    @Field({nullable: true})
    public is_gift?: string;

}
@ObjectType()
class CostsOrderType {

    @Field({nullable: true})
    public unit?: number;

    @Field({nullable: true})
    public cost?: number;

}
@ObjectType()
class ProductResponseType {

    @Field({nullable: true})
    public name?: string;

    @Field({nullable: true})
    public category?: string;

    @Field({nullable: true})
    public cost?: number;

    @Field({nullable: true})
    public pack?: number;

    @Field({nullable: true})
    public img_url?: string;

    @Field({nullable: true})
    public measure?: string;

    @Field({nullable: true})
    public id?: string;

    @Field({nullable: true})
    public group?: string;

    @Field({nullable: true})
    public count?: number;

    @Field(() => [CostsOrderType],{nullable: 'items'})
    public costs: CostsOrderType[]

    // @Field(() => GotGiftPairs,{nullable: true})
    // public got_gift_pairs?: GotGiftPairs
}
@ObjectType()
class UsedDiscountOrderType{

    @Field({nullable: true})
    public amount?: number;

    @Field({nullable: true})
    public informed?: boolean;

    @Field({nullable: true})
    public start_date?: string;

}
@ObjectType()
class DeliveryType {

    @Field({nullable: true})
    public date?: string

    @Field({nullable: true})
    public timeslot?: string;

    @Field({nullable: true})
    public cut_offs?: string;

    @Field({nullable: true})
    public address?: string;

    @Field({nullable: true})
    public district?: string;

    @Field({nullable: true})
    public customer_comment?: string;

    @Field({nullable: true})
    public change?: string;

    @Field({nullable: true})
    public total?: number;

    @Field({nullable: true})
    public total_after_discount?: number;

    // @Field({nullable: true})
    // public delivery_date?: string;

    @Field(() => UsedDiscountOrderType,{nullable: true})
    public used_discount: UsedDiscountOrderType
}
@ObjectType()
export class OrderProductsType  {

    @Field( () => [ProductResponseType], {nullable: 'items'} )
    public products?: ProductResponseType[];

    @Field({nullable: true})
    public phone?: string;

    @Field(() => DeliveryType,{nullable: true})
    public delivery?: DeliveryType;

}