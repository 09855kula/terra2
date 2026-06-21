import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class updateEntrysessionInput {

    @Field({ nullable: true })
    public entry_id?: string;

    @Field({ nullable: true })
    public platform_id?: string;

    @Field({ nullable: true })
    public user_id?: string;

}