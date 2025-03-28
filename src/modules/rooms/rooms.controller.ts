import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomStatus } from './enums/room-status.enum';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all rooms' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all rooms' })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('status') status?: RoomStatus,
  ) {
    return this.roomsService.findAll(page, limit, search, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return room by id' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Room not found' })
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new room' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Room created successfully' })
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update room' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Room updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Room not found' })
  update(@Param('id') id: string, @Body() updateRoomDto: Partial<CreateRoomDto>) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete room' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Room deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Room not found' })
  async remove(@Param('id') id: string) {
    await this.roomsService.remove(id);
    return { message: 'Room deleted successfully' };
  }
} 