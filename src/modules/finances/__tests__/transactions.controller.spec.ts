import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from '../transactions.controller';
import { TransactionsService } from '../transactions.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionType } from '../enums/transaction-type.enum';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  const mockTransactionsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
      const result = {
        data: mockTransactions,
        meta: {
          hasMore: false,
          page: 1,
          limit: 10,
        },
      };
      mockTransactionsService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith(undefined, undefined, undefined);
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
      mockTransactionsService.findOne.mockResolvedValue(mockTransaction);

      expect(await controller.findOne('1')).toBe(mockTransaction);
      expect(service.findOne).toHaveBeenCalledWith('1');
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

      const mockTransaction = {
        id: '1',
        type: TransactionType.RENT,
        amount: 1000,
        category: 'Rent',
        description: 'Monthly rent',
        date: createTransactionDto.date,
        room: { id: '1' },
        tenant: { id: '1' },
      };

      mockTransactionsService.create.mockResolvedValue(mockTransaction);

      expect(await controller.create(createTransactionDto)).toBe(mockTransaction);
      expect(service.create).toHaveBeenCalledWith(createTransactionDto);
    });
  });

  describe('remove', () => {
    it('should remove a transaction', async () => {
      mockTransactionsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');
      
      expect(service.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual({ message: 'Transaction deleted successfully' });
    });
  });
}); 