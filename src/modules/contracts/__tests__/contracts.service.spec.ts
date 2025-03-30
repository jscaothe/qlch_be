import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/core';
import { ContractsService } from '../contracts.service';
import { Contract } from '../entities/contract.entity';
import { ContractStatus } from '../enums/contract-status.enum';
import { CreateContractDto } from '../dto/create-contract.dto';
import { RenewContractDto } from '../dto/renew-contract.dto';
import { TerminateContractDto } from '../dto/terminate-contract.dto';
import { NotFoundException } from '@nestjs/common';
import { RoomStatus } from '../../rooms/enums/room-status.enum';
import { v4 as uuidv4 } from 'uuid';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { Room } from '../../rooms/entities/room.entity';
import { TenantStatus } from '../../tenants/entities/tenant.entity';

describe('ContractsService', () => {
  let service: ContractsService;
  let em: EntityManager;

  const mockEntityManager = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    persistAndFlush: jest.fn(),
    removeAndFlush: jest.fn(),
    count: jest.fn(),
  };

  const mockContract: Contract = {
    id: uuidv4(),
    tenant: {
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
        roomType: {
          id: '1',
          name: 'Standard',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
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
    },
    room: {
      id: uuidv4(),
      name: 'Test Room',
      roomType: {
        id: '1',
        name: 'Standard',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      floor: 1,
      area: 20,
      price: 1000,
      status: RoomStatus.VACANT,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    startDate: new Date(),
    endDate: new Date(),
    deposit: 1000,
    monthlyRent: 500,
    terms: ['Term 1', 'Term 2'],
    status: ContractStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractsService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<ContractsService>(ContractsService);
    em = module.get<EntityManager>(EntityManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of contracts', async () => {
      const mockContracts = [
        {
          id: uuidv4(),
          tenantId: uuidv4(),
          roomId: uuidv4(),
          startDate: new Date(),
          endDate: new Date(),
          deposit: 1000,
          monthlyRent: 500,
          status: ContractStatus.ACTIVE,
        },
      ];

      mockEntityManager.find.mockResolvedValue(mockContracts);
      mockEntityManager.count.mockResolvedValue(1);

      const result = await service.findAll(1, 10);

      expect(result.data).toEqual(mockContracts);
      expect(result.meta).toEqual({
        hasMore: false,
        page: 1,
        limit: 10,
      });
      expect(em.find).toHaveBeenCalledWith(Contract, {}, {
        limit: 10,
        offset: 0,
      });
      expect(em.count).toHaveBeenCalledWith(Contract, {});
    });

    it('should return filtered contracts when search is provided', async () => {
      const mockContracts = [
        {
          id: uuidv4(),
          tenantId: uuidv4(),
          roomId: uuidv4(),
          startDate: new Date(),
          endDate: new Date(),
          deposit: 1000,
          monthlyRent: 500,
          status: ContractStatus.ACTIVE,
        },
      ];

      mockEntityManager.find.mockResolvedValue(mockContracts);
      mockEntityManager.count.mockResolvedValue(1);

      const result = await service.findAll(1, 10, 'Test');

      expect(result.data).toEqual(mockContracts);
      expect(result.meta).toEqual({
        hasMore: false,
        page: 1,
        limit: 10,
      });
      expect(em.find).toHaveBeenCalledWith(Contract, {
        $or: [
          { tenantId: { $like: '%Test%' } },
          { roomId: { $like: '%Test%' } },
        ],
      }, {
        limit: 10,
        offset: 0,
      });
      expect(em.count).toHaveBeenCalledWith(Contract, {
        $or: [
          { tenantId: { $like: '%Test%' } },
          { roomId: { $like: '%Test%' } },
        ],
      });
    });
  });

  describe('findOne', () => {
    it('should return contract when found', async () => {
      mockEntityManager.findOne.mockResolvedValue(mockContract);

      const result = await service.findOne(mockContract.id);

      expect(result).toEqual(mockContract);
    });

    it('should throw NotFoundException when contract not found', async () => {
      mockEntityManager.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create new contract', async () => {
      const startDate = new Date();
      const endDate = new Date();
      const tenantId = uuidv4();
      const roomId = uuidv4();
      const createContractDto: CreateContractDto = {
        tenantId,
        roomId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        deposit: 1000,
        monthlyRent: 500,
        terms: ['Term 1', 'Term 2'],
      };

      const mockRoom = {
        id: '1',
        name: 'Room 101',
        roomType: { id: '1', name: 'Standard' },
        floor: 1,
        area: 50,
        price: 1000000,
        status: RoomStatus.VACANT,
        description: 'Standard room',
        amenities: ['AC', 'TV'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockTenant = {
        id: tenantId,
        name: 'Test Tenant',
      };

      mockEntityManager.findOne
        .mockResolvedValueOnce(mockRoom)
        .mockResolvedValueOnce(mockTenant);

      const expectedContract = {
        startDate: new Date(createContractDto.startDate),
        endDate: new Date(createContractDto.endDate),
        deposit: createContractDto.deposit,
        monthlyRent: createContractDto.monthlyRent,
        terms: createContractDto.terms,
        tenant: mockTenant,
        room: mockRoom,
        status: ContractStatus.ACTIVE,
      };

      const mockCreatedContract = { ...expectedContract };
      mockEntityManager.create.mockReturnValue(mockCreatedContract);

      const result = await service.create(createContractDto);

      expect(result).toBeDefined();
      expect(result.deposit).toBe(createContractDto.deposit);
      expect(result.monthlyRent).toBe(createContractDto.monthlyRent);
      expect(result.terms).toEqual(createContractDto.terms);
      expect(result.status).toBe(ContractStatus.ACTIVE);
      expect(result.tenant).toEqual(mockTenant);
      expect(result.room).toEqual(mockRoom);
      expect(mockEntityManager.findOne).toHaveBeenCalledWith(Room, { id: roomId });
      expect(mockEntityManager.findOne).toHaveBeenCalledWith(Tenant, { id: tenantId });
      expect(mockEntityManager.create).toHaveBeenCalledWith(Contract, expectedContract);
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalledWith(mockCreatedContract);
    });

    it('should throw NotFoundException when tenant not found', async () => {
      const createContractDto: CreateContractDto = {
        tenantId: uuidv4(),
        roomId: uuidv4(),
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        deposit: 1000,
        monthlyRent: 500,
        terms: ['Term 1', 'Term 2'],
      };

      mockEntityManager.findOne.mockResolvedValue(null);

      await expect(service.create(createContractDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('renew', () => {
    it('should renew contract', async () => {
      const newEndDate = new Date().toISOString();
      const newMonthlyRent = 600;

      mockEntityManager.findOne.mockResolvedValue(mockContract);
      mockEntityManager.persistAndFlush.mockResolvedValue(undefined);

      const result = await service.renew(mockContract.id, newEndDate, newMonthlyRent);

      expect(result.endDate).toEqual(new Date(newEndDate));
      expect(result.monthlyRent).toBe(newMonthlyRent);
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalledWith(mockContract);
    });

    it('should throw error when renewing non-active contract', async () => {
      const newEndDate = new Date().toISOString();
      const inactiveContract = { ...mockContract, status: ContractStatus.EXPIRED };

      mockEntityManager.findOne.mockResolvedValue(inactiveContract);

      await expect(service.renew(inactiveContract.id, newEndDate)).rejects.toThrow(
        'Only active contracts can be renewed',
      );
    });
  });

  describe('terminate', () => {
    it('should terminate contract', async () => {
      const reason = 'Test reason';
      const terminationDate = new Date().toISOString();

      mockEntityManager.findOne.mockResolvedValue(mockContract);
      mockEntityManager.persistAndFlush.mockResolvedValue(undefined);

      const result = await service.terminate(mockContract.id, reason, terminationDate);

      expect(result.status).toBe(ContractStatus.TERMINATED);
      expect(result.terminationReason).toBe(reason);
      expect(result.terminationDate).toEqual(new Date(terminationDate));
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalledWith(mockContract);
    });

    it('should throw error when terminating non-active contract', async () => {
      const reason = 'Test reason';
      const terminationDate = new Date().toISOString();
      const inactiveContract = { ...mockContract, status: ContractStatus.EXPIRED };

      mockEntityManager.findOne.mockResolvedValue(inactiveContract);

      await expect(service.terminate(inactiveContract.id, reason, terminationDate)).rejects.toThrow(
        'Only active contracts can be terminated',
      );
    });
  });

  describe('checkExpiredContracts', () => {
    it('should update status of expired contracts', async () => {
      const today = new Date();
      const expiredContract = {
        ...mockContract,
        status: ContractStatus.ACTIVE,
        endDate: new Date(today.getTime() - 86400000), // yesterday
      };

      mockEntityManager.find.mockResolvedValue([expiredContract]);
      mockEntityManager.persistAndFlush.mockResolvedValue(undefined);

      await service.checkExpiredContracts();

      expect(expiredContract.status).toBe(ContractStatus.EXPIRED);
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalledWith([expiredContract]);
    });
  });
}); 