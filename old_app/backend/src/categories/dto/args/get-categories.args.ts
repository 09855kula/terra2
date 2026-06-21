import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class GetCategoriesArgs {
    @Field()
    name: string;
}