import {Field, InputType} from "@nestjs/graphql";
import {IsNotEmpty} from "class-validator";


@InputType()
export class setUserFirstNameInput {

    @Field({ nullable: true })
    @IsNotEmpty()
    public phone?: string;

    @Field({ nullable: true })
    public first_name?: string;

}