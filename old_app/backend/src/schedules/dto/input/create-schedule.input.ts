import {Field, InputType} from "@nestjs/graphql";


@InputType()
export class createSchedulesInput {

    @Field({ nullable: true })
    public id?: string;

    @Field({ nullable: true })
    public product_sheet?: string;

    @Field({ nullable: true })
    public mode?: string;

    @Field({ nullable: true })
    public alone?: boolean;

    @Field( () => [String] )
    public drivers?: string[];

}