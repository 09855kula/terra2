import {Field, ObjectType} from "@nestjs/graphql";


@ObjectType()
export class RoutesResponseFromDistrictsType {

    @Field({nullable: true})
    public timeslot?: string;

    @Field({nullable: true})
    public weekday?: string;

    @Field({nullable: true})
    public cutOff?: string;


}