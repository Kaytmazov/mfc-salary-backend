import { Injectable } from '@nestjs/common';
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

  validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    // временно
    return new Promise((resolve) => resolve(true));
    // return compare(password, hashedPassword);
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
          employee_fio: true,
          employee_login: true,
          employee_pass: true,
        },
      });

      if (!employee) {
        return {
          ok: false,
          error: 'Пользователь не найден',
        };
      }

      const passwordValid = await this.validatePassword(
        password,
        employee.employee_pass,
      );
      if (!passwordValid) {
        return {
          ok: false,
          error: 'Неверная комбинация логина и пароля',
        };
      }

      const token = this.jwtService.sign({
        id: employee.id,
        fio: employee.employee_fio,
        login: employee.employee_login,
      });

      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Ошибка авторизации',
      };
    }
  }
}
