import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType ()
export class deleteRouteInput {
    @Field()
    @IsNotEmpty()
    id: string;
}