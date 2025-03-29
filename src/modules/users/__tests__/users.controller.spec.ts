import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { BadRequestException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    updateStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated users with all parameters', async () => {
      const mockResult = {
        users: [
          { id: 1, name: 'User 1' },
          { id: 2, name: 'User 2' },
        ],
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockUsersService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(1, 10, 'search', UserRole.STAFF, UserStatus.ACTIVE);

      expect(service.findAll).toHaveBeenCalledWith(1, 10, 'search', UserRole.STAFF, UserStatus.ACTIVE);
      expect(result).toEqual(mockResult);
    });

    it('should return paginated users with only pagination parameters', async () => {
      const mockResult = {
        users: [
          { id: 1, name: 'User 1' },
          { id: 2, name: 'User 2' },
        ],
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockUsersService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(1, 10);

      expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined, undefined, undefined);
      expect(result).toEqual(mockResult);
    });

    it('should return paginated users with only search parameter', async () => {
      const mockResult = {
        users: [
          { id: 1, name: 'User 1' },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockUsersService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(undefined, undefined, 'search');

      expect(service.findAll).toHaveBeenCalledWith(undefined, undefined, 'search', undefined, undefined);
      expect(result).toEqual(mockResult);
    });

    it('should return paginated users with only role parameter', async () => {
      const mockResult = {
        users: [
          { id: 1, name: 'User 1', role: UserRole.STAFF },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockUsersService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(undefined, undefined, undefined, UserRole.STAFF);

      expect(service.findAll).toHaveBeenCalledWith(undefined, undefined, undefined, UserRole.STAFF, undefined);
      expect(result).toEqual(mockResult);
    });

    it('should return paginated users with only status parameter', async () => {
      const mockResult = {
        users: [
          { id: 1, name: 'User 1', status: UserStatus.ACTIVE },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockUsersService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(undefined, undefined, undefined, undefined, UserStatus.ACTIVE);

      expect(service.findAll).toHaveBeenCalledWith(undefined, undefined, undefined, undefined, UserStatus.ACTIVE);
      expect(result).toEqual(mockResult);
    });

    it('should return empty result when no users found', async () => {
      const mockResult = {
        users: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockUsersService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(1, 10);

      expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined, undefined, undefined);
      expect(result).toEqual(mockResult);
    });

    it('should handle pagination correctly', async () => {
      const mockResult = {
        users: [
          { id: 11, name: 'User 11' },
          { id: 12, name: 'User 12' },
        ],
        total: 12,
        page: 2,
        limit: 10,
        totalPages: 2,
      };

      mockUsersService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(2, 10);

      expect(service.findAll).toHaveBeenCalledWith(2, 10, undefined, undefined, undefined);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockUser = { id: 1, name: 'User 1' };
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'New User',
        email: 'test@example.com',
        phone: '1234567890',
        role: UserRole.STAFF,
        password: 'password123',
      };

      const mockUser = { id: 1, ...createUserDto };
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto);

      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
        phone: '1234567890',
      };

      const mockUser = { id: 1, name: 'Updated Name' };
      mockUsersService.update.mockResolvedValue(mockUser);

      const result = await controller.update('1', updateUserDto);

      expect(service.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const mockResult = { message: 'User deleted successfully' };
      mockUsersService.remove.mockResolvedValue(mockResult);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateStatus', () => {
    it('should update user status with valid status', async () => {
      const mockUser = { id: 1, name: 'User 1', status: UserStatus.INACTIVE };
      mockUsersService.updateStatus.mockResolvedValue(mockUser);

      const result = await controller.updateStatus('1', UserStatus.INACTIVE);

      expect(service.updateStatus).toHaveBeenCalledWith(1, UserStatus.INACTIVE);
      expect(result).toEqual(mockUser);
    });

    it('should throw BadRequestException when status is invalid', async () => {
      try {
        await controller.updateStatus('1', 'INVALID_STATUS' as UserStatus);
        fail('Should have thrown BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Invalid status value');
      }
      expect(service.updateStatus).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when status is not provided', async () => {
      try {
        await controller.updateStatus('1', undefined as unknown as UserStatus);
        fail('Should have thrown BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Invalid status value');
      }
      expect(service.updateStatus).not.toHaveBeenCalled();
    });
  });
}); 