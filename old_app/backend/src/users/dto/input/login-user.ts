import {ArgsType, Field, InputType} from "@nestjs/graphql";
import {IsNotEmpty} from "class-validator";

@InputType()
export class loginUserInput   {
    @Field()
    @IsNotEmpty()
    public phone?: string;
}


