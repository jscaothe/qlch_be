import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomStatus } from './enums/room-status.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('rooms')
@Controller('api/rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: RoomStatus })
  @ApiOperation({ summary: 'Get all rooms' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Return all rooms',
    schema: {
      example: {
        data: [
          {
            id: "550e8400-e29b-41d4-a716-446655440000",
            name: "Room 101",
            roomType: {
              id: "550e8400-e29b-41d4-a716-446655440001",
              name: "Deluxe Room",
              description: "Luxury room with city view"
            },
            price: 500000,
            status: "vacant",
            description: "Standard room with city view",
            floor: 1,
            area: 30,
            amenities: ["Air Conditioner", "TV", "Refrigerator"],
            images: [
              "https://example.com/rooms/101/image1.jpg",
              "https://example.com/rooms/101/image2.jpg"
            ],
            videos: [
              "https://example.com/rooms/101/video1.mp4",
              "https://example.com/rooms/101/video2.mp4"
            ],
            createdAt: "2024-03-20T10:00:00Z",
            updatedAt: "2024-03-20T10:00:00Z"
          }
        ],
        meta: {
          page: 1,
          limit: 10,
          hasMore: false
        }
      }
    }
  })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('status') status?: RoomStatus,
  ) {
    return this.roomsService.findAll(page, limit, search, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room by id' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Return room by id',
    schema: {
      example: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        name: "Room 101",
        roomType: {
          id: "550e8400-e29b-41d4-a716-446655440001",
          name: "Deluxe Room",
          description: "Luxury room with city view"
        },
        price: 500000,
        status: "vacant",
        description: "Standard room with city view",
        floor: 1,
        area: 30,
        amenities: ["Air Conditioner", "TV", "Refrigerator"],
        images: [
          "https://example.com/rooms/101/image1.jpg",
          "https://example.com/rooms/101/image2.jpg"
        ],
        videos: [
          "https://example.com/rooms/101/video1.mp4",
          "https://example.com/rooms/101/video2.mp4"
        ],
        createdAt: "2024-03-20T10:00:00Z",
        updatedAt: "2024-03-20T10:00:00Z"
      }
    }
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Room not found' })
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new room' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Room created successfully',
    schema: {
      example: {
        name: "Room 101",
        roomTypeId: "550e8400-e29b-41d4-a716-446655440000",
        price: 500000,
        status: "vacant",
        description: "Standard room with city view",
        floor: 1,
        area: 30,
        amenities: ["Air Conditioner", "TV", "Refrigerator"],
        images: [
          "https://example.com/rooms/101/image1.jpg",
          "https://example.com/rooms/101/image2.jpg"
        ],
        videos: [
          "https://example.com/rooms/101/video1.mp4",
          "https://example.com/rooms/101/video2.mp4"
        ]
      }
    }
  })
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update room' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Room updated successfully',
    schema: {
      example: {
        price: 600000,
        status: "maintenance",
        description: "Standard room with city view (Recently renovated)",
        amenities: ["Air Conditioner", "TV", "Refrigerator", "Water Heater"],
        images: [
          "https://example.com/rooms/101/image1.jpg",
          "https://example.com/rooms/101/image2.jpg",
          "https://example.com/rooms/101/image3.jpg"
        ],
        videos: [
          "https://example.com/rooms/101/video1.mp4",
          "https://example.com/rooms/101/video2.mp4"
        ]
      }
    }
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Room not found' })
  update(@Param('id') id: string, @Body() updateRoomDto: Partial<CreateRoomDto>) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete room' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Room deleted successfully',
    schema: {
      example: {
        message: "Room deleted successfully"
      }
    }
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Room not found' })
  remove(@Param('id') id: string) {
    return this.roomsService.remove(id);
  }
} 