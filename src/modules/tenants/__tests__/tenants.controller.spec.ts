import { Test, TestingModule } from '@nestjs/testing';
import { TenantsController } from '../tenants.controller';
import { TenantsService } from '../tenants.service';
import { Tenant, TenantStatus } from '../entities/tenant.entity';
import { CreateTenantDto } from '../dto/create-tenant.dto';
import { RoomStatus } from '../../rooms/enums/room-status.enum';
import { v4 as uuidv4 } from 'uuid';

describe('TenantsController', () => {
  let controller: TenantsController;
  let service: TenantsService;

  const mockTenantsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    updateStatus: jest.fn(),
  };

  const mockTenant: Tenant = {
    id: uuidv4(),
    name: 'Test Tenant',
    phone: '0123456789',
    email: 'test@example.com',
    identityCard: '123456789',
    dateOfBirth: new Date(),
    address: 'Test Address',
    startDate: new Date(),
    endDate: new Date(),
    room: {
      id: uuidv4(),
      name: 'Test Room',
      type: 'Standard',
      floor: 1,
      area: 20,
      price: 1000,
      status: RoomStatus.VACANT,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    status: TenantStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantsController],
      providers: [
        {
          provide: TenantsService,
          useValue: mockTenantsService,
        },
      ],
    }).compile();

    controller = module.get<TenantsController>(TenantsController);
    service = module.get<TenantsService>(TenantsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of tenants', async () => {
      const mockTenants = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '0123456789',
        },
      ];

      mockTenantsService.findAll.mockResolvedValue({
        data: mockTenants,
        meta: {
          hasMore: false,
          page: 1,
          limit: 10,
        },
      });

      const result = await controller.findAll(1, 10);

      expect(result).toEqual({
        data: mockTenants,
        meta: {
          hasMore: false,
          page: 1,
          limit: 10,
        },
      });
      expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined);
    });

    it('should return filtered tenants when search is provided', async () => {
      const mockTenants = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '0123456789',
        },
      ];

      mockTenantsService.findAll.mockResolvedValue({
        data: mockTenants,
        meta: {
          hasMore: false,
          page: 1,
          limit: 10,
        },
      });

      const result = await controller.findAll(1, 10, 'John');

      expect(result).toEqual({
        data: mockTenants,
        meta: {
          hasMore: false,
          page: 1,
          limit: 10,
        },
      });
      expect(service.findAll).toHaveBeenCalledWith(1, 10, 'John');
    });
  });

  describe('findOne', () => {
    it('should return a single tenant', async () => {
      const mockTenant = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '0123456789',
      };

      mockTenantsService.findOne.mockResolvedValue(mockTenant);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockTenant);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new tenant', async () => {
      const createTenantDto = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '0123456789',
      };

      const mockTenant = {
        id: '1',
        ...createTenantDto,
      };

      mockTenantsService.create.mockResolvedValue(mockTenant);

      const result = await controller.create(createTenantDto);

      expect(result).toEqual(mockTenant);
      expect(service.create).toHaveBeenCalledWith(createTenantDto);
    });
  });

  describe('update', () => {
    it('should update a tenant', async () => {
      const updateTenantDto = {
        name: 'John Doe Updated',
      };

      const mockTenant = {
        id: '1',
        name: 'John Doe Updated',
        email: 'john@example.com',
        phone: '0123456789',
      };

      mockTenantsService.update.mockResolvedValue(mockTenant);

      const result = await controller.update('1', updateTenantDto);

      expect(result).toEqual(mockTenant);
      expect(service.update).toHaveBeenCalledWith('1', updateTenantDto);
    });
  });

  describe('remove', () => {
    it('should remove a tenant', async () => {
      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });

  describe('updateStatus', () => {
    it('should update tenant status', async () => {
      const mockTenant = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '0123456789',
        status: TenantStatus.ACTIVE,
      };

      mockTenantsService.updateStatus.mockResolvedValue(mockTenant);

      const result = await controller.updateStatus('1', TenantStatus.ACTIVE);

      expect(result).toEqual(mockTenant);
      expect(service.updateStatus).toHaveBeenCalledWith('1', TenantStatus.ACTIVE);
    });
  });
}); 