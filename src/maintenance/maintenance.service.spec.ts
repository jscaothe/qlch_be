import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceService } from './maintenance.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Maintenance } from './entities/maintenance.entity';
import { Repository } from 'typeorm';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';

describe('MaintenanceService', () => {
  let service: MaintenanceService;
  let repository: Repository<Maintenance>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaintenanceService,
        {
          provide: getRepositoryToken(Maintenance),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MaintenanceService>(MaintenanceService);
    repository = module.get<Repository<Maintenance>>(getRepositoryToken(Maintenance));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new maintenance record', async () => {
      const createMaintenanceDto: CreateMaintenanceDto = {
        equipmentId: '1',
        equipmentName: 'Test Equipment',
        maintenanceType: 'preventive',
        description: 'Test Description',
        startDate: new Date(),
        priority: 'medium',
        assignedTo: 'John Doe',
      };

      const expectedMaintenance = {
        id: 1,
        ...createMaintenanceDto,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockReturnValue(expectedMaintenance);
      mockRepository.save.mockResolvedValue(expectedMaintenance);

      const result = await service.create(createMaintenanceDto);

      expect(result).toEqual(expectedMaintenance);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createMaintenanceDto,
        status: 'pending',
      });
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of maintenance records', async () => {
      const expectedMaintenances = [
        {
          id: 1,
          equipmentId: '1',
          equipmentName: 'Test Equipment',
          maintenanceType: 'preventive',
          description: 'Test Description',
          startDate: new Date(),
          priority: 'medium',
          assignedTo: 'John Doe',
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.find.mockResolvedValue(expectedMaintenances);

      const result = await service.findAll();

      expect(result).toEqual(expectedMaintenances);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single maintenance record', async () => {
      const expectedMaintenance = {
        id: 1,
        equipmentId: '1',
        equipmentName: 'Test Equipment',
        maintenanceType: 'preventive',
        description: 'Test Description',
        startDate: new Date(),
        priority: 'medium',
        assignedTo: 'John Doe',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(expectedMaintenance);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedMaintenance);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('update', () => {
    it('should update a maintenance record', async () => {
      const updateMaintenanceDto: UpdateMaintenanceDto = {
        status: 'in_progress',
        notes: 'Updated notes',
      };

      const expectedMaintenance = {
        id: 1,
        equipmentId: '1',
        equipmentName: 'Test Equipment',
        maintenanceType: 'preventive',
        description: 'Test Description',
        startDate: new Date(),
        priority: 'medium',
        assignedTo: 'John Doe',
        status: 'in_progress',
        notes: 'Updated notes',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValue(expectedMaintenance);

      const result = await service.update(1, updateMaintenanceDto);

      expect(result).toEqual(expectedMaintenance);
      expect(mockRepository.update).toHaveBeenCalledWith(1, {
        ...updateMaintenanceDto,
        updatedAt: expect.any(Date),
      });
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('remove', () => {
    it('should remove a maintenance record', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });
}); 