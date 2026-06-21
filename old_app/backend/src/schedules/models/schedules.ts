import {Field, ObjectType} from "@nestjs/graphql";


@ObjectType()
export class SchedulesType {

    @Field({nullable: true})
    public id?: string;

    @Field({nullable: true})
    public product_sheet?: string;

    @Field({nullable: true})
    public mode?: string;

    @Field({nullable: true})
    public alone?: boolean;

    @Field( () => [String] )
    public drivers?: string[];

}