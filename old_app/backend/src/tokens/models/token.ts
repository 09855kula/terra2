import {Field, ObjectType} from "@nestjs/graphql";


@ObjectType()
class CommentsTokenType  {

    @Field({nullable: true})
    public user_id?: number;

    @Field({nullable: true})
    public text?: string;

    @Field({nullable: true})
    public created?: string;
}

@ObjectType()
export class TokenType {

    @Field({nullable: true})
    public owner_tg_user_id?: number;

    @Field({nullable: true})
    public id?: string;

    @Field({nullable: true})
    public code?: string;

    @Field( () => CommentsTokenType,     {nullable: true})
    public comments?: CommentsTokenType[];

    @Field({nullable: true})
    public created?: Date;

    @Field({nullable: true})
    public updated?: Date;

    @Field({nullable: true})
    public approved?: Date;

    @Field({nullable: true})
    public role?: string;

    @Field({nullable: true})
    public status?: string;

    @Field({nullable: true})
    public profile?: number;

    @Field( ()=> Number,{nullable: true})
    public referral_tg_users_ids?: number[];
}