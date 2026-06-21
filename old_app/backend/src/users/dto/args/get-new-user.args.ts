import { ArgsType, Field } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@ArgsType()
export class GetNewUserArgs {
    @Field()
    @IsNotEmpty()
    id: number;
}