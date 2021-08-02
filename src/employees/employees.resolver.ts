import { Args, Query, Resolver } from '@nestjs/graphql';
import { Role } from 'src/auth/role.decorator';
import { Employee } from './entities/employee.entity';
import { EmployeesService } from './employees.service';
import { EmployeeArgs } from './dtos/employee.dto';

@Resolver(() => Employee)
export class EmployeesResolver {
  constructor(private readonly employeesService: EmployeesService) {}

  @Query(() => Employee)
  @Role(['Any'])
  employee(@Args() { employeeId }: EmployeeArgs): Promise<Employee> {
    return this.employeesService.findById(employeeId);
  }

  @Query(() => [Employee])
  @Role(['Any'])
  allEmployees(): Promise<Employee[]> {
    return this.employeesService.getAllEmployees();
  }
}
