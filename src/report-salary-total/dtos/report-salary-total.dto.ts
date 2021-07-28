import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { IsInt, IsUUID } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { ReportSalaryTotal } from '../entities/report-salary-total.entity';

@ArgsType()
export class ReportSalaryTotalInput {
  @Field(() => String)
  @IsUUID('4')
  officeId: string;

  @Field(() => Number)
  @IsInt()
  month: number;

  @Field(() => Number)
  @IsInt()
  year: number;
}

@ObjectType()
export class ReportSalaryTotalOutput extends CoreOutput {
  @Field(() => [ReportSalaryTotal], { nullable: true })
  data?: ReportSalaryTotal[];
}
