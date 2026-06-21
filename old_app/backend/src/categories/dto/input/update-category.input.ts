import {Field, InputType} from "@nestjs/graphql";

@InputType()
class UpdateCostCategoriesInput {
    @Field({nullable: true})
    public unit?: number;

    @Field({nullable: true})
    public cost?: number;
}

@InputType()
class UpdateGiftCategoriesInput {
    @Field({nullable: true})
    public active?: boolean;

    @Field({nullable: true})
    public gift_group?: string;

    @Field({nullable: true})
    public gift_category?: string;
}

@InputType()
export class updateCategoriesInput {

    @Field({nullable: true})
    public name?: string;

    @Field({nullable: true})
    public group?: string;

    @Field({nullable: true})
    public index?: number;

    @Field( () => UpdateCostCategoriesInput, {nullable: true} )
    public costs?: UpdateCostCategoriesInput[];

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

    @Field( () => UpdateGiftCategoriesInput, {nullable: true} )
    public got_gift?: UpdateGiftCategoriesInput;

    @Field({nullable: true})
    public pic_url?: string;
}