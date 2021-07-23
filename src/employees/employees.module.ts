import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { EmployeeRole } from './entities/role.entity';
import { EmployeesResolver } from './employees.resolver';
import { EmployeesService } from './employees.service';
import { EmployeeOffice } from './entities/employee-office.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, EmployeeOffice, EmployeeRole])],
  providers: [EmployeesResolver, EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
