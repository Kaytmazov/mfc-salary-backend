import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EmployeeOffice {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;
}
