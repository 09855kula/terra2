import {Field, Int, ObjectType} from "@nestjs/graphql";


@ObjectType()
export class ChangePhoneResponseType {

    @Field({nullable: true})
    public id?: number;

    @Field({nullable: true})
    public phone?: string;

}