import {Field, InputType} from "@nestjs/graphql";

@InputType()
class GotGiftPairs{

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
@InputType()
class Costs {

    @Field({nullable: true})
    public unit?: number;

    @Field({nullable: true})
    public cost?: number;

}
@InputType()
class ProductResponseInput {

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

    @Field(() => [Costs],{nullable: 'items'})
    public costs: Costs[]

    // @Field(() => GotGiftPairs,{nullable: true})
    // public got_gift_pairs?: GotGiftPairs
}
@InputType()
class UsedDiscount{

    @Field({nullable: true})
    public amount?: number;

    @Field({nullable: true})
    public informed?: boolean;

    @Field({nullable: true})
    public start_date?: string;

}
@InputType()
class Delivery {

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

    @Field(() => UsedDiscount,{nullable: true})
    public used_discount: UsedDiscount
}
@InputType()
export class createOrderInput  {
    
    @Field( () => [ProductResponseInput], {nullable: 'items'} )
    public products?: ProductResponseInput[];
    
    @Field({nullable: true})
    public phone?: string;

    @Field(() => Delivery,{nullable: true})
    public delivery?: Delivery;

}