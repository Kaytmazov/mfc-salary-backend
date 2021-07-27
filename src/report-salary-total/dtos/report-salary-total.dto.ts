import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { ReportSalaryTotal } from '../entities/report-salary-total.entity';

@ObjectType()
export class ReportSalaryTotalOutput extends CoreOutput {
  @Field(() => [ReportSalaryTotal], { nullable: true })
  data?: ReportSalaryTotal[];
}
