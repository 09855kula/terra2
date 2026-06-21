import {Field, Int, ObjectType} from '@nestjs/graphql';
import {IsArray, IsObject} from "class-validator";



@ObjectType()
class CutOffsType {
    @Field({ nullable: true })
    Monday?: string;

    @Field({ nullable: true })
    Tuesday?: string;

    @Field({ nullable: true })
    Wednesday?: string;

    @Field({ nullable: true })
    Thursday?: string;

    @Field({ nullable: true })
    Friday?: string;

    @Field({ nullable: true })
    Saturday?: string;

    @Field({ nullable: true })
    Sunday?: string;
}

@ObjectType()
class PointType {

    @Field(()=>Int, { nullable: true })
    index?: number;

    @Field({ nullable: true })
    district?: string;

    @Field({ nullable: true })
    timeslot?: string;

    @Field({ nullable: true })
    weekday?: string;
}
@ObjectType()
export class RouteType {
    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    id?: string;

    @Field({ nullable: true })
    cut_offs?: CutOffsType;

    @Field(() => CutOffsType, { nullable: true })
    @IsObject()
    public cut_offs_2?: CutOffsType;

    @Field(() => [PointType], { nullable: 'items' })
    @IsArray()
    points?: PointType[];
}