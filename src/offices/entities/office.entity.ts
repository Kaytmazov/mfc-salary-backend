import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Office {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;
}
