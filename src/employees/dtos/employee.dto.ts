import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class EmployeeArgs {
  @Field(() => String)
  employeeId: string;
}
