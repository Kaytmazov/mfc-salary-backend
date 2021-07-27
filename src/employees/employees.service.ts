import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AllEmployeesOutput } from './dtos/all-employees.dto';
import { EmployeeOutput } from './dtos/employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<EmployeeOutput> {
    try {
      const employee = await this.prisma.spr_employees.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          employee_login: true,
          employee_fio: true,
          spr_employees_mfc_join: {
            orderBy: { set_date: 'desc' },
            select: {
              spr_employees_mfc: {
                select: {
                  mfc_name: true,
                },
              },
              spr_employees_role_join: {
                orderBy: { set_date: 'desc' },
                select: {
                  spr_employees_role: {
                    select: {
                      role_name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const [office] = employee.spr_employees_mfc_join;
      const [role] = office.spr_employees_role_join;

      return {
        ok: true,
        employee: {
          id: employee.id,
          login: employee.employee_login,
          fio: employee.employee_fio,
          office: office.spr_employees_mfc.mfc_name,
          role: role.spr_employees_role.role_name,
        },
      };
    } catch (e) {
      return {
        ok: false,
        error: 'Пользователь не найден',
      };
    }
  }

  async allEmployees(): Promise<AllEmployeesOutput> {
    try {
      const data = await this.prisma.spr_employees.findMany({
        select: {
          id: true,
          employee_login: true,
          employee_fio: true,
        },
      });

      const employees = data.map(({ id, employee_login, employee_fio }) => ({
        id,
        login: employee_login,
        fio: employee_fio,
      }));

      return {
        ok: true,
        employees,
      };
    } catch (e) {
      return {
        ok: false,
        error: 'Не удалось выполнить поиск',
      };
    }
  }
}
