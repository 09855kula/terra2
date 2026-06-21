import {Field, InputType} from "@nestjs/graphql";

@InputType ()
export class createUserCommentsInput {
    @Field({ nullable: true })
    public user_id?: number;

    @Field({ nullable: true })
    public text?: string;

    @Field({ nullable: true })
    public role?: string;

    @Field({ nullable: true })
    public image?: string;

}