import { Controller, Get, Post, Body, Param, Delete, Query, HttpStatus } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { RenewContractDto } from './dto/renew-contract.dto';
import { TerminateContractDto } from './dto/terminate-contract.dto';
import { Contract } from './entities/contract.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('contracts')
@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all contracts' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all contracts' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.contractsService.findAll(page, limit, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contract by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return contract by id' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Contract not found' })
  findOne(@Param('id') id: string): Promise<Contract> {
    return this.contractsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new contract' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Contract created successfully' })
  create(@Body() createContractDto: CreateContractDto): Promise<Contract> {
    return this.contractsService.create(createContractDto);
  }

  @Post(':id')
  @ApiOperation({ summary: 'Update contract' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Contract updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Contract not found' })
  update(
    @Param('id') id: string,
    @Body() updateContractDto: Partial<CreateContractDto>,
  ): Promise<Contract> {
    return this.contractsService.update(id, updateContractDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete contract' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Contract deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Contract not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.contractsService.remove(id);
    return { message: 'Contract deleted successfully' };
  }

  @Post(':id/renew')
  @ApiOperation({ summary: 'Renew contract' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Contract renewed successfully' })
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
  @ApiResponse({ status: HttpStatus.OK, description: 'Contract terminated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Contract not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Only active contracts can be terminated' })
  terminate(
    @Param('id') id: string,
    @Body() terminateData: TerminateContractDto,
  ): Promise<Contract> {
    return this.contractsService.terminate(id, terminateData.reason, terminateData.terminationDate);
  }
} 