import { ArgsType, Field } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@ArgsType()
export class GetRouteArgs {
    @Field()
    @IsNotEmpty()
    id: string;
}