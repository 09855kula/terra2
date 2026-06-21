import {Field, InputType} from "@nestjs/graphql";


@InputType()
class CreateCommentsTokenInput  {

    @Field({nullable: true})
    public user_id?: number;

    @Field({nullable: true})
    public text?: string;

    @Field({nullable: true})
    public created?: string;
}

@InputType()
export class createTokenInput {

    @Field({nullable: true})
    public owner_tg_user_id?: number;

    @Field({nullable: true})
    public id?: string;

    @Field({nullable: true})
    public code?: string;

    @Field( () => CreateCommentsTokenInput,     {nullable: true})
    public comments?: CreateCommentsTokenInput[];

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