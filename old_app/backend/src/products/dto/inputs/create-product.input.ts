import {Field, ID, InputType} from '@nestjs/graphql';

@InputType ()
export class createProductInput {

  @Field({ nullable: true })
  readonly active: boolean;

  @Field({ nullable: true })
  readonly name: string;

  @Field({ nullable: true })
  readonly description: string;

  @Field({ nullable: true })
  readonly img_url: string;

  @Field({ nullable: true })
  readonly category: string;

  @Field({ nullable: true })
  readonly hit?: boolean;

  @Field(() => ID, { nullable: true })
  id: string;
}


