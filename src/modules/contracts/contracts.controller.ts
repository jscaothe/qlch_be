import { Controller, Get, Post, Body, Param, Delete, Query, HttpStatus } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { RenewContractDto } from './dto/renew-contract.dto';
import { TerminateContractDto } from './dto/terminate-contract.dto';
import { Contract } from './entities/contract.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('contracts')
@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all contracts' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Return all contracts',
    schema: {
      example: {
        data: [
          {
            id: "550e8400-e29b-41d4-a716-446655440000",
            tenant: {
              id: "550e8400-e29b-41d4-a716-446655440001",
              name: "Nguyễn Văn A",
              phone: "0901234567"
            },
            room: {
              id: "550e8400-e29b-41d4-a716-446655440002",
              name: "Room 101",
              roomType: {
                id: "1",
                name: "Deluxe"
              }
            },
            startDate: "2024-01-01",
            endDate: "2024-12-31",
            deposit: 10000000,
            monthlyRent: 5000000,
            terms: ["Thanh toán trước ngày 5 hàng tháng", "Không được nuôi thú cưng"],
            status: "active",
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
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.contractsService.findAll(page, limit, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contract by id' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Return contract by id',
    schema: {
      example: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        tenant: {
          id: "550e8400-e29b-41d4-a716-446655440001",
          name: "Nguyễn Văn A",
          phone: "0901234567"
        },
        room: {
          id: "550e8400-e29b-41d4-a716-446655440002",
          name: "Room 101",
          roomType: {
            id: "1",
            name: "Deluxe"
          }
        },
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        deposit: 10000000,
        monthlyRent: 5000000,
        terms: ["Thanh toán trước ngày 5 hàng tháng", "Không được nuôi thú cưng"],
        status: "active",
        createdAt: "2024-03-20T10:00:00Z",
        updatedAt: "2024-03-20T10:00:00Z"
      }
    }
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Contract not found' })
  findOne(@Param('id') id: string): Promise<Contract> {
    return this.contractsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new contract' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Contract created successfully',
    schema: {
      example: {
        tenantId: "550e8400-e29b-41d4-a716-446655440001",
        roomId: "550e8400-e29b-41d4-a716-446655440002",
        startDate: "2024-04-01",
        endDate: "2025-03-31",
        deposit: 10000000,
        monthlyRent: 5000000,
        terms: ["Thanh toán trước ngày 5 hàng tháng", "Không được nuôi thú cưng"]
      }
    }
  })
  create(@Body() createContractDto: CreateContractDto): Promise<Contract> {
    return this.contractsService.create(createContractDto);
  }

  @Post(':id')
  @ApiOperation({ summary: 'Update contract' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Contract updated successfully',
    schema: {
      example: {
        monthlyRent: 5500000,
        terms: ["Thanh toán trước ngày 5 hàng tháng", "Không được nuôi thú cưng", "Không được hút thuốc trong phòng"]
      }
    }
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Contract not found' })
  update(
    @Param('id') id: string,
    @Body() updateContractDto: Partial<CreateContractDto>,
  ): Promise<Contract> {
    return this.contractsService.update(id, updateContractDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete contract' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Contract deleted successfully',
    schema: {
      example: {
        message: "Contract deleted successfully"
      }
    }
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Contract not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.contractsService.remove(id);
    return { message: 'Contract deleted successfully' };
  }

  @Post(':id/renew')
  @ApiOperation({ summary: 'Renew contract' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Contract renewed successfully',
    schema: {
      example: {
        newEndDate: "2025-12-31",
        newMonthlyRent: 5500000
      }
    }
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Contract not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Only active contracts can be renewed' })
  renew(
    @Param('id') id: string,
    @Body() renewData: RenewContractDto,
  ): Promise<Contract> {
    return this.contractsService.renew(id, renewData.newEndDate, renewData.newMonthlyRent);
  }

  @Post(':id/terminate')
  @ApiOperation({ summary: 'Terminate contract' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Contract terminated successfully',
    schema: {
      example: {
        reason: "Chuyển công tác",
        terminationDate: "2024-06-30"
      }
    }
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Contract not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Only active contracts can be terminated' })
  terminate(
    @Param('id') id: string,
    @Body() terminateData: TerminateContractDto,
  ): Promise<Contract> {
    return this.contractsService.terminate(id, terminateData.reason, terminateData.terminationDate);
  }
} 