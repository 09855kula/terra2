import {Field, InputType} from "@nestjs/graphql";
import {IsNotEmpty} from "class-validator";


@InputType()
export class addUserAddressInput {

    @Field({ nullable: true })
    @IsNotEmpty()
    public phone?: string;
    @IsNotEmpty()
    @Field({ nullable: true })
    public address?: string;

}