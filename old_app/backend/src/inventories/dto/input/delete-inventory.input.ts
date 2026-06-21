import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType ()
export class deleteInventoriesInput {
    @Field()
    @IsNotEmpty()
    id: string;
}