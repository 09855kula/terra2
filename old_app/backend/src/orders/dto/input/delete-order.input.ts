import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType ()
export class deleteOrderInput {
    @Field()
    @IsNotEmpty()
    id: string;
    @Field()
    @IsNotEmpty()
    phone: string;
}