import { Test } from '@Nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findOneOrFail: jest.fn(),
  delete: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(() => 'signed-token'),
  verify: jest.fn(),
});

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UsersService;
  let usersRepository: MockRepository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    usersRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    const createAccountArgs = {
      email: 'altair@list.ru',
      password: '123',
      role: 0,
    };

    it('should fail if user exist', async () => {
      usersRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'altair@list.ru',
      });

      const result = await service.createAccount(createAccountArgs);

      expect(result).toMatchObject({
        ok: false,
        error: 'Пользователь с этим email уже зарегистрирован',
      });
    });

    it('should create a new user', async () => {
      usersRepository.findOne.mockResolvedValue(undefined);
      usersRepository.create.mockReturnValue(createAccountArgs);
      usersRepository.save.mockResolvedValue(createAccountArgs);

      const result = await service.createAccount(createAccountArgs);

      expect(usersRepository.create).toHaveBeenCalledTimes(1);
      expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs);

      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs);

      expect(result).toEqual({ ok: true });
    });

    it('should fail on exception', async () => {
      usersRepository.findOne.mockRejectedValue(new Error());
      const result = await service.createAccount(createAccountArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Не удалось создать аккаунт',
      });
    });
  });

  describe('login', () => {
    const loginArgs = {
      email: 'altair@list.ru',
      password: '123',
    };

    it('should fail if user does not exist', async () => {
      usersRepository.findOne.mockResolvedValue(null);
      const result = await service.login(loginArgs);

      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(usersRepository.findOne).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
      );
      expect(result).toEqual({
        ok: false,
        error: 'Пользователь не найден',
      });
    });

    it('should fail if the password is wrong', async () => {
      usersRepository.findOne.mockResolvedValue({
        checkPassword: jest.fn(() => Promise.resolve(false)),
      });

      const result = await service.login(loginArgs);
      expect(result).toEqual({ ok: false, error: 'Неправильный пароль' });
    });

    it('should return token if password correct', async () => {
      usersRepository.findOne.mockResolvedValue({
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(true)),
      });

      const result = await service.login(loginArgs);

      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith(expect.any(Number));

      expect(result).toEqual({
        ok: true,
        token: 'signed-token',
      });
    });

    it('should fail on exception', async () => {
      usersRepository.findOne.mockRejectedValue(new Error());
      const result = await service.login(loginArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Ошибка авторизации',
      });
    });
  });

  describe('findById', () => {
    const findByIdArgs = {
      id: 1,
    };

    it('should find an existing user', async () => {
      usersRepository.findOneOrFail.mockResolvedValue(findByIdArgs);
      const result = await service.findById(1);
      expect(result).toEqual({ ok: true, user: findByIdArgs });
    });

    it('should fail if no user is found', async () => {
      usersRepository.findOneOrFail.mockRejectedValue(new Error());
      const result = await service.findById(1);
      expect(result).toEqual({
        ok: false,
        error: 'Пользователь не найден',
      });
    });
  });

  describe('editAccount', () => {
    it('should change email', async () => {
      const editAccountArgs = {
        userId: 1,
        input: {
          email: 'newaltair@list.ru',
        },
      };

      const newUser = {
        email: editAccountArgs.input.email,
      };

      usersRepository.findOne
        .mockReturnValueOnce({ email: 'altair@list.ru' })
        .mockReturnValueOnce(undefined);
      usersRepository.save.mockResolvedValue(newUser);

      const result = await service.editAccount(
        editAccountArgs.userId,
        editAccountArgs.input,
      );

      expect(usersRepository.findOne).toHaveBeenCalledTimes(2);
      expect(usersRepository.findOne).toHaveBeenCalledWith(
        editAccountArgs.userId,
      );
      expect(usersRepository.findOne).toHaveBeenCalledWith(
        editAccountArgs.input,
      );

      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(editAccountArgs.input);

      expect(result).toEqual({ ok: true });
    });

    it('should fail if email busy', async () => {
      const editAccountArgs = {
        userId: 1,
        input: {
          email: 'existing@email.ru',
        },
      };

      usersRepository.findOne
        .mockReturnValueOnce({ email: 'altair@list.ru' })
        .mockReturnValueOnce(editAccountArgs.input);

      const result = await service.editAccount(
        editAccountArgs.userId,
        editAccountArgs.input,
      );

      expect(usersRepository.findOne).toHaveBeenCalledTimes(2);
      expect(usersRepository.findOne).toHaveBeenCalledWith(
        editAccountArgs.userId,
      );
      expect(usersRepository.findOne).toHaveBeenCalledWith(
        editAccountArgs.input,
      );

      expect(result).toEqual({
        ok: false,
        error: 'Этот email уже занят другим пользователем',
      });
    });

    it('should change password', async () => {
      const editAccountArgs = {
        userId: 1,
        input: {
          password: 'new-password',
        },
      };

      const newUser = {
        password: editAccountArgs.input.password,
      };

      usersRepository.findOne.mockResolvedValue({ password: 'old-password' });
      usersRepository.save.mockResolvedValue(newUser);

      const result = await service.editAccount(
        editAccountArgs.userId,
        editAccountArgs.input,
      );

      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(usersRepository.findOne).toHaveBeenCalledWith(
        editAccountArgs.userId,
      );

      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(editAccountArgs.input);

      expect(result).toEqual({ ok: true });
    });

    it('should fail on exception', async () => {
      usersRepository.findOne.mockRejectedValue(new Error());
      const result = await service.editAccount(1, { email: 'altair@list.ru' });
      expect(result).toEqual({
        ok: false,
        error: 'Не удалось обновить данные',
      });
    });
  });
});
