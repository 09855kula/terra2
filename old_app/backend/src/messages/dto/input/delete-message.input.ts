import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType ()
export class deleteMessagesInput {
    @Field()
    @IsNotEmpty()
    message_id: string;
}