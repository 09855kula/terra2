import { ArgsType, Field } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@ArgsType()
export class GetProductsByIdArgs {
    @Field(() => String)
    @IsNotEmpty()
    ids: string[];
}