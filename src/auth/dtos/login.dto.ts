import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Employee } from 'src/employees/entities/employee.entity';

@InputType()
export class LoginInput extends PickType(Employee, ['login']) {
  @Field()
  @IsNotEmpty()
  password: string;
}

@ObjectType()
export class LoginOutput {
  @Field(() => String)
  token: string;

  @Field(() => Employee)
  user: Employee;
}
