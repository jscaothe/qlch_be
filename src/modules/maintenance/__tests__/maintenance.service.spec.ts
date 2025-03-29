import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceService } from '../maintenance.service';
import { EntityManager } from '@mikro-orm/core';
import { Maintenance, MaintenanceStatus, MaintenancePriority, MaintenanceType } from '../entities/maintenance.entity';
import { CreateMaintenanceDto } from '../dto/create-maintenance.dto';
import { UpdateMaintenanceStatusDto } from '../dto/update-maintenance-status.dto';

describe('MaintenanceService', () => {
  let service: MaintenanceService;
  let entityManager: EntityManager;

  const mockEntityManager = {
    find: jest.fn(),
    findOne: jest.fn(),
    persistAndFlush: jest.fn(),
    flush: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaintenanceService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<MaintenanceService>(MaintenanceService);
    entityManager = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new maintenance record', async () => {
      const createMaintenanceDto: CreateMaintenanceDto = {
        equipmentId: '1',
        equipmentName: 'Test Equipment',
        maintenanceType: MaintenanceType.PREVENTIVE,
        description: 'Test Description',
        startDate: '2025-03-28T17:35:11.359Z',
        priority: MaintenancePriority.MEDIUM,
        assignedTo: 'John Doe',
      };

      const expectedMaintenance = {
        id: expect.any(String),
        equipmentId: createMaintenanceDto.equipmentId,
        equipmentName: createMaintenanceDto.equipmentName,
        maintenanceType: createMaintenanceDto.maintenanceType,
        description: createMaintenanceDto.description,
        startDate: new Date(createMaintenanceDto.startDate),
        priority: createMaintenanceDto.priority,
        assignedTo: createMaintenanceDto.assignedTo,
        status: MaintenanceStatus.PENDING,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      };

      mockEntityManager.persistAndFlush.mockResolvedValue(undefined);

      const result = await service.create(createMaintenanceDto);

      expect(result).toEqual(expectedMaintenance);
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of maintenance records', async () => {
      const expectedMaintenances = [
        {
          id: '1',
          equipmentId: '1',
          equipmentName: 'Test Equipment 1',
          maintenanceType: MaintenanceType.PREVENTIVE,
          description: 'Test Description 1',
          startDate: new Date('2025-03-28T17:35:11.359Z'),
          priority: MaintenancePriority.MEDIUM,
          assignedTo: 'John Doe',
          status: MaintenanceStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          equipmentId: '2',
          equipmentName: 'Test Equipment 2',
          maintenanceType: MaintenanceType.CORRECTIVE,
          description: 'Test Description 2',
          startDate: new Date('2025-03-29T17:35:11.359Z'),
          priority: MaintenancePriority.HIGH,
          assignedTo: 'Jane Doe',
          status: MaintenanceStatus.IN_PROGRESS,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockEntityManager.find.mockResolvedValue(expectedMaintenances);
      mockEntityManager.count.mockResolvedValue(2);

      const result = await service.findAll({
        page: 1,
        limit: 10,
      });

      expect(result.maintenances).toEqual(expectedMaintenances);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(mockEntityManager.find).toHaveBeenCalled();
      expect(mockEntityManager.count).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single maintenance record', async () => {
      const maintenanceId = '1';
      const expectedMaintenance = {
        id: maintenanceId,
        equipmentId: '1',
        equipmentName: 'Test Equipment',
        maintenanceType: MaintenanceType.PREVENTIVE,
        description: 'Test Description',
        startDate: new Date('2025-03-28T17:35:11.359Z'),
        priority: MaintenancePriority.MEDIUM,
        assignedTo: 'John Doe',
        status: MaintenanceStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockEntityManager.findOne.mockResolvedValue(expectedMaintenance);

      const result = await service.findOne(maintenanceId);

      expect(result).toEqual(expectedMaintenance);
      expect(mockEntityManager.findOne).toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    it('should update a maintenance record status', async () => {
      const maintenanceId = '1';
      const updateStatusDto: UpdateMaintenanceStatusDto = {
        status: MaintenanceStatus.IN_PROGRESS,
        notes: 'Updated notes',
      };

      const existingMaintenance = {
        id: maintenanceId,
        equipmentId: '1',
        equipmentName: 'Test Equipment',
        maintenanceType: MaintenanceType.PREVENTIVE,
        description: 'Test Description',
        startDate: new Date('2025-03-28T17:35:11.359Z'),
        priority: MaintenancePriority.MEDIUM,
        assignedTo: 'John Doe',
        status: MaintenanceStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockEntityManager.findOne.mockResolvedValue(existingMaintenance);
      mockEntityManager.persistAndFlush.mockResolvedValue(undefined);

      const result = await service.updateStatus(maintenanceId, updateStatusDto);

      expect(result.status).toBe(updateStatusDto.status);
      expect(result.notes).toBe(updateStatusDto.notes);
      expect(mockEntityManager.findOne).toHaveBeenCalled();
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalled();
    });
  });
}); 