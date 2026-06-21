import {Field, ObjectType} from "@nestjs/graphql";
import {Prop} from "@nestjs/mongoose";

@ObjectType()
class ReservedInventoriesType {
    @Field()
    public id?: string;

    @Field()
    public count?: number;

    @Field()
    public name?: string;

    @Field()
    public category?: string;

    @Field()
    public available?: number;

    @Field()
    public id_product_bot?: string;

    @Field()
    public id_product_web?: string;
}

@ObjectType()
class SoldInventoriesType {
    @Field()
    public id?: string;

    @Field()
    public count?: number;

    @Field()
    public name?: string;

    @Field()
    public category?: string;

    @Field()
    public available?: number;

    @Field()
    public id_product_bot?: string;

    @Field()
    public id_product_web?: string;
}

@ObjectType()
class ProductsInventoriesType {
    @Field()
    public id?: string;

    @Field()
    public count?: number;

    @Field()
    public name?: string;

    @Field()
    public category?: string;

    @Field()
    public available?: number;

    @Field()
    public id_product_bot?: string;

    @Field()
    public id_product_web?: string;
}

@ObjectType()
export class InventoriesType {

    @Field()
    public id?: string;

    @Field()
    public created?: Date;
    @Field()
    public owner_id?: string;

    @Field()
    public driver_id?: string;


    @Field( () => [ProductsInventoriesType])
    public products?: ProductsInventoriesType[];

    @Field( () => [ReservedInventoriesType])
    public reserved?: ReservedInventoriesType[];

    @Field( () => [SoldInventoriesType])
    public sold?: SoldInventoriesType[];

    @Field( () => [String])
    public notified?: string[];

    @Field( () => [Number])
    public orders?: number[];

    @Field()
    public inventories_for_web?: boolean;

    @Field()
    public working?: boolean;
}