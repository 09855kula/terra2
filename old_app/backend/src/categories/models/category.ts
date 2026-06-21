import {Field, ObjectType} from "@nestjs/graphql";


@ObjectType()
class CostCategoriesType {
    @Field({nullable: true})
    public unit?: number;

    @Field({nullable: true})
    public cost?: number;
}

@ObjectType()
class GiftCategoriesType {
    @Field({nullable: true})
    public active?: boolean;

    @Field({nullable: true})
    public gift_group?: string;

    @Field({nullable: true})
    public gift_category?: string;
}

@ObjectType()
export class CategoriesType {

    @Field({nullable: true})
    public name?: string;

    @Field({nullable: true})
    public group?: string;

    @Field({nullable: true})
    public index?: number;

    @Field( () => [CostCategoriesType], {nullable: 'items'} )
    public costs?: CostCategoriesType[];

    @Field({nullable: true})
    public pack?: number;

    @Field({nullable: true})
    public giftable?: boolean;

    @Field({nullable: true})
    public sativa?: boolean;

    @Field({nullable: true})
    public indica?: boolean;

    @Field({nullable: true})
    public lso?: boolean;

    @Field({nullable: true})
    public effect?: string;

    @Field({nullable: true})
    public measure?: string;

    @Field( () => GiftCategoriesType, {nullable: true} )
    public got_gift?: GiftCategoriesType;

    @Field({nullable: true})
    public pic_url?: string;
}