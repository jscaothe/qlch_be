import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settings } from './entities/settings.entity';
import { UpdateBuildingInfoDto } from './dto/update-building-info.dto';
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto';
import { UpdateCategoriesDto } from './dto/update-categories.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private settingsRepository: Repository<Settings>,
  ) {}

  async getSettings(): Promise<Settings> {
    const settings = await this.settingsRepository.findOne({ where: { id: 1 } });
    if (!settings) {
      return this.settingsRepository.save({
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
      });
    }
    return settings;
  }

  async updateBuildingInfo(updateBuildingInfoDto: UpdateBuildingInfoDto): Promise<Settings> {
    const settings = await this.getSettings();
    settings.buildingInfo = updateBuildingInfoDto;
    return this.settingsRepository.save(settings);
  }

  async updateUserPreferences(updateUserPreferencesDto: UpdateUserPreferencesDto): Promise<Settings> {
    const settings = await this.getSettings();
    settings.userPreferences = updateUserPreferencesDto;
    return this.settingsRepository.save(settings);
  }

  async updateCategories(updateCategoriesDto: UpdateCategoriesDto): Promise<Settings> {
    const settings = await this.getSettings();
    settings.categories = updateCategoriesDto;
    return this.settingsRepository.save(settings);
  }
} 