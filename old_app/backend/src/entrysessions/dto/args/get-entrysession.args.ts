import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class GetEntrysessionArgs {

    @Field({ nullable: true })
    public entry_id?: string;

    @Field({ nullable: true })
    public platform_id?: string;

    @Field({ nullable: true })
    public user_id?: string;

}