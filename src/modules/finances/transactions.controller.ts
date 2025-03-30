import { Controller, Get, Post, Body, Param, Delete, Query, HttpStatus } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionType } from './enums/transaction-type.enum';
import { Transaction } from './entities/transaction.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('finances')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, enum: TransactionType })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Return all transactions',
    schema: {
      example: {
        transactions: [
          {
            id: "550e8400-e29b-41d4-a716-446655440000",
            type: "income",
            amount: 5000000,
            category: "Rent",
            description: "Monthly rent payment - Room 101",
            date: "2024-03-20T10:00:00Z",
            roomId: "550e8400-e29b-41d4-a716-446655440001",
            tenantId: "550e8400-e29b-41d4-a716-446655440002"
          }
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
        summary: {
          totalIncome: 5000000,
          totalExpense: 0,
          balance: 5000000
        }
      }
    }
  })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('type') type?: TransactionType,
  ) {
    return this.transactionsService.findAll(page, limit, type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return transaction details' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Transaction not found' })
  findOne(@Param('id') id: string): Promise<Transaction> {
    return this.transactionsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new transaction' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Transaction created successfully',
    schema: {
      example: {
        type: "expense",
        amount: 1000000,
        category: "Maintenance",
        description: "Fix air conditioner - Room 101",
        date: "2024-03-20T10:00:00Z",
        roomId: "550e8400-e29b-41d4-a716-446655440001"
      }
    }
  })
  create(@Body() createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    return this.transactionsService.create(createTransactionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete transaction' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Transaction deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Transaction not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.transactionsService.remove(id);
    return { message: 'Transaction deleted successfully' };
  }
} 