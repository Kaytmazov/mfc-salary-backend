import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { JwtService } from 'src/jwt/jwt.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginInput, LoginOutput } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  validatePassword(password: string, hashedPassword: string) {
    // временно
    // const passwordValid = compare(password, hashedPassword);
    const passwordValid = true;

    if (!passwordValid) {
      throw new BadRequestException('Неверная комбинация логина и пароля');
    }
  }

  hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }

  async login({ login, password }: LoginInput): Promise<LoginOutput> {
    try {
      const employee = await this.prisma.spr_employees.findUnique({
        where: { employee_login: login },
        select: {
          id: true,
          employee_login: true,
          employee_pass: true,
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
        throw new NotFoundException('Пользователь не найден');
      }

      this.validatePassword(password, employee.employee_pass);

      const [office] = employee.spr_employees_mfc_join;
      const jobPosition = office.spr_employees_job_pos.job_pos_name;
      const [role] = office.spr_employees_role_join;

      const token = this.jwtService.sign({
        id: employee.id,
      });

      return {
        token,
        user: {
          id: employee.id,
          login: employee.employee_login,
          fio: employee.employee_fio,
          office: {
            id: office.spr_employees_mfc.id,
            name: office.spr_employees_mfc.mfc_name,
          },
          jobPosition,
          role: role.spr_employees_role.role_name,
        },
      };
    } catch {
      throw new InternalServerErrorException(
        'Не удалось выполнить запрос. Попробуйте еще раз.',
      );
    }
  }
}
