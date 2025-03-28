import { Test, TestingModule } from '@nestjs/testing';
import { SettingsService } from './settings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Settings } from './entities/settings.entity';
import { Repository } from 'typeorm';
import { UpdateBuildingInfoDto } from './dto/update-building-info.dto';
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto';
import { UpdateCategoriesDto } from './dto/update-categories.dto';

describe('SettingsService', () => {
  let service: SettingsService;
  let repository: Repository<Settings>;

  const mockRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        {
          provide: getRepositoryToken(Settings),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
    repository = module.get<Repository<Settings>>(getRepositoryToken(Settings));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSettings', () => {
    it('should return existing settings', async () => {
      const expectedSettings = {
        id: 1,
        buildingInfo: {
          name: 'Test Building',
          address: 'Test Address',
          phone: '1234567890',
          email: 'test@example.com',
        },
        userPreferences: {
          language: 'vi',
          notifications: true,
          emailNotifications: true,
          currency: 'VND',
          timezone: 'Asia/Ho_Chi_Minh',
          dateFormat: 'DD/MM/YYYY',
        },
        categories: {
          income: ['Rent'],
          expense: ['Maintenance'],
        },
      };

      mockRepository.findOne.mockResolvedValue(expectedSettings);

      const result = await service.getSettings();

      expect(result).toEqual(expectedSettings);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should create default settings if none exist', async () => {
      const defaultSettings = {
        buildingInfo: {
          name: '',
          address: '',
          phone: '',
          email: '',
        },
        userPreferences: {
          language: 'vi',
          notifications: true,
          emailNotifications: true,
          currency: 'VND',
          timezone: 'Asia/Ho_Chi_Minh',
          dateFormat: 'DD/MM/YYYY',
        },
        categories: {
          income: [],
          expense: [],
        },
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.save.mockResolvedValue({ id: 1, ...defaultSettings });

      const result = await service.getSettings();

      expect(result).toEqual({ id: 1, ...defaultSettings });
      expect(mockRepository.save).toHaveBeenCalledWith(defaultSettings);
    });
  });

  describe('updateBuildingInfo', () => {
    it('should update building info', async () => {
      const updateBuildingInfoDto: UpdateBuildingInfoDto = {
        name: 'New Building',
        address: 'New Address',
        phone: '0987654321',
        email: 'new@example.com',
      };

      const existingSettings = {
        id: 1,
        buildingInfo: {
          name: 'Old Building',
          address: 'Old Address',
          phone: '1234567890',
          email: 'old@example.com',
        },
        userPreferences: {
          language: 'vi',
          notifications: true,
          emailNotifications: true,
          currency: 'VND',
          timezone: 'Asia/Ho_Chi_Minh',
          dateFormat: 'DD/MM/YYYY',
        },
        categories: {
          income: [],
          expense: [],
        },
      };

      const expectedSettings = {
        ...existingSettings,
        buildingInfo: updateBuildingInfoDto,
      };

      mockRepository.findOne.mockResolvedValue(existingSettings);
      mockRepository.save.mockResolvedValue(expectedSettings);

      const result = await service.updateBuildingInfo(updateBuildingInfoDto);

      expect(result).toEqual(expectedSettings);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedSettings);
    });
  });

  describe('updateUserPreferences', () => {
    it('should update user preferences', async () => {
      const updateUserPreferencesDto: UpdateUserPreferencesDto = {
        language: 'en',
        notifications: false,
        emailNotifications: false,
        currency: 'USD',
        timezone: 'UTC',
        dateFormat: 'MM/DD/YYYY',
      };

      const existingSettings = {
        id: 1,
        buildingInfo: {
          name: 'Test Building',
          address: 'Test Address',
          phone: '1234567890',
          email: 'test@example.com',
        },
        userPreferences: {
          language: 'vi',
          notifications: true,
          emailNotifications: true,
          currency: 'VND',
          timezone: 'Asia/Ho_Chi_Minh',
          dateFormat: 'DD/MM/YYYY',
        },
        categories: {
          income: [],
          expense: [],
        },
      };

      const expectedSettings = {
        ...existingSettings,
        userPreferences: updateUserPreferencesDto,
      };

      mockRepository.findOne.mockResolvedValue(existingSettings);
      mockRepository.save.mockResolvedValue(expectedSettings);

      const result = await service.updateUserPreferences(updateUserPreferencesDto);

      expect(result).toEqual(expectedSettings);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedSettings);
    });
  });

  describe('updateCategories', () => {
    it('should update categories', async () => {
      const updateCategoriesDto: UpdateCategoriesDto = {
        income: ['Rent', 'Deposit'],
        expense: ['Maintenance', 'Utilities'],
      };

      const existingSettings = {
        id: 1,
        buildingInfo: {
          name: 'Test Building',
          address: 'Test Address',
          phone: '1234567890',
          email: 'test@example.com',
        },
        userPreferences: {
          language: 'vi',
          notifications: true,
          emailNotifications: true,
          currency: 'VND',
          timezone: 'Asia/Ho_Chi_Minh',
          dateFormat: 'DD/MM/YYYY',
        },
        categories: {
          income: [],
          expense: [],
        },
      };

      const expectedSettings = {
        ...existingSettings,
        categories: updateCategoriesDto,
      };

      mockRepository.findOne.mockResolvedValue(existingSettings);
      mockRepository.save.mockResolvedValue(expectedSettings);

      const result = await service.updateCategories(updateCategoriesDto);

      expect(result).toEqual(expectedSettings);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedSettings);
    });
  });
}); 