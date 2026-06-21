import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType ()
export class deleteScheduleInput {
    @Field()
    @IsNotEmpty()
    id: string;
}