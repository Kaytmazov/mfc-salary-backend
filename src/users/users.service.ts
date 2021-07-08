import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { EditAccountInput, EditAccountOutput } from './dtos/edit-account.dto';
import { UserAccountOutput } from './dtos/user-account.dto';

Injectable();
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const exist = await this.users.findOne({ email });
      if (exist) {
        return {
          ok: false,
          error: 'Пользователь с этим email уже зарегистрирован',
        };
      }

      await this.users.save(this.users.create({ email, password, role }));
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: 'Не удалось создать аккаунт',
      };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne(
        { email },
        { select: ['id', 'password'] },
      );
      if (!user) {
        return {
          ok: false,
          error: 'Пользователь не найден',
        };
      }

      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Неправильный пароль',
        };
      }

      const token = this.jwtService.sign(user.id);
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Ошибка авторизации',
      };
    }
  }

  async findById(id: number): Promise<UserAccountOutput> {
    try {
      const user = await this.users.findOneOrFail({ id });

      return {
        ok: true,
        user,
      };
    } catch (e) {
      return {
        ok: false,
        error: 'Пользователь не найден',
      };
    }
  }

  async editAccount(
    userId: number,
    { email, password }: EditAccountInput,
  ): Promise<EditAccountOutput> {
    try {
      const user = await this.users.findOne(userId);

      if (email && email !== user.email) {
        const exist = await this.users.findOne({ email });

        if (exist) {
          return {
            ok: false,
            error: 'Этот email уже занят другим пользователем',
          };
        }

        user.email = email;
      }

      if (password) {
        user.password = password;
      }
      await this.users.save(user);

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Не удалось обновить данные',
      };
    }
  }
}
