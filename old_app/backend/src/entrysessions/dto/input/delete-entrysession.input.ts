import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType ()
export class deleteEntrysessionInput {

    @Field()
    @IsNotEmpty()
    public user_id?: string;

}