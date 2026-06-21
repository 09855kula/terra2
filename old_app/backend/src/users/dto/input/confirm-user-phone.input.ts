import {Field, InputType} from "@nestjs/graphql";
import {IsNotEmpty} from "class-validator";


@InputType()
export class confirmUserPhoneInput {

    @Field({ nullable: true })
    @IsNotEmpty()
    public phone?: string;

    @Field({ nullable: true })
    @IsNotEmpty()
    public token?: number;

}