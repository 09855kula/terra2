import { ArgsType, Field } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@ArgsType()
export class GetProfileArgs {
    @Field()
    @IsNotEmpty()
    user_id: number;
}