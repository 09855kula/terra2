import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class GetProfilesArgs {
    @Field()
    id: string;
}