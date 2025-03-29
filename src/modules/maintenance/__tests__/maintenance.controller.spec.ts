import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceController } from '../maintenance.controller';
import { MaintenanceService } from '../maintenance.service';
import { MaintenanceStatus, MaintenanceType, MaintenancePriority } from '../entities/maintenance.entity';
import { CreateMaintenanceDto } from '../dto/create-maintenance.dto';
import { UpdateMaintenanceStatusDto } from '../dto/update-maintenance-status.dto';
import { v4 as uuidv4 } from 'uuid';

describe('MaintenanceController', () => {
  let controller: MaintenanceController;
  let service: MaintenanceService;

  const mockMaintenanceService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    updateStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaintenanceController],
      providers: [
        {
          provide: MaintenanceService,
          useValue: mockMaintenanceService,
        },
      ],
    }).compile();

    controller = module.get<MaintenanceController>(MaintenanceController);
    service = module.get<MaintenanceService>(MaintenanceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new maintenance record', async () => {
      const createMaintenanceDto: CreateMaintenanceDto = {
        equipmentId: '1',
        equipmentName: 'Test Equipment',
        maintenanceType: MaintenanceType.PREVENTIVE,
        description: 'Test Description',
        startDate: new Date().toISOString(),
        priority: MaintenancePriority.MEDIUM,
        assignedTo: 'John Doe',
      };

      const expectedMaintenance = {
        id: '1',
        ...createMaintenanceDto,
        status: MaintenanceStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockMaintenanceService.create.mockResolvedValue(expectedMaintenance);

      const result = await controller.create(createMaintenanceDto);

      expect(result).toEqual(expectedMaintenance);
      expect(mockMaintenanceService.create).toHaveBeenCalledWith(createMaintenanceDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of maintenance records', async () => {
      const expectedMaintenances = [
        {
          id: '1',
          equipmentId: '1',
          equipmentName: 'Test Equipment',
          maintenanceType: MaintenanceType.PREVENTIVE,
          description: 'Test Description',
          startDate: new Date(),
          priority: MaintenancePriority.MEDIUM,
          assignedTo: 'John Doe',
          status: MaintenanceStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockMaintenanceService.findAll.mockResolvedValue(expectedMaintenances);

      const result = await controller.findAll(1, 10, MaintenanceStatus.PENDING, MaintenanceType.PREVENTIVE, new Date().toISOString(), new Date().toISOString());

      expect(result).toEqual(expectedMaintenances);
      expect(mockMaintenanceService.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        status: MaintenanceStatus.PENDING,
        type: MaintenanceType.PREVENTIVE,
        startDate: expect.any(Date),
        endDate: expect.any(Date),
      });
    });
  });

  describe('findOne', () => {
    it('should return a single maintenance record', async () => {
      const expectedMaintenance = {
        id: '1',
        equipmentId: '1',
        equipmentName: 'Test Equipment',
        maintenanceType: MaintenanceType.PREVENTIVE,
        description: 'Test Description',
        startDate: new Date(),
        priority: MaintenancePriority.MEDIUM,
        assignedTo: 'John Doe',
        status: MaintenanceStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockMaintenanceService.findOne.mockResolvedValue(expectedMaintenance);

      const result = await controller.findOne('1');

      expect(result).toEqual(expectedMaintenance);
      expect(mockMaintenanceService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('updateStatus', () => {
    it('should update a maintenance record status', async () => {
      const updateMaintenanceStatusDto: UpdateMaintenanceStatusDto = {
        status: MaintenanceStatus.IN_PROGRESS,
        notes: 'Updated notes',
      };

      const expectedMaintenance = {
        id: '1',
        equipmentId: '1',
        equipmentName: 'Test Equipment',
        maintenanceType: MaintenanceType.PREVENTIVE,
        description: 'Test Description',
        startDate: new Date(),
        priority: MaintenancePriority.MEDIUM,
        assignedTo: 'John Doe',
        status: MaintenanceStatus.IN_PROGRESS,
        notes: 'Updated notes',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockMaintenanceService.updateStatus.mockResolvedValue(expectedMaintenance);

      const result = await controller.updateStatus('1', updateMaintenanceStatusDto);

      expect(result).toEqual(expectedMaintenance);
      expect(mockMaintenanceService.updateStatus).toHaveBeenCalledWith('1', updateMaintenanceStatusDto);
    });
  });
}); 