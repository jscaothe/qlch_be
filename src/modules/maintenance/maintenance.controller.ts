import { Controller, Get, Post, Patch, Param, Body, Query, HttpStatus } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceStatusDto } from './dto/update-maintenance-status.dto';
import { MaintenanceStatus } from './entities/maintenance.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('maintenance')
@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get()
  @ApiOperation({ summary: 'Get all maintenance records' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: MaintenanceStatus })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all maintenance records' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: MaintenanceStatus,
    @Query('type') type?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.maintenanceService.findAll({
      page,
      limit,
      status,
      type,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create new maintenance record' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Maintenance record created successfully',
    schema: {
      example: {
        roomId: "550e8400-e29b-41d4-a716-446655440000",
        type: "Repair",
        description: "Fix air conditioner",
        status: "pending",
        scheduledDate: "2024-03-20T10:00:00Z",
        estimatedCost: 1000000
      }
    }
  })
  async create(@Body() createMaintenanceDto: CreateMaintenanceDto) {
    return this.maintenanceService.create(createMaintenanceDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update maintenance status' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Maintenance status updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Maintenance record not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateMaintenanceStatusDto: UpdateMaintenanceStatusDto,
  ) {
    return this.maintenanceService.updateStatus(id, updateMaintenanceStatusDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get maintenance record by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return maintenance record' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Maintenance record not found' })
  async findOne(@Param('id') id: string) {
    return this.maintenanceService.findOne(id);
  }
} 