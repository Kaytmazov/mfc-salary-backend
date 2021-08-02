import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsUUID } from 'class-validator';

@ArgsType()
export class ReportSalaryTotalArgs {
  @Field(() => String)
  @IsUUID('4')
  officeId: string;

  @Field(() => Int)
  @IsInt()
  month: number;

  @Field(() => Int)
  @IsInt()
  year: number;
}
