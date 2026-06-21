import { ArgsType, Field } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@ArgsType()
export class GetUserNotifications {
    @Field()
    @IsNotEmpty()
    phone: string;
}