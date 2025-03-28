import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users.service';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockRepository = {
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const mockUsers = [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' },
      ];
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockUsers, 2]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({
        users: mockUsers,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockUser = { id: 1, name: 'User 1' };
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
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

      const hashedPassword = 'hashedPassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const expectedUser = { ...createUserDto, password: hashedPassword };
      mockRepository.create.mockReturnValue(expectedUser);
      mockRepository.save.mockResolvedValue(expectedUser);

      const result = await service.create(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockRepository.create).toHaveBeenCalledWith(expectedUser);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedUser);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('update', () => {
    it('should update a user with password', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
        password: 'newPassword',
      };

      const mockUser = {
        id: 1,
        name: 'Old Name',
        password: 'oldHashedPassword',
      };

      const hashedPassword = 'hashedNewPassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue({
        ...mockUser,
        name: updateUserDto.name,
        password: hashedPassword,
      });

      const result = await service.update(1, updateUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...mockUser,
        name: updateUserDto.name,
        password: hashedPassword,
      });
      expect(result).toEqual({
        ...mockUser,
        name: updateUserDto.name,
        password: hashedPassword,
      });
    });

    it('should update a user without password', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };

      const mockUser = {
        id: 1,
        name: 'Old Name',
        password: 'oldHashedPassword',
      };

      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue({
        ...mockUser,
        name: updateUserDto.name,
      });

      const result = await service.update(1, updateUserDto);

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...mockUser,
        name: updateUserDto.name,
      });
      expect(result).toEqual({
        ...mockUser,
        name: updateUserDto.name,
      });
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const mockUser = { id: 1, name: 'User 1' };
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.remove(1);

      expect(mockRepository.remove).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ message: 'User deleted successfully' });
    });
  });

  describe('updateStatus', () => {
    it('should update user status', async () => {
      const mockUser = { id: 1, name: 'User 1', status: UserStatus.ACTIVE };
      mockRepository.findOne.mockResolvedValue(mockUser);

      const updatedUser = { ...mockUser, status: UserStatus.INACTIVE };
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateStatus(1, UserStatus.INACTIVE);

      expect(mockRepository.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual(updatedUser);
    });
  });
}); 