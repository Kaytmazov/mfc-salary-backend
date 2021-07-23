import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Employee } from '../entities/employee.entity';

@ObjectType()
export class AllEmployeesOutput extends CoreOutput {
  @Field(() => [Employee], { nullable: true })
  employees?: Employee[];
}
