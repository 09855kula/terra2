import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class GetMessagesArgs {
    @Field()
    message_id: string;
}