import { Test, TestingModule } from '@nestjs/testing';
import { SettingsController } from '../settings.controller';
import { SettingsService } from '../settings.service';
import { UpdateBuildingDto } from '../dto/update-building.dto';
import { UpdatePreferencesDto } from '../dto/update-preferences.dto';
import { UpdateCategoriesDto } from '../dto/update-categories.dto';
import { v4 as uuidv4 } from 'uuid';

describe('SettingsController', () => {
  let controller: SettingsController;
  let service: SettingsService;

  const mockSettingsService = {
    getSettings: jest.fn(),
    updateBuilding: jest.fn(),
    updatePreferences: jest.fn(),
    updateCategories: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [
        {
          provide: SettingsService,
          useValue: mockSettingsService,
        },
      ],
    }).compile();

    controller = module.get<SettingsController>(SettingsController);
    service = module.get<SettingsService>(SettingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSettings', () => {
    it('should return settings', async () => {
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
        incomeCategories: ['Rent'],
        expenseCategories: ['Maintenance'],
      };

      mockSettingsService.getSettings.mockResolvedValue(expectedSettings);

      const result = await controller.getSettings();

      expect(result).toEqual(expectedSettings);
      expect(mockSettingsService.getSettings).toHaveBeenCalled();
    });
  });

  describe('updateBuilding', () => {
    it('should update building info', async () => {
      const updateBuildingDto: UpdateBuildingDto = {
        buildingName: 'New Building',
        buildingAddress: 'New Address',
        buildingPhone: '0987654321',
        buildingEmail: 'new@example.com',
      };

      const expectedSettings = {
        id: '1',
        ...updateBuildingDto,
        language: 'vi',
        notifications: true,
        emailNotifications: true,
        currency: 'VND',
        timezone: 'Asia/Ho_Chi_Minh',
        dateFormat: 'DD/MM/YYYY',
        incomeCategories: ['Rent'],
        expenseCategories: ['Maintenance'],
      };

      mockSettingsService.updateBuilding.mockResolvedValue(expectedSettings);

      const result = await controller.updateBuilding(updateBuildingDto);

      expect(result).toEqual(expectedSettings);
      expect(mockSettingsService.updateBuilding).toHaveBeenCalledWith(updateBuildingDto);
    });
  });

  describe('updatePreferences', () => {
    it('should update user preferences', async () => {
      const updatePreferencesDto: UpdatePreferencesDto = {
        language: 'en',
        notifications: false,
        emailNotifications: false,
        currency: 'USD',
        timezone: 'UTC',
        dateFormat: 'MM/DD/YYYY',
      };

      const expectedSettings = {
        id: '1',
        buildingName: 'Test Building',
        buildingAddress: 'Test Address',
        buildingPhone: '1234567890',
        buildingEmail: 'test@example.com',
        ...updatePreferencesDto,
        incomeCategories: ['Rent'],
        expenseCategories: ['Maintenance'],
      };

      mockSettingsService.updatePreferences.mockResolvedValue(expectedSettings);

      const result = await controller.updatePreferences(updatePreferencesDto);

      expect(result).toEqual(expectedSettings);
      expect(mockSettingsService.updatePreferences).toHaveBeenCalledWith(updatePreferencesDto);
    });
  });

  describe('updateCategories', () => {
    it('should update categories', async () => {
      const updateCategoriesDto: UpdateCategoriesDto = {
        income: ['Rent', 'Deposit'],
        expense: ['Maintenance', 'Utilities'],
      };

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
        incomeCategories: updateCategoriesDto.income,
        expenseCategories: updateCategoriesDto.expense,
      };

      mockSettingsService.updateCategories.mockResolvedValue(expectedSettings);

      const result = await controller.updateCategories(updateCategoriesDto);

      expect(result).toEqual(expectedSettings);
      expect(mockSettingsService.updateCategories).toHaveBeenCalledWith(updateCategoriesDto);
    });
  });
}); 