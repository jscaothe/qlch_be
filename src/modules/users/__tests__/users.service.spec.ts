import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectRepository, getRepositoryToken } from '@mikro-orm/nestjs';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let entityManager: EntityManager;
  let userRepository: EntityRepository<User>;

  const mockEntityManager = {
    find: jest.fn(),
    findOne: jest.fn(),
    persistAndFlush: jest.fn(),
    flush: jest.fn(),
    removeAndFlush: jest.fn(),
  };

  const mockUserRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    entityManager = module.get<EntityManager>(EntityManager);
    userRepository = module.get<EntityRepository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        role: UserRole.STAFF,
        status: UserStatus.ACTIVE,
      };

      const expectedUser = {
        id: 1,
        ...createUserDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.create.mockReturnValue(expectedUser);
      mockEntityManager.persistAndFlush.mockResolvedValue(undefined);

      const result = await service.create(createUserDto);

      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalled();
    });

    it('should throw BadRequestException when email already exists', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        password: 'password123',
      };

      mockUserRepository.findOne.mockResolvedValue({ id: 1, email: createUserDto.email });

      await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const expectedUsers = [
        {
          id: 1,
          name: 'User One',
          email: 'user1@example.com',
          phone: '1234567890',
          role: UserRole.STAFF,
          status: UserStatus.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'User Two',
          email: 'user2@example.com',
          phone: '987654321',
          role: UserRole.ADMIN,
          status: UserStatus.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockUserRepository.findAndCount.mockResolvedValue([expectedUsers, 2]);

      const result = await service.findAll();

      expect(result.users).toEqual(expectedUsers);
      expect(result.total).toBe(2);
      expect(mockUserRepository.findAndCount).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = 1;
      const expectedUser = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        role: UserRole.STAFF,
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findOne.mockResolvedValue(expectedUser);

      const result = await service.findOne(userId);

      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.findOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
        phone: '987654321',
      };

      const existingUser = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        role: UserRole.STAFF,
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findOne.mockResolvedValue(existingUser);
      mockEntityManager.flush.mockResolvedValue(undefined);

      const result = await service.update(userId, updateUserDto);

      expect(result.name).toBe(updateUserDto.name);
      expect(result.phone).toBe(updateUserDto.phone);
      expect(mockUserRepository.findOne).toHaveBeenCalled();
      expect(mockEntityManager.flush).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user not found', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
        phone: '987654321',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = 1;
      const userToRemove = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        role: UserRole.STAFF,
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findOne.mockResolvedValue(userToRemove);
      mockEntityManager.removeAndFlush.mockResolvedValue(undefined);

      await service.remove(userId);

      expect(mockUserRepository.findOne).toHaveBeenCalled();
      expect(mockEntityManager.removeAndFlush).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('should update user status', async () => {
      const user = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
      };

      mockUserRepository.findOne.mockResolvedValue(user);
      mockEntityManager.flush.mockResolvedValue(undefined);

      const result = await service.updateStatus(1, UserStatus.INACTIVE);
      expect(result).toEqual({
        ...user,
        status: UserStatus.INACTIVE,
      });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: 1 });
      expect(mockEntityManager.flush).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.updateStatus(1, UserStatus.INACTIVE)).rejects.toThrow(NotFoundException);
    });
  });
}); 