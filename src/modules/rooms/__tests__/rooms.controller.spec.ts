import { Test, TestingModule } from '@nestjs/testing';
import { RoomsController } from '../rooms.controller';
import { RoomsService } from '../rooms.service';
import { CreateRoomDto } from '../dto/create-room.dto';
import { RoomStatus } from '../enums/room-status.enum';

describe('RoomsController', () => {
  let controller: RoomsController;
  let service: RoomsService;

  const mockRoomsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [
        {
          provide: RoomsService,
          useValue: mockRoomsService,
        },
      ],
    }).compile();

    controller = module.get<RoomsController>(RoomsController);
    service = module.get<RoomsService>(RoomsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of rooms', async () => {
      const mockRooms = [
        {
          id: '1',
          name: 'Room 101',
          type: 'Standard',
          price: 1000,
          status: RoomStatus.VACANT,
        },
      ];
      const result = {
        data: mockRooms,
        meta: {
          hasMore: false,
          page: 1,
          limit: 10,
        },
      };
      mockRoomsService.findAll.mockResolvedValue(result);

      expect(await controller.findAll(1, 10)).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined, undefined);
    });

    it('should return filtered rooms when search is provided', async () => {
      const mockRooms = [
        {
          id: '1',
          name: 'Room 101',
          type: 'Standard',
          price: 1000,
          status: RoomStatus.VACANT,
        },
      ];
      const result = {
        data: mockRooms,
        meta: {
          hasMore: false,
          page: 1,
          limit: 10,
        },
      };
      mockRoomsService.findAll.mockResolvedValue(result);

      expect(await controller.findAll(1, 10, 'Room', RoomStatus.VACANT)).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith(1, 10, 'Room', RoomStatus.VACANT);
    });
  });

  describe('findOne', () => {
    it('should return a single room', async () => {
      const mockRoom = {
        id: '1',
        name: 'Room 101',
        type: 'Standard',
        price: 1000,
        status: RoomStatus.VACANT,
      };
      mockRoomsService.findOne.mockResolvedValue(mockRoom);

      expect(await controller.findOne('1')).toBe(mockRoom);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new room', async () => {
      const createRoomDto: CreateRoomDto = {
        name: 'Room 101',
        type: 'Standard',
        price: 1000,
        status: RoomStatus.VACANT,
      };

      const mockRoom = {
        id: '1',
        ...createRoomDto,
      };

      mockRoomsService.create.mockResolvedValue(mockRoom);

      expect(await controller.create(createRoomDto)).toBe(mockRoom);
      expect(service.create).toHaveBeenCalledWith(createRoomDto);
    });
  });

  describe('update', () => {
    it('should update a room', async () => {
      const updateRoomDto: Partial<CreateRoomDto> = {
        name: 'Room 101 Updated',
      };

      const mockRoom = {
        id: '1',
        name: 'Room 101',
        type: 'Standard',
        price: 1000,
        status: RoomStatus.VACANT,
      };

      mockRoomsService.update.mockResolvedValue(mockRoom);

      expect(await controller.update('1', updateRoomDto)).toBe(mockRoom);
      expect(service.update).toHaveBeenCalledWith('1', updateRoomDto);
    });
  });

  describe('remove', () => {
    it('should remove a room', async () => {
      mockRoomsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');
      
      expect(service.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual({ message: 'Room deleted successfully' });
    });
  });
}); 