import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request, NextFunction } from 'express';
import { EmployeesService } from 'src/employees/employees.service';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly employeeService: EmployeesService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if ('authorization' in req.headers) {
      const token = req.headers['authorization'];
      try {
        const decoded = this.jwtService.verify(token.toString());

        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const employee = await this.employeeService.findById(decoded['id']);

          req['user'] = employee;
        }
      } catch {
        throw new UnauthorizedException();
      }
    }
    next();
  }
}
