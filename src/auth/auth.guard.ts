import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { EmployeesService } from 'src/employees/employees.service';
import { UserRole } from 'src/employees/entities/employee.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { AllowedRoles } from './role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly employeeService: EmployeesService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context).getContext();
    const token = gqlContext.token;

    if (token) {
      const decoded = this.jwtService.verify(token.toString());

      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const employee = await this.employeeService.findById(decoded['id']);

        if (employee) {
          gqlContext['user'] = employee;

          if (roles.includes('Any')) {
            return true;
          }

          return roles.some(
            (it: AllowedRoles): boolean => UserRole[it] === employee.role,
          );
        }
      }
    }

    return false;
  }
}
