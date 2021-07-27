import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Employee } from 'src/employees/entities/employee.entity';
import { AuthService } from './auth.service';
import { LoginInput, LoginOutput } from './dtos/login.dto';

@Resolver(() => Employee)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginOutput)
  login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.authService.login(loginInput);
  }
}
