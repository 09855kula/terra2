import {Field, InputType} from "@nestjs/graphql";

@InputType()
class updateReservedInventoriesInput {
    @Field()
    public id?: string;

    @Field()
    public count?: number;
}

@InputType()
class updateSoldInventoriesInput {
    @Field()
    public id?: string;

    @Field()
    public count?: number;
}

@InputType()
class updateProductsInventoriesInput {
    @Field()
    public id?: string;

    @Field()
    public count?: number;
}

@InputType()
export class updateInventoriesInput {

    @Field()
    public id?: string;

    @Field()
    public created?: Date;
    @Field()
    public owner_id?: string;

    @Field( () => [updateProductsInventoriesInput])
    public products?: updateProductsInventoriesInput[];

    @Field( () => [updateReservedInventoriesInput])
    public reserved?: updateReservedInventoriesInput[];

    @Field( () => [updateSoldInventoriesInput])
    public sold?: updateSoldInventoriesInput[];

    @Field( () => [String])
    public notified?: string[];

    @Field( () => [Number])
    public orders?: number[];

}