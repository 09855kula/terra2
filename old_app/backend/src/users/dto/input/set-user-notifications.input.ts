import {Field, InputType} from "@nestjs/graphql";
import {IsNotEmpty} from "class-validator";


@InputType()
export class setUserNotificationsInput {

    @Field({ nullable: true })
    @IsNotEmpty()
    public phone?: string;

    @Field({ nullable: true })
    public title?: string;

    @Field({ nullable: true })
    public description?: string;

}