import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EmployeesResolver } from './employees.resolver';
import { EmployeesService } from './employees.service';

@Module({
  imports: [PrismaModule],
  providers: [EmployeesResolver, EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
