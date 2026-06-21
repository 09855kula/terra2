import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType()
export class DataType {

    @Field({nullable: true})
    public last_message_from_side?: string;

    @Field({nullable: true})
    public phone?: string;

    @Field({nullable: true})
    public last_message_id?: string;

    @Field({nullable: true})
    public current_group?: string;

    @Field({nullable: true})
    public current_category?: string;

    @Field({nullable: true})
    public notified_about_freebie?: number;

    @Field({nullable: true})
    public current_order?: number;

    @Field({nullable: true})
    public profile_for_route?: string;

    @Field({nullable: true})
    public profile_address?: string;

    @Field({nullable: true})
    public profile_phone?: string;

    @Field({nullable: true})
    public profile_instructions?: string;

    @Field({nullable: true})
    public current_profile?: number;
}

@ObjectType()
export class EntrysessionsType {

    @Field({ nullable: true })
    public entry_id?: string;

    @Field({ nullable: true })
    public platform_id?: string;

    @Field({ nullable: true })
    public user_id?: string;

    @Field({ nullable: true })
    public state_id?: string;

    @Field({ nullable: true })
    public lang?: string;

    @Field({ nullable: true })
    public data?: DataType;

    @Field({ nullable: true })
    public created_at?: Date;

    @Field({ nullable: true })
    public updated_at?: Date;

}