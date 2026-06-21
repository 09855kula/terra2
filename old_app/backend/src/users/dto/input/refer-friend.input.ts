import {Field, InputType} from "@nestjs/graphql";
import {IsNotEmpty} from "class-validator";


@InputType()
export class referFriendInput {

    @Field({ nullable: true })
    @IsNotEmpty()
    public phone?: string;

    @Field({ nullable: true })
    @IsNotEmpty()
    public address_friend?: string;

    @Field({ nullable: true })
    @IsNotEmpty()
    public phone_friend?: string;

}