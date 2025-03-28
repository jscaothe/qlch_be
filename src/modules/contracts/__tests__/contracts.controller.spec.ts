import { Test, TestingModule } from '@nestjs/testing';
import { ContractsController } from '../contracts.controller';
import { ContractsService } from '../contracts.service';
import { CreateContractDto } from '../dto/create-contract.dto';
import { ContractStatus } from '../enums/contract-status.enum';

describe('ContractsController', () => {
  let controller: ContractsController;
  let service: ContractsService;

  const mockContractsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    renew: jest.fn(),
    terminate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractsController],
      providers: [
        {
          provide: ContractsService,
          useValue: mockContractsService,
        },
      ],
    }).compile();

    controller = module.get<ContractsController>(ContractsController);
    service = module.get<ContractsService>(ContractsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of contracts', async () => {
      const mockContracts = [
        {
          id: '1',
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
          monthlyRent: 1000,
          status: 'active' as ContractStatus,
        },
      ];
      const result = {
        data: mockContracts,
        meta: {
          hasMore: false,
          page: 1,
          limit: 10,
        },
      };
      mockContractsService.findAll.mockResolvedValue(result);

      expect(await controller.findAll(1, 10)).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined);
    });

    it('should return filtered contracts when search is provided', async () => {
      const mockContracts = [
        {
          id: '1',
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
          monthlyRent: 1000,
          status: 'active' as ContractStatus,
        },
      ];
      const result = {
        data: mockContracts,
        meta: {
          hasMore: false,
          page: 1,
          limit: 10,
        },
      };
      mockContractsService.findAll.mockResolvedValue(result);

      expect(await controller.findAll(1, 10, 'Test')).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith(1, 10, 'Test');
    });
  });

  describe('findOne', () => {
    it('should return a single contract', async () => {
      const mockContract = {
        id: '1',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        monthlyRent: 1000,
        status: 'active' as ContractStatus,
      };
      mockContractsService.findOne.mockResolvedValue(mockContract);

      expect(await controller.findOne('1')).toBe(mockContract);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new contract', async () => {
      const createContractDto: CreateContractDto = {
        tenantId: '1',
        roomId: '1',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        deposit: 1000,
        monthlyRent: 1000,
        terms: ['Term 1', 'Term 2'],
        status: 'active' as ContractStatus,
      };

      const mockContract = {
        id: '1',
        ...createContractDto,
      };

      mockContractsService.create.mockResolvedValue(mockContract);

      expect(await controller.create(createContractDto)).toBe(mockContract);
      expect(service.create).toHaveBeenCalledWith(createContractDto);
    });
  });

  describe('update', () => {
    it('should update a contract', async () => {
      const updateContractDto: Partial<CreateContractDto> = {
        monthlyRent: 2000,
      };

      const mockContract = {
        id: '1',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        monthlyRent: 1000,
        status: 'active' as ContractStatus,
      };

      mockContractsService.update.mockResolvedValue(mockContract);

      expect(await controller.update('1', updateContractDto)).toBe(mockContract);
      expect(service.update).toHaveBeenCalledWith('1', updateContractDto);
    });
  });

  describe('remove', () => {
    it('should remove a contract', async () => {
      mockContractsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');
      
      expect(service.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual({ message: 'Contract deleted successfully' });
    });
  });

  describe('renew', () => {
    it('should renew a contract', async () => {
      const renewData = {
        newEndDate: new Date().toISOString(),
        newMonthlyRent: 1500,
      };

      const mockContract = {
        id: '1',
        startDate: new Date().toISOString(),
        endDate: renewData.newEndDate,
        monthlyRent: renewData.newMonthlyRent,
        status: 'active' as ContractStatus,
      };

      mockContractsService.renew.mockResolvedValue(mockContract);

      expect(await controller.renew('1', renewData)).toBe(mockContract);
      expect(service.renew).toHaveBeenCalledWith('1', renewData.newEndDate, renewData.newMonthlyRent);
    });
  });

  describe('terminate', () => {
    it('should terminate a contract', async () => {
      const terminateData = {
        reason: 'Test reason',
        terminationDate: new Date().toISOString(),
      };

      const mockContract = {
        id: '1',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        monthlyRent: 1000,
        status: 'terminated' as ContractStatus,
        terminationReason: terminateData.reason,
        terminationDate: new Date(terminateData.terminationDate),
      };

      mockContractsService.terminate.mockResolvedValue(mockContract);

      expect(await controller.terminate('1', terminateData)).toBe(mockContract);
      expect(service.terminate).toHaveBeenCalledWith('1', terminateData.reason, terminateData.terminationDate);
    });
  });
}); 