import {Field, InputType} from "@nestjs/graphql";


@InputType()
class ReservedInventoriesInput {
    @Field()
    public id?: string;

    @Field()
    public count?: number;
}

@InputType()
class SoldInventoriesInput {
    @Field()
    public id?: string;

    @Field()
    public count?: number;
}

@InputType()
class ProductsInventoriesInput {
    @Field()
    public id?: string;

    @Field()
    public count?: number;
}

@InputType()
export class createInventoriesInput {

    @Field()
    public id?: string;

    @Field()
    public created?: Date;
    @Field()
    public owner_id?: string;

    @Field( () => [ProductsInventoriesInput])
    public products?: ProductsInventoriesInput[];

    @Field( () => [ReservedInventoriesInput])
    public reserved?: ReservedInventoriesInput[];

    @Field( () => [SoldInventoriesInput])
    public sold?: SoldInventoriesInput[];

    @Field( () => [String])
    public notified?: string[];

    @Field( () => [Number])
    public orders?: number[];

}