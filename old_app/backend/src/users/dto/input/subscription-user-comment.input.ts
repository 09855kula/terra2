import {Field, InputType} from "@nestjs/graphql";

@InputType ()
export class subscriptionUserCommentInput {

    @Field({ nullable: true })
    public role?: string;

    @Field({ nullable: true })
    public user_id?: number;

    @Field({ nullable: true })
    public text?: string;

    @Field({ nullable: true })
    public created?: string;

    @Field({ nullable: true })
    public image?: string;

    @Field({ nullable: true })
    public isRead?: boolean;


}