import {Field, ID, ObjectType} from '@nestjs/graphql';

@ObjectType ()
export class ProductType {

    @Field({ nullable: true })
    readonly active: boolean;

    @Field({ nullable: true })
    readonly name: string;

    @Field({ nullable: true })
    readonly description: string;

    @Field({ nullable: true })
    readonly img_url: string;

    @Field({ nullable: true })
    category: string;

    @Field({ nullable: true })
    readonly hit?: boolean;

    @Field(() => ID, { nullable: true })
    id: string;

    @Field({ nullable: true})
    readonly available: number;

    @Field({ nullable: true })
    readonly top_effect: string;

    @Field({ nullable: true })
    readonly top_flavour: string;

    @Field({ nullable: true })
    readonly price_tag: string;

    @Field({ nullable: true })
    readonly type: string;



}
