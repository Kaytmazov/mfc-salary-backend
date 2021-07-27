import { Resolver, Query } from '@nestjs/graphql';
import { Role } from 'src/auth/role.decorator';
import { ReportSalaryTotalOutput } from './dtos/report-salary-total.dto';
import { ReportSalaryTotal } from './entities/report-salary-total.entity';
import { ReportSalaryTotalService } from './report-salary-total.service';

@Resolver(() => ReportSalaryTotal)
export class ReportSalaryTotalResolver {
  constructor(
    private readonly reportSalaryTotalService: ReportSalaryTotalService,
  ) {}

  @Query(() => ReportSalaryTotalOutput)
  @Role(['Any'])
  getSalaryReport() {
    return this.reportSalaryTotalService.getSalaryReport();
  }
}
