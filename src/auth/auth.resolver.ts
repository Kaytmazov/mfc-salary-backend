import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { Employee } from 'src/employees/entities/employee.entity';
import { AuthUser } from './auth-user.decorator';
import { AuthService } from './auth.service';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { Role } from './role.decorator';

@Resolver(() => Employee)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginOutput)
  login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.authService.login(loginInput);
  }

  @Query(() => Employee)
  @Role(['Any'])
  authUser(@AuthUser() authUser: Employee) {
    return authUser;
  }
}
