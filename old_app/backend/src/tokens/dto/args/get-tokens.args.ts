import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class GetTokensArgs {
    @Field()
    id: string;
}