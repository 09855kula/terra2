import {Field, InputType} from "@nestjs/graphql";
import {IsNotEmpty} from "class-validator";


@InputType()
export class createProfileInput {

    @Field({nullable: true})
    @IsNotEmpty()
    public address?: string;

    @Field({nullable: true})
    @IsNotEmpty()
    public phone?: string;

    @Field({nullable: true})
    public special_instructions?: string;

}