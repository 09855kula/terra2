import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class GetSchedulesArgs {
    @Field()
    id: string;
}