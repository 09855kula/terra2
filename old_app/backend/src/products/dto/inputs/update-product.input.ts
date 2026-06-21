import {InputType, Field, ID} from '@nestjs/graphql';

@InputType()
export class updateProductInput {

    @Field()
    readonly active: boolean;

    @Field()
    readonly name: string;

    @Field()
    readonly description: string;

    @Field()
    readonly img_url: string;

    @Field()
    readonly category: string;

    @Field({ nullable: true })
    readonly hit?: boolean;

    @Field(() => ID)
    id: string;
}