import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ReportSalaryTotalResolver } from './report-salary-total.resolver';
import { ReportSalaryTotalService } from './report-salary-total.service';

@Module({
  imports: [PrismaModule],
  providers: [ReportSalaryTotalResolver, ReportSalaryTotalService],
})
export class ReportSalaryTotalModule {}
