import { Resolver, Query, Args } from '@nestjs/graphql';
import { Role } from 'src/auth/role.decorator';
import { ReportSalaryTotalArgs } from './dtos/report-salary-total.dto';
import { ReportSalaryTotal } from './entities/report-salary-total.entity';
import { ReportSalaryTotalService } from './report-salary-total.service';

@Resolver(() => ReportSalaryTotal)
export class ReportSalaryTotalResolver {
  constructor(
    private readonly reportSalaryTotalService: ReportSalaryTotalService,
  ) {}

  @Query(() => [ReportSalaryTotal])
  @Role(['Any'])
  salaryReport(
    @Args() reportArgs: ReportSalaryTotalArgs,
  ): Promise<ReportSalaryTotal[]> {
    return this.reportSalaryTotalService.getSalaryReport(reportArgs);
  }
}
