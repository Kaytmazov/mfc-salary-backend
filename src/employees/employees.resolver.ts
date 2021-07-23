import { Args, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Role } from 'src/auth/role.decorator';
import { AllEmployeesOutput } from './dtos/all-employees.dto';
import { Employee } from './entities/employee.entity';
import { EmployeesService } from './employees.service';
import { EmployeeInput, EmployeeOutput } from './dtos/employee.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { EmployeeOffice } from './entities/employee-office.entity';

@Resolver(() => Employee)
export class EmployeesResolver {
  constructor(private readonly employeesService: EmployeesService) {}

  // @ResolveField(() => EmployeeOffice)
  // office(): Promise<EmployeeOffice> {
  //   return this.employeesService.getOffice();
  // }

  @Mutation(() => LoginOutput)
  login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.employeesService.login(loginInput);
  }

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
