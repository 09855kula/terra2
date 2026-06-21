import { ArgsType, Field } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@ArgsType()
export class GetScheduleArgs {
    @Field()
    @IsNotEmpty()
    id: string;
}