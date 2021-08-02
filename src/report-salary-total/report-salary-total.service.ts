import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReportSalaryTotalArgs } from './dtos/report-salary-total.dto';
import { ReportSalaryTotal } from './entities/report-salary-total.entity';

@Injectable()
export class ReportSalaryTotalService {
  constructor(private readonly prisma: PrismaService) {}

  async getSalaryReport({
    officeId,
    month,
    year,
  }: ReportSalaryTotalArgs): Promise<ReportSalaryTotal[]> {
    try {
      const data = await this.prisma.archive_premium.groupBy({
        by: [
          'spr_employees_id',
          'employees_fio',
          'employees_job_pos_name',
          'type_',
          'period_count_day',
          'employees_stake',
        ],
        where: {
          spr_employees_mfc_id: officeId,
          period_month: month,
          period_year: year,
        },
        _sum: {
          employees_salary: true,
          step_premium: true,
          step_premium_other: true,
          employees_premium: true,
          fine_sum: true,
          employees_premium_total: true,
        },
        orderBy: {
          employees_fio: 'asc',
        },
      });

      if (!data) {
        return [];
      }

      // const data1 = await this.prisma.archive_premium.aggregate({
      //   where: {
      //     spr_employees_mfc_id: 'd802c865-c08f-4ad4-a926-ce770287a47b',
      //     period_month: 12,
      //     period_year: 2020,
      //   },
      //   _sum: {
      //     employees_premium_total: true,
      //   },
      // });

      // const data = await this.prisma.archive_premium.findMany({
      //   where: {
      //     spr_employees_mfc_id: 'd802c865-c08f-4ad4-a926-ce770287a47b',
      //     period_month: 12,
      //     period_year: 2020,
      //   },
      //   select: {
      //     id: true,
      //     spr_employees_id: true,
      //     employees_fio: true,
      //     employees_job_pos_name: true,
      //     type_: true,
      //     period_count_day: true,
      //     employees_salary: true,
      //     employees_stake: true,
      //     step_premium: true,
      //     step_premium_other: true,
      //     employees_premium: true,
      //     fine_sum: true,
      //     employees_premium_total: true,
      //   },
      //   take: 20,
      // });

      const report = data.map(
        ({
          spr_employees_id,
          employees_fio,
          employees_job_pos_name,
          type_,
          period_count_day,
          employees_stake,
          _sum: {
            employees_salary,
            step_premium,
            step_premium_other,
            employees_premium,
            fine_sum,
            employees_premium_total,
          },
        }) => ({
          id: uuid(),
          employeeId: spr_employees_id,
          fio: employees_fio,
          jobPosition: employees_job_pos_name,
          type: type_ === 1 ? 'ОСН' : 'СОВ',
          countDaysPeriod: period_count_day,
          salary: employees_salary,
          rate: employees_stake,
          stepPremium: step_premium,
          stepPremiumOther: step_premium_other,
          premium: employees_premium,
          fineSum: fine_sum,
          premiumTotal: employees_premium_total,
        }),
      );

      return report;
    } catch {
      throw new InternalServerErrorException(
        'Не удалось выполнить запрос. Попробуйте еще раз.',
      );
    }
  }
}
