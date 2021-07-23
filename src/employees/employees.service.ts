import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import { AllEmployeesOutput } from './dtos/all-employees.dto';
import { EmployeeOutput } from './dtos/employee.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { EmployeeOffice } from './entities/employee-office.entity';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employees: Repository<Employee>,
    @InjectRepository(EmployeeOffice)
    private readonly employeeOffice: Repository<EmployeeOffice>,
    private readonly jwtService: JwtService,
  ) {}

  async login({ login, password }: LoginInput): Promise<LoginOutput> {
    try {
      const employee = await this.employees.findOne(
        { login },
        { select: ['id', 'fio', 'login', 'password'] },
      );

      if (!employee) {
        return {
          ok: false,
          error: 'Пользователь не найден',
        };
      }

      const passwordCorrect = await employee.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Неправильный пароль',
        };
      }

      const token = this.jwtService.sign(employee);
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

  async findById(id: string): Promise<EmployeeOutput> {
    try {
      const employee = await this.employees.findOneOrFail(id, {
        relations: ['offices', 'roles'],
      });

      return {
        ok: true,
        employee,
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
      const employees = await this.employees.find();
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

  // getOffice() {
  //   return this.employeeOffice.findOne({
  //     id: 'db428997-6d77-4b22-a5ac-bc0d1d5b9fa2',
  //   });
  // }
}
