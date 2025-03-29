import { Controller, Get, Put, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UpdateCategoriesDto } from './dto/update-categories.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings() {
    return this.settingsService.getSettings();
  }

  @Put('building')
  async updateBuilding(@Body() updateBuildingDto: UpdateBuildingDto) {
    return this.settingsService.updateBuilding(updateBuildingDto);
  }

  @Put('preferences')
  async updatePreferences(@Body() updatePreferencesDto: UpdatePreferencesDto) {
    return this.settingsService.updatePreferences(updatePreferencesDto);
  }

  @Put('categories')
  async updateCategories(@Body() updateCategoriesDto: UpdateCategoriesDto) {
    return this.settingsService.updateCategories(updateCategoriesDto);
  }
} 