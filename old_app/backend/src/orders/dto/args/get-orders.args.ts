import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class GetOrdersArgs {
    @Field()
    phone: string;
}