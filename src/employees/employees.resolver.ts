import { Args, Query, Resolver } from '@nestjs/graphql';
import { Role } from 'src/auth/role.decorator';
import { AllEmployeesOutput } from './dtos/all-employees.dto';
import { Employee } from './entities/employee.entity';
import { EmployeesService } from './employees.service';
import { EmployeeInput, EmployeeOutput } from './dtos/employee.dto';

@Resolver(() => Employee)
export class EmployeesResolver {
  constructor(private readonly employeesService: EmployeesService) {}

  @Query(() => EmployeeOutput)
  @Role(['Any'])
  employee(@Args() employeeInput: EmployeeInput): Promise<EmployeeOutput> {
    return this.employeesService.findById(employeeInput.userId);
  }

  @Query(() => AllEmployeesOutput)
  @Role(['Any'])
  allEmployees(): Promise<AllEmployeesOutput> {
    return this.employeesService.allEmployees();
  }
}
