import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User, UserRole } from './user.domain';
import { PasswordHasher } from '../util/password-hasher';
import { UserRepositoryAdapter } from './user.repository-adapter';
import { UserModule } from './user.module';

describe('UserService', () => {
  const userRepositoryAdapterMock = {
    save: jest.fn(),
    getByUsername: jest.fn(),
    getById: jest.fn(),
  };

  const passwordHasherMock = {
    hash: jest.fn(),
    check: jest.fn(),
  };

  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PasswordHasher,
          useValue: passwordHasherMock,
        },
        {
          provide: UserRepositoryAdapter,
          useValue: userRepositoryAdapterMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    Object.values(userRepositoryAdapterMock).forEach((mock) =>
      mock.mockReset(),
    );
    Object.values(passwordHasherMock).forEach((mock) => mock.mockReset());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user from data', async () => {
    const user = await service.createUser({
      username: 'username',
      password: 'password',
      role: UserRole.ADMIN,
    });

    expect(user).toBeInstanceOf(User);
  });

  it('should create user with GUEST role if its not provided', async () => {
    const user = await service.createUser({
      username: 'username',
      password: 'password',
    });

    expect(user.role).toBe(UserRole.GUEST);
  });

  it('should get user by credentials', async () => {
    userRepositoryAdapterMock.getByUsername.mockResolvedValueOnce(
      new User({
        id: 'id',
        username: 'username',
        password: 'password',
        role: UserRole.GUEST,
      }),
    );
    passwordHasherMock.check.mockResolvedValueOnce(true);

    const user = await service.getUserByCredentials({
      username: 'username',
      password: 'password',
    });
    expect(user).toBeInstanceOf(User);
  });

  it('should not get user by wrong credentials', async () => {
    userRepositoryAdapterMock.getByUsername.mockResolvedValueOnce(
      new User({
        id: 'id',
        username: 'username',
        password: 'password',
        role: UserRole.GUEST,
      }),
    );
    passwordHasherMock.check.mockResolvedValueOnce(false);

    await expect(async () => {
      const user = await service.getUserByCredentials({
        username: 'username',
        password: 'wrongpassword',
      });
      expect(user).toBeInstanceOf(User);
    }).rejects.toBeInstanceOf(UserModule.Exception.UserNotFound);
  });

  it('should get user by id', async () => {
    userRepositoryAdapterMock.getById.mockResolvedValueOnce(
      new User({
        id: 'id',
        username: 'username',
        password: 'password',
        role: UserRole.GUEST,
      }),
    );
    const user = await service.getUserById('id');
    expect(user).toBeInstanceOf(User);
  });
});
