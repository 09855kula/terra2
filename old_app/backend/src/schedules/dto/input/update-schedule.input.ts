import {Field, InputType} from "@nestjs/graphql";

@InputType()

export class updateScheduleInput {

    @Field()
    public id?: string;

    @Field()
    public product_sheet?: string;

    @Field()
    public mode?: string;

    @Field()
    public alone?: boolean;

    @Field( () => [String] )
    public drivers?: string[];

}