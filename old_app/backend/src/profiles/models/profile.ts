import {Field, Int, ObjectType} from "@nestjs/graphql";


@ObjectType()
export class ProfilesType {

    @Field({nullable: true})
    public id?: string;

    @Field({nullable: true})
    public address?: string;

    @Field({nullable: true})
    public district?: string;

    @Field({nullable: true})
    public phone?: string;

    @Field({nullable: true})
    public friend?: string;

    @Field({ nullable: true })
    public user_id?: number;

    @Field({nullable: true})
    public token_id?: number;

    @Field({nullable: true})
    public special_instructions?: string;

    @Field({nullable: true})
    public created?: string;

    @Field({nullable: true})
    public updated?: string;

    @Field({nullable: true})
    public approved?: string;

    @Field({nullable: true})
    public status?: string;

    @Field({nullable: true})
    public comment?: string;
}
