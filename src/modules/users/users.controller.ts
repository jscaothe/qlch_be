import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole, UserStatus } from './entities/user.entity';

@ApiTags('users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all users',
    schema: {
      example: {
        users: [
          {
            id: 1,
            name: "Nguyễn Văn A",
            email: "nguyenvana@example.com",
            phone: "0901234567",
            role: "admin",
            status: "active",
            createdAt: "2024-03-20T10:00:00Z",
            updatedAt: "2024-03-20T10:00:00Z"
          }
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1
      }
    }
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  @ApiQuery({ name: 'status', required: false, enum: UserStatus })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('role') role?: UserRole,
    @Query('status') status?: UserStatus,
  ) {
    return this.usersService.findAll(page, limit, search, role, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return user by id',
    schema: {
      example: {
        id: 1,
        name: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        phone: "0901234567",
        role: "admin",
        status: "active",
        createdAt: "2024-03-20T10:00:00Z",
        updatedAt: "2024-03-20T10:00:00Z"
      }
    }
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User created successfully',
    schema: {
      example: {
        name: "Nguyễn Văn B",
        email: "nguyenvanb@example.com",
        phone: "0901234568",
        password: "password123",
        role: "staff",
        status: "active"
      }
    }
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ 
    status: 200, 
    description: 'User updated successfully',
    schema: {
      example: {
        name: "Nguyễn Văn B",
        email: "nguyenvanb@example.com",
        phone: "0901234568",
        role: "staff",
        status: "active"
      }
    }
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ 
    status: 200, 
    description: 'User deleted successfully',
    schema: {
      example: {
        message: "User deleted successfully"
      }
    }
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update user status' })
  @ApiResponse({ 
    status: 200, 
    description: 'User status updated successfully',
    schema: {
      example: {
        id: 1,
        status: "inactive",
        updatedAt: "2024-03-20T10:00:00Z"
      }
    }
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: Object.values(UserStatus),
          description: 'User status',
          example: 'inactive'
        },
      },
      required: ['status'],
    },
  })
  updateStatus(@Param('id') id: string, @Body('status') status: UserStatus) {
    if (!status || !Object.values(UserStatus).includes(status)) {
      throw new BadRequestException('Invalid status value');
    }
    return this.usersService.updateStatus(+id, status);
  }
} 