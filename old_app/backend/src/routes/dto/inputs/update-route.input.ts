import {Field, InputType} from '@nestjs/graphql';

@InputType()
export class updateRouteInput {

    @Field()
    public name?: string;

    @Field()
    public id?: string;

}