import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Employee } from '../entities/employee.entity';

@ArgsType()
export class EmployeeInput {
  @Field(() => String)
  userId: string;
}

@ObjectType()
export class EmployeeOutput extends CoreOutput {
  @Field(() => Employee, { nullable: true })
  employee?: Employee;
}
