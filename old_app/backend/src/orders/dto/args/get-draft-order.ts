import { ArgsType, Field } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@ArgsType()
export class GetDraftOrder {
    @Field()
    @IsNotEmpty()
    phone: string;
}