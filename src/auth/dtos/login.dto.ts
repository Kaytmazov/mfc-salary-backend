import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Employee } from 'src/employees/entities/employee.entity';

@InputType()
export class LoginInput extends PickType(Employee, ['login']) {
  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

@ObjectType()
export class LoginOutput extends CoreOutput {
  @Field(() => String, { nullable: true })
  token?: string;
}
