import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/core';
import { TenantsService } from '../tenants.service';
import { Tenant, TenantStatus } from '../entities/tenant.entity';
import { CreateTenantDto } from '../dto/create-tenant.dto';
import { Room } from '../../rooms/entities/room.entity';
import { NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { RoomStatus } from '../../rooms/enums/room-status.enum';

describe('TenantsService', () => {
  let service: TenantsService;
  let em: EntityManager;

  const mockEntityManager = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    persistAndFlush: jest.fn(),
    removeAndFlush: jest.fn(),
    count: jest.fn(),
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
      providers: [
        TenantsService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<TenantsService>(TenantsService);
    em = module.get<EntityManager>(EntityManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of tenants', async () => {
      const mockTenants = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          status: TenantStatus.ACTIVE,
        },
      ];

      mockEntityManager.find.mockResolvedValue(mockTenants);
      mockEntityManager.count.mockResolvedValue(1);

      const result = await service.findAll(1, 10);

      expect(result.data).toEqual(mockTenants);
      expect(result.meta).toEqual({
        hasMore: false,
        page: 1,
        limit: 10,
      });
      expect(em.find).toHaveBeenCalledWith(Tenant, {}, {
        limit: 10,
        offset: 0,
      });
      expect(em.count).toHaveBeenCalledWith(Tenant, {});
    });

    it('should return filtered tenants when search is provided', async () => {
      const mockTenants = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          status: TenantStatus.ACTIVE,
        },
      ];

      mockEntityManager.find.mockResolvedValue(mockTenants);
      mockEntityManager.count.mockResolvedValue(1);

      const result = await service.findAll(1, 10, 'John');

      expect(result.data).toEqual(mockTenants);
      expect(result.meta).toEqual({
        hasMore: false,
        page: 1,
        limit: 10,
      });
      expect(em.find).toHaveBeenCalledWith(
        Tenant,
        {
          $or: [
            { name: { $like: '%John%' } },
            { email: { $like: '%John%' } },
          ],
        },
        {
          limit: 10,
          offset: 0,
        },
      );
      expect(em.count).toHaveBeenCalledWith(Tenant, {
        $or: [
          { name: { $like: '%John%' } },
          { email: { $like: '%John%' } },
        ],
      });
    });
  });

  describe('findOne', () => {
    it('should return a single tenant', async () => {
      const mockTenant = {
        id: '1',
        name: 'Test Tenant',
        phone: '0123456789',
        email: 'test@example.com',
        status: 'active' as TenantStatus,
      };

      mockEntityManager.findOne.mockResolvedValue(mockTenant);

      const result = await service.findOne('1');

      expect(result).toEqual(mockTenant);
      expect(em.findOne).toHaveBeenCalledWith(Tenant, { id: '1' });
    });

    it('should throw NotFoundException when tenant is not found', async () => {
      mockEntityManager.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
      expect(em.findOne).toHaveBeenCalledWith(Tenant, { id: '1' });
    });
  });

  describe('create', () => {
    it('should create a new tenant', async () => {
      const createTenantDto: CreateTenantDto = {
        name: 'Test Tenant',
        phone: '0123456789',
        email: 'test@example.com',
        identityCard: '123456789',
        dateOfBirth: new Date().toISOString(),
        address: 'Test Address',
      };

      const mockTenant = {
        id: '1',
        ...createTenantDto,
        status: 'active' as TenantStatus,
      };

      mockEntityManager.create.mockReturnValue(mockTenant);
      mockEntityManager.persistAndFlush.mockResolvedValue(undefined);

      const result = await service.create(createTenantDto);

      expect(result).toEqual(mockTenant);
      expect(em.create).toHaveBeenCalledWith(Tenant, {
        ...createTenantDto,
        status: 'active',
      });
      expect(em.persistAndFlush).toHaveBeenCalledWith(mockTenant);
    });
  });

  describe('update', () => {
    it('should update a tenant', async () => {
      const updateTenantDto: Partial<CreateTenantDto> = {
        name: 'Updated Tenant',
      };

      const mockTenant = {
        id: '1',
        name: 'Test Tenant',
        phone: '0123456789',
        email: 'test@example.com',
        status: 'active' as TenantStatus,
      };

      mockEntityManager.findOne.mockResolvedValue(mockTenant);
      mockEntityManager.persistAndFlush.mockResolvedValue(undefined);

      const result = await service.update('1', updateTenantDto);

      expect(result).toEqual({ ...mockTenant, ...updateTenantDto });
      expect(em.findOne).toHaveBeenCalledWith(Tenant, { id: '1' });
      expect(em.persistAndFlush).toHaveBeenCalledWith({
        ...mockTenant,
        ...updateTenantDto,
      });
    });

    it('should throw NotFoundException when tenant is not found', async () => {
      mockEntityManager.findOne.mockResolvedValue(null);

      await expect(service.update('1', { name: 'John' })).rejects.toThrow(NotFoundException);
      expect(em.findOne).toHaveBeenCalledWith(Tenant, { id: '1' });
    });
  });

  describe('remove', () => {
    it('should remove a tenant', async () => {
      const mockTenant = {
        id: '1',
        name: 'Test Tenant',
        phone: '0123456789',
        email: 'test@example.com',
        status: 'active' as TenantStatus,
      };

      mockEntityManager.findOne.mockResolvedValue(mockTenant);
      mockEntityManager.removeAndFlush.mockResolvedValue(undefined);

      await service.remove('1');

      expect(em.findOne).toHaveBeenCalledWith(Tenant, { id: '1' });
      expect(em.removeAndFlush).toHaveBeenCalledWith(mockTenant);
    });

    it('should throw NotFoundException when tenant is not found', async () => {
      mockEntityManager.findOne.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
      expect(em.findOne).toHaveBeenCalledWith(Tenant, { id: '1' });
    });
  });

  describe('updateStatus', () => {
    it('should update tenant status', async () => {
      mockEntityManager.findOne.mockResolvedValue(mockTenant);
      mockEntityManager.persistAndFlush.mockResolvedValue(undefined);

      const result = await service.updateStatus(mockTenant.id, TenantStatus.INACTIVE);

      expect(result.status).toBe(TenantStatus.INACTIVE);
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalledWith(mockTenant);
    });

    it('should throw NotFoundException when updating status of non-existent tenant', async () => {
      mockEntityManager.findOne.mockResolvedValue(null);

      await expect(service.updateStatus('non-existent-id', TenantStatus.INACTIVE)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
}); 