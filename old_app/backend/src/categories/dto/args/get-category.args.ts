import { ArgsType, Field } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@ArgsType()
export class GetCategoryArgs {
    @Field()
    @IsNotEmpty()
    index: number;
}