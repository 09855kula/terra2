import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType ()
export class deleteTokenInput {
    @Field()
    @IsNotEmpty()
    id: string;
}