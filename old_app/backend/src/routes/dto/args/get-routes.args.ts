import {Field, InputType} from '@nestjs/graphql';

@InputType()
export class GetRoutesArgs {

  @Field()
  public id?: string;


}
