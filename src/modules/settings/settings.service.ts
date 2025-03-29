import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Settings } from './entities/settings.entity';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UpdateCategoriesDto } from './dto/update-categories.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SettingsService {
  constructor(private readonly em: EntityManager) {}

  async getSettings() {
    const settings = await this.em.findOne(Settings, {});
    if (!settings) {
      return this.createDefaultSettings();
    }
    return settings;
  }

  private async createDefaultSettings() {
    const settings = new Settings();
    settings.id = uuidv4();
    settings.buildingName = '';
    settings.buildingAddress = '';
    settings.buildingPhone = '';
    settings.buildingEmail = '';
    settings.language = 'vi';
    settings.notifications = true;
    settings.emailNotifications = true;
    settings.currency = 'VND';
    settings.timezone = 'Asia/Ho_Chi_Minh';
    settings.dateFormat = 'DD/MM/YYYY';
    settings.incomeCategories = ['Tiền thuê phòng', 'Tiền cọc', 'Khác'];
    settings.expenseCategories = ['Điện', 'Nước', 'Internet', 'Bảo trì', 'Khác'];

    await this.em.persistAndFlush(settings);
    return settings;
  }

  async updateBuilding(updateBuildingDto: UpdateBuildingDto) {
    const settings = await this.getSettings();
    
    settings.buildingName = updateBuildingDto.buildingName;
    settings.buildingAddress = updateBuildingDto.buildingAddress;
    settings.buildingPhone = updateBuildingDto.buildingPhone;
    settings.buildingEmail = updateBuildingDto.buildingEmail;

    await this.em.persistAndFlush(settings);
    return settings;
  }

  async updatePreferences(updatePreferencesDto: UpdatePreferencesDto) {
    const settings = await this.getSettings();
    
    settings.language = updatePreferencesDto.language;
    settings.notifications = updatePreferencesDto.notifications;
    settings.emailNotifications = updatePreferencesDto.emailNotifications;
    settings.currency = updatePreferencesDto.currency;
    settings.timezone = updatePreferencesDto.timezone;
    settings.dateFormat = updatePreferencesDto.dateFormat;

    await this.em.persistAndFlush(settings);
    return settings;
  }

  async updateCategories(updateCategoriesDto: UpdateCategoriesDto) {
    const settings = await this.getSettings();
    
    settings.incomeCategories = updateCategoriesDto.income;
    settings.expenseCategories = updateCategoriesDto.expense;

    await this.em.persistAndFlush(settings);
    return settings;
  }
} 