import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { EditAccountInput, EditAccountOutput } from './dtos/edit-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UserAccountInput, UserAccountOutput } from './dtos/user-account.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => CreateAccountOutput)
  createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
  }

  @Mutation(() => LoginOutput)
  login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Query(() => User)
  @UseGuards(AuthGuard)
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  @Query(() => UserAccountOutput)
  @UseGuards(AuthGuard)
  userAccount(
    @Args() userAccountInput: UserAccountInput,
  ): Promise<UserAccountOutput> {
    return this.usersService.findById(userAccountInput.userId);
  }

  @Mutation(() => EditAccountOutput)
  @UseGuards(AuthGuard)
  editAccount(
    @Args('input') editAccountInput: EditAccountInput,
    @AuthUser() authUser: User,
  ): Promise<EditAccountOutput> {
    return this.usersService.editAccount(authUser.id, editAccountInput);
  }
}
