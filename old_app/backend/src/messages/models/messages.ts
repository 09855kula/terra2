import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType()
export class MessagesType {

    @Field({nullable: true})
    public message_id?: string;

    @Field({nullable: true})
    public chat_id?: string;

    @Field({nullable: true})
    public createdAt?: Date;

    @Field({nullable: true})
    public updatedAt?: Date;
}