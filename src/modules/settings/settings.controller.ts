import { Controller, Get, Put, Body, Post, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UpdateCategoriesDto } from './dto/update-categories.dto';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { RoomType } from './entities/room-type.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('settings')
@Controller('api/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all settings' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all settings' })
  async getSettings() {
    return this.settingsService.getSettings();
  }

  @Put('building')
  @ApiOperation({ summary: 'Update building information' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Building information updated successfully',
    schema: {
      example: {
        name: "Luxury Apartment",
        address: "123 Main Street",
        numberOfFloors: 10,
        description: "Modern luxury apartment building in city center"
      }
    }
  })
  async updateBuilding(@Body() updateBuildingDto: UpdateBuildingDto) {
    return this.settingsService.updateBuilding(updateBuildingDto);
  }

  @Put('preferences')
  @ApiOperation({ summary: 'Update system preferences' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'System preferences updated successfully',
    schema: {
      example: {
        currency: "VND",
        language: "vi",
        timeZone: "Asia/Ho_Chi_Minh",
        dateFormat: "DD/MM/YYYY",
        emailNotifications: true
      }
    }
  })
  async updatePreferences(@Body() updatePreferencesDto: UpdatePreferencesDto) {
    return this.settingsService.updatePreferences(updatePreferencesDto);
  }

  @Put('categories')
  @ApiOperation({ summary: 'Update categories' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Categories updated successfully',
    schema: {
      example: {
        income: ["Rent", "Deposit", "Services"],
        expense: ["Maintenance", "Utilities", "Staff"]
      }
    }
  })
  async updateCategories(@Body() updateCategoriesDto: UpdateCategoriesDto) {
    return this.settingsService.updateCategories(updateCategoriesDto);
  }

  @Post('room-types')
  @ApiOperation({ summary: 'Create new room type' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Room type created successfully',
    schema: {
      example: {
        name: "Deluxe Room",
        description: "Luxury room with ocean view"
      }
    }
  })
  createRoomType(@Body() createRoomTypeDto: CreateRoomTypeDto): Promise<RoomType> {
    return this.settingsService.createRoomType(createRoomTypeDto);
  }

  @Get('room-types')
  @ApiOperation({ summary: 'Get all room types' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all room types' })
  findAllRoomTypes(): Promise<RoomType[]> {
    return this.settingsService.findAllRoomTypes();
  }

  @Get('room-types/:id')
  @ApiOperation({ summary: 'Get room type by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return room type' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Room type not found' })
  findRoomTypeById(@Param('id') id: string): Promise<RoomType> {
    return this.settingsService.findRoomTypeById(id);
  }

  @Patch('room-types/:id')
  @ApiOperation({ summary: 'Update room type' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Room type updated successfully',
    schema: {
      example: {
        name: "Premium Suite",
        description: "Upgraded luxury suite with additional amenities"
      }
    }
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Room type not found' })
  updateRoomType(
    @Param('id') id: string,
    @Body() updateRoomTypeDto: Partial<CreateRoomTypeDto>,
  ): Promise<RoomType> {
    return this.settingsService.updateRoomType(id, updateRoomTypeDto);
  }

  @Delete('room-types/:id')
  @ApiOperation({ summary: 'Delete room type' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Room type deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Room type not found' })
  deleteRoomType(@Param('id') id: string): Promise<void> {
    return this.settingsService.deleteRoomType(id);
  }
} 