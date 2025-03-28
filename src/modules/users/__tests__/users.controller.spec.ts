import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRole, UserStatus } from '../entities/user.entity';

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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
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
    it('should update user status', async () => {
      const mockUser = { id: 1, name: 'User 1', status: UserStatus.INACTIVE };
      mockUsersService.updateStatus.mockResolvedValue(mockUser);

      const result = await controller.updateStatus('1', UserStatus.INACTIVE);

      expect(service.updateStatus).toHaveBeenCalledWith(1, UserStatus.INACTIVE);
      expect(result).toEqual(mockUser);
    });
  });
}); 