import { Test, TestingModule } from '@nestjs/testing';
import { SettingsService } from '../settings.service';
import { EntityManager } from '@mikro-orm/core';
import { Settings } from '../entities/settings.entity';
import { UpdateBuildingDto } from '../dto/update-building.dto';
import { UpdatePreferencesDto } from '../dto/update-preferences.dto';
import { UpdateCategoriesDto } from '../dto/update-categories.dto';

describe('SettingsService', () => {
  let service: SettingsService;
  let entityManager: EntityManager;

  const mockEntityManager = {
    find: jest.fn(),
    findOne: jest.fn(),
    persistAndFlush: jest.fn(),
    flush: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
    entityManager = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSettings', () => {
    it('should return existing settings', async () => {
      const expectedSettings = {
        id: '1',
        buildingName: 'Test Building',
        buildingAddress: 'Test Address',
        buildingPhone: '1234567890',
        buildingEmail: 'test@example.com',
        language: 'vi',
        notifications: true,
        emailNotifications: true,
        currency: 'VND',
        timezone: 'Asia/Ho_Chi_Minh',
        dateFormat: 'DD/MM/YYYY',
        incomeCategories: ['Tiền thuê phòng', 'Tiền cọc', 'Khác'],
        expenseCategories: ['Điện', 'Nước', 'Internet', 'Bảo trì', 'Khác'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockEntityManager.findOne.mockResolvedValue(expectedSettings);

      const result = await service.getSettings();

      expect(result).toEqual(expectedSettings);
      expect(mockEntityManager.findOne).toHaveBeenCalled();
    });

    it('should create default settings if none exist', async () => {
      mockEntityManager.findOne.mockResolvedValue(null);
      mockEntityManager.persistAndFlush.mockResolvedValue(undefined);

      const result = await service.getSettings();

      expect(result).toBeDefined();
      expect(result.buildingName).toBe('');
      expect(result.buildingAddress).toBe('');
      expect(result.buildingPhone).toBe('');
      expect(result.buildingEmail).toBe('');
      expect(result.language).toBe('vi');
      expect(result.notifications).toBe(true);
      expect(result.emailNotifications).toBe(true);
      expect(result.currency).toBe('VND');
      expect(result.timezone).toBe('Asia/Ho_Chi_Minh');
      expect(result.dateFormat).toBe('DD/MM/YYYY');
      expect(result.incomeCategories).toEqual(['Tiền thuê phòng', 'Tiền cọc', 'Khác']);
      expect(result.expenseCategories).toEqual(['Điện', 'Nước', 'Internet', 'Bảo trì', 'Khác']);
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalled();
    });
  });

  describe('updateBuilding', () => {
    it('should update building info', async () => {
      const updateDto: UpdateBuildingDto = {
        buildingName: 'New Building',
        buildingAddress: 'New Address',
        buildingPhone: '0987654321',
        buildingEmail: 'new@example.com',
      };

      const existingSettings = {
        id: '1',
        buildingName: 'Old Building',
        buildingAddress: 'Old Address',
        buildingPhone: '1234567890',
        buildingEmail: 'old@example.com',
        language: 'vi',
        notifications: true,
        emailNotifications: true,
        currency: 'VND',
        timezone: 'Asia/Ho_Chi_Minh',
        dateFormat: 'DD/MM/YYYY',
        incomeCategories: ['Tiền thuê phòng'],
        expenseCategories: ['Điện'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockEntityManager.findOne.mockResolvedValue(existingSettings);
      mockEntityManager.persistAndFlush.mockResolvedValue(undefined);

      const result = await service.updateBuilding(updateDto);

      expect(result.buildingName).toBe(updateDto.buildingName);
      expect(result.buildingAddress).toBe(updateDto.buildingAddress);
      expect(result.buildingPhone).toBe(updateDto.buildingPhone);
      expect(result.buildingEmail).toBe(updateDto.buildingEmail);
      expect(mockEntityManager.findOne).toHaveBeenCalled();
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalled();
    });
  });

  describe('updatePreferences', () => {
    it('should update user preferences', async () => {
      const updateDto: UpdatePreferencesDto = {
        language: 'en',
        notifications: false,
        emailNotifications: false,
        currency: 'USD',
        timezone: 'UTC',
        dateFormat: 'MM/DD/YYYY',
      };

      const existingSettings = {
        id: '1',
        buildingName: 'Test Building',
        buildingAddress: 'Test Address',
        buildingPhone: '1234567890',
        buildingEmail: 'test@example.com',
        language: 'vi',
        notifications: true,
        emailNotifications: true,
        currency: 'VND',
        timezone: 'Asia/Ho_Chi_Minh',
        dateFormat: 'DD/MM/YYYY',
        incomeCategories: ['Tiền thuê phòng'],
        expenseCategories: ['Điện'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockEntityManager.findOne.mockResolvedValue(existingSettings);
      mockEntityManager.persistAndFlush.mockResolvedValue(undefined);

      const result = await service.updatePreferences(updateDto);

      expect(result.language).toBe(updateDto.language);
      expect(result.notifications).toBe(updateDto.notifications);
      expect(result.emailNotifications).toBe(updateDto.emailNotifications);
      expect(result.currency).toBe(updateDto.currency);
      expect(result.timezone).toBe(updateDto.timezone);
      expect(result.dateFormat).toBe(updateDto.dateFormat);
      expect(mockEntityManager.findOne).toHaveBeenCalled();
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalled();
    });
  });

  describe('updateCategories', () => {
    it('should update categories', async () => {
      const updateDto: UpdateCategoriesDto = {
        income: ['Rent', 'Deposit'],
        expense: ['Maintenance', 'Utilities'],
      };

      const existingSettings = {
        id: '1',
        buildingName: 'Test Building',
        buildingAddress: 'Test Address',
        buildingPhone: '1234567890',
        buildingEmail: 'test@example.com',
        language: 'vi',
        notifications: true,
        emailNotifications: true,
        currency: 'VND',
        timezone: 'Asia/Ho_Chi_Minh',
        dateFormat: 'DD/MM/YYYY',
        incomeCategories: ['Tiền thuê phòng'],
        expenseCategories: ['Điện'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockEntityManager.findOne.mockResolvedValue(existingSettings);
      mockEntityManager.persistAndFlush.mockResolvedValue(undefined);

      const result = await service.updateCategories(updateDto);

      expect(result.incomeCategories).toEqual(updateDto.income);
      expect(result.expenseCategories).toEqual(updateDto.expense);
      expect(mockEntityManager.findOne).toHaveBeenCalled();
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalled();
    });
  });
}); 