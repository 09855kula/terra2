import {Field, InputType} from "@nestjs/graphql";

@InputType()
class CostsUpdateType {

    @Field({nullable: true})
    public unit?: number;

    @Field({nullable: true})
    public cost?: number;

}
@InputType()
class ProductUpdateInput {

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

    @Field(() => [CostsUpdateType],{nullable: 'items'})
    public costs: CostsUpdateType[]

    // @Field(() => GotGiftPairs,{nullable: true})
    // public got_gift_pairs?: GotGiftPairs
}
@InputType()
export class updateOrderInput  {
    @Field( () => [ProductUpdateInput], {nullable: 'items'} )
    public products?: ProductUpdateInput[];

    @Field({nullable: true})
    public phone?: string;

    @Field()
    public id?: string;

}