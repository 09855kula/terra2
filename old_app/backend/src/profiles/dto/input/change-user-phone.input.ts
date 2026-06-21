import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType ()
export class changeUserPhoneInput {
    @Field()
    @IsNotEmpty()
    user_id: number;

    @Field()
    @IsNotEmpty()
    phone: string;

}