import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Employee> {
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
                  id: true,
                  mfc_name: true,
                },
              },
              spr_employees_job_pos: {
                select: {
                  job_pos_name: true,
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

      if (!employee) {
        throw new NotFoundException('Сотрудник не найден');
      }

      const [office] = employee.spr_employees_mfc_join;
      const jobPosition = office.spr_employees_job_pos.job_pos_name;
      const [role] = office.spr_employees_role_join;

      return {
        id: employee.id,
        login: employee.employee_login,
        fio: employee.employee_fio,
        office: {
          id: office.spr_employees_mfc.id,
          name: office.spr_employees_mfc.mfc_name,
        },
        jobPosition,
        role: role.spr_employees_role.role_name,
      };
    } catch {
      throw new InternalServerErrorException(
        'Не удалось выполнить запрос. Попробуйте еще раз.',
      );
    }
  }

  async getAllEmployees(): Promise<Employee[]> {
    try {
      const data = await this.prisma.spr_employees.findMany({
        select: {
          id: true,
          employee_login: true,
          employee_fio: true,
        },
      });

      if (!data) {
        return [];
      }

      const employees = data.map(({ id, employee_login, employee_fio }) => ({
        id,
        login: employee_login,
        fio: employee_fio,
      }));

      return employees;
    } catch {
      throw new InternalServerErrorException(
        'Не удалось выполнить запрос. Попробуйте еще раз.',
      );
    }
  }
}
