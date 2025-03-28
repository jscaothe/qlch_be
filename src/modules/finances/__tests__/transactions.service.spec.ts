import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/core';
import { TransactionsService } from '../transactions.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { Transaction } from '../entities/transaction.entity';
import { TransactionType } from '../enums/transaction-type.enum';
import { Room } from '../../rooms/entities/room.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let em: EntityManager;

  const mockEntityManager = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    persistAndFlush: jest.fn(),
    removeAndFlush: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    em = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of transactions', async () => {
      const mockTransactions = [
        {
          id: '1',
          type: TransactionType.RENT,
          amount: 1000,
          category: 'Rent',
          description: 'Monthly rent',
          date: new Date().toISOString(),
        },
      ];
      mockEntityManager.find.mockResolvedValue(mockTransactions);

      const result = await service.findAll();

      expect(result).toEqual({
        data: mockTransactions,
        meta: {
          hasMore: false,
          page: 1,
          limit: 10,
        },
      });
      expect(em.find).toHaveBeenCalledWith(Transaction, {}, {
        populate: ['room', 'tenant'],
        offset: 0,
        limit: 11,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single transaction', async () => {
      const mockTransaction = {
        id: '1',
        type: TransactionType.RENT,
        amount: 1000,
        category: 'Rent',
        description: 'Monthly rent',
        date: new Date().toISOString(),
      };
      mockEntityManager.findOne.mockResolvedValue(mockTransaction);

      expect(await service.findOne('1')).toBe(mockTransaction);
      expect(em.findOne).toHaveBeenCalledWith(Transaction, { id: '1' }, {
        populate: ['room', 'tenant'],
      });
    });
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      const createTransactionDto: CreateTransactionDto = {
        type: TransactionType.RENT,
        amount: 1000,
        category: 'Rent',
        description: 'Monthly rent',
        date: new Date().toISOString(),
        roomId: '1',
        tenantId: '1',
      };

      const mockRoom = { id: '1' } as Room;
      const mockTenant = { id: '1' } as Tenant;
      const mockTransaction = {
        id: '1',
        type: TransactionType.RENT,
        amount: 1000,
        category: 'Rent',
        description: 'Monthly rent',
        date: createTransactionDto.date,
        room: mockRoom,
        tenant: mockTenant,
      };

      mockEntityManager.findOne
        .mockResolvedValueOnce(mockRoom)
        .mockResolvedValueOnce(mockTenant);
      mockEntityManager.create.mockReturnValue(mockTransaction);
      mockEntityManager.persistAndFlush.mockResolvedValue(undefined);

      const result = await service.create(createTransactionDto);

      expect(result).toBe(mockTransaction);
      expect(em.findOne).toHaveBeenCalledWith(Room, { id: '1' });
      expect(em.findOne).toHaveBeenCalledWith(Tenant, { id: '1' });
      expect(em.create).toHaveBeenCalledWith(Transaction, {
        type: TransactionType.RENT,
        amount: 1000,
        category: 'Rent',
        description: 'Monthly rent',
        date: createTransactionDto.date,
        room: mockRoom,
        tenant: mockTenant,
      });
      expect(em.persistAndFlush).toHaveBeenCalledWith(mockTransaction);
    });
  });

  describe('remove', () => {
    it('should remove a transaction', async () => {
      const mockTransaction = {
        id: '1',
        type: TransactionType.RENT,
        amount: 1000,
        category: 'Rent',
        description: 'Monthly rent',
        date: new Date().toISOString(),
      };

      mockEntityManager.findOne.mockResolvedValue(mockTransaction);
      mockEntityManager.removeAndFlush.mockResolvedValue(undefined);

      await service.remove('1');

      expect(em.findOne).toHaveBeenCalledWith(Transaction, { id: '1' }, {
        populate: ['room', 'tenant'],
      });
      expect(em.removeAndFlush).toHaveBeenCalledWith(mockTransaction);
    });
  });
}); 