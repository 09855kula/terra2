import {Field, InputType, Int} from '@nestjs/graphql';
import {IsArray, IsObject} from "class-validator";



@InputType()
class CreateCutOffsInput {
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

@InputType()
class CreatePointInput {

    @Field(()=>Int, { nullable: true })
    index?: number;

    @Field({ nullable: true })
    district?: string;

    @Field({ nullable: true })
    timeslot?: string;

    @Field({ nullable: true })
    weekday?: string;
}
@InputType()
export class createRouteInput {
    @Field({ nullable: true })
    name?: string;


    @Field({ nullable: true })
    id?: string;

    @Field({ nullable: true })
    cut_offs?: CreateCutOffsInput;

    @Field(() => CreateCutOffsInput, { nullable: true })
    @IsObject()
    public cut_offs_2?: CreateCutOffsInput;

    @Field(() => [CreatePointInput], { nullable: 'items' })
    @IsArray()
    points?: CreatePointInput[];
}



