import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReportSalaryTotalService {
  constructor(private readonly prisma: PrismaService) {}

  async getSalaryReport() {
    try {
      const data = await this.prisma.archive_premium.findMany({
        take: 20,
        select: {
          id: true,
          employees_fio: true,
          employees_job_pos_name: true,
          type_: true,
          period_count_day: true,
          employees_salary: true,
          employees_stake: true,
          step_premium: true,
          step_premium_other: true,
          fine_sum: true,
          employees_premium_total: true,
        },
      });

      const report = data.map(
        ({
          id,
          employees_fio,
          employees_job_pos_name,
          type_,
          period_count_day,
          employees_salary,
          employees_stake,
          step_premium,
          step_premium_other,
          fine_sum,
          employees_premium_total,
        }) => ({
          id,
          fio: employees_fio,
          jobPosition: employees_job_pos_name,
          type: type_,
          countDaysPeriod: period_count_day,
          salary: employees_salary,
          rate: employees_stake,
          stepPremium: step_premium,
          stepPremiumOther: step_premium_other,
          fineSum: fine_sum,
          premiumTotal: employees_premium_total,
        }),
      );

      return {
        ok: true,
        data: report,
      };
    } catch {
      return {
        ok: false,
        return: 'Не удалось выполнить поиск',
      };
    }
  }
}
