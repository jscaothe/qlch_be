import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TenantStatus } from './enums/tenant-status.enum';

@ApiTags('tenants')
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tenants' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all tenants' })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    return this.tenantsService.findAll(page, limit, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tenant by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return tenant by id' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tenant not found' })
  findOne(@Param('id') id: string) {
    return this.tenantsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new tenant' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Tenant created successfully' })
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantsService.create(createTenantDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update tenant' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Tenant updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tenant not found' })
  update(@Param('id') id: string, @Body() updateTenantDto: Partial<CreateTenantDto>) {
    return this.tenantsService.update(id, updateTenantDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update tenant status' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Tenant status updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tenant not found' })
  updateStatus(@Param('id') id: string, @Body('status') status: TenantStatus) {
    return this.tenantsService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete tenant' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Tenant deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tenant not found' })
  async remove(@Param('id') id: string) {
    await this.tenantsService.remove(id);
    return { message: 'Tenant deleted successfully' };
  }
} 