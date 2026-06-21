import {Field, InputType} from "@nestjs/graphql";
import {IsNotEmpty} from "class-validator";


@InputType()
export class updateInstructionsInput {

    @Field({nullable: true})
    @IsNotEmpty()
    public id?: string;

    @Field({nullable: true})
    @IsNotEmpty()
    public special_instructions?: string;

}