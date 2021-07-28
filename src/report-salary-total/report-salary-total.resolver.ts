import { Resolver, Query, Args } from '@nestjs/graphql';
import { Role } from 'src/auth/role.decorator';
import {
  ReportSalaryTotalInput,
  ReportSalaryTotalOutput,
} from './dtos/report-salary-total.dto';
import { ReportSalaryTotal } from './entities/report-salary-total.entity';
import { ReportSalaryTotalService } from './report-salary-total.service';

@Resolver(() => ReportSalaryTotal)
export class ReportSalaryTotalResolver {
  constructor(
    private readonly reportSalaryTotalService: ReportSalaryTotalService,
  ) {}

  @Query(() => ReportSalaryTotalOutput)
  @Role(['Any'])
  getSalaryReport(
    @Args() reportInput: ReportSalaryTotalInput,
  ): Promise<ReportSalaryTotalOutput> {
    return this.reportSalaryTotalService.getSalaryReport(reportInput);
  }
}
