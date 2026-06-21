import {Field, InputType} from "@nestjs/graphql";


@InputType()
export class createMessageInput {

    @Field()
    public message_id?: string;

    @Field()
    public chat_id?: string;

    @Field()
    public createdAt?: Date;

    @Field()
    public updatedAt?: Date;
}