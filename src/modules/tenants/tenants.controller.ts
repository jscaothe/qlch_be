import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TenantStatus } from './enums/tenant-status.enum';

@ApiTags('tenants')
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tenants' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Return all tenants',
    schema: {
      example: {
        data: [
          {
            id: "550e8400-e29b-41d4-a716-446655440000",
            name: "Nguyễn Văn A",
            phone: "0901234567",
            email: "nguyenvana@example.com",
            identityCard: "123456789012",
            dateOfBirth: "1990-01-01",
            address: "123 Đường ABC, Quận 1, TP.HCM",
            startDate: "2024-01-01",
            endDate: "2024-12-31",
            status: "active",
            room: {
              id: "550e8400-e29b-41d4-a716-446655440001",
              name: "Room 101",
              roomType: {
                id: "1",
                name: "Deluxe"
              }
            },
            createdAt: "2024-03-20T10:00:00Z",
            updatedAt: "2024-03-20T10:00:00Z"
          }
        ],
        meta: {
          hasMore: false,
          page: 1,
          limit: 10
        }
      }
    }
  })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    return this.tenantsService.findAll(page, limit, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tenant by id' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Return tenant by id',
    schema: {
      example: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        name: "Nguyễn Văn A",
        phone: "0901234567",
        email: "nguyenvana@example.com",
        identityCard: "123456789012",
        dateOfBirth: "1990-01-01",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        status: "active",
        room: {
          id: "550e8400-e29b-41d4-a716-446655440001",
          name: "Room 101",
          roomType: {
            id: "1",
            name: "Deluxe"
          }
        },
        createdAt: "2024-03-20T10:00:00Z",
        updatedAt: "2024-03-20T10:00:00Z"
      }
    }
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tenant not found' })
  findOne(@Param('id') id: string) {
    return this.tenantsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new tenant' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Tenant created successfully',
    schema: {
      example: {
        name: "Nguyễn Văn B",
        phone: "0901234568",
        email: "nguyenvanb@example.com",
        identityCard: "123456789013",
        dateOfBirth: "1992-02-02",
        address: "456 Đường XYZ, Quận 2, TP.HCM",
        startDate: "2024-04-01",
        endDate: "2025-03-31",
        roomId: "550e8400-e29b-41d4-a716-446655440001"
      }
    }
  })
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantsService.create(createTenantDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update tenant' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Tenant updated successfully',
    schema: {
      example: {
        phone: "0901234569",
        email: "newmail@example.com",
        address: "789 Đường MNO, Quận 3, TP.HCM",
        endDate: "2025-06-30"
      }
    }
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tenant not found' })
  update(@Param('id') id: string, @Body() updateTenantDto: Partial<CreateTenantDto>) {
    return this.tenantsService.update(id, updateTenantDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update tenant status' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Tenant status updated successfully',
    schema: {
      example: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        status: "inactive",
        updatedAt: "2024-03-20T10:00:00Z"
      }
    }
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tenant not found' })
  updateStatus(@Param('id') id: string, @Body('status') status: TenantStatus) {
    return this.tenantsService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete tenant' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Tenant deleted successfully',
    schema: {
      example: {
        message: "Tenant deleted successfully"
      }
    }
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tenant not found' })
  async remove(@Param('id') id: string) {
    await this.tenantsService.remove(id);
    return { message: 'Tenant deleted successfully' };
  }
} 