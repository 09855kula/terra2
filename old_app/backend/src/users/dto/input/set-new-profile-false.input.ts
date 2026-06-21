import {Field, InputType} from "@nestjs/graphql";
import {IsNotEmpty} from "class-validator";


@InputType()
export class SetNewProfileFalseInput {

    @Field({ nullable: true })
    @IsNotEmpty()
    public phone?: string;

}