import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class createEntrysessionInput {

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

}