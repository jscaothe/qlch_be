import { Test, TestingModule } from '@nestjs/testing';
import { RoomsController } from '../rooms.controller';
import { RoomsService } from '../rooms.service';
import { CreateRoomDto } from '../dto/create-room.dto';
import { RoomStatus } from '../enums/room-status.enum';

describe('RoomsController', () => {
  let controller: RoomsController;
  let service: RoomsService;

  const mockRoomsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of rooms', async () => {
      const result = {
        data: [
          {
            id: '1',
            name: 'Room 1',
            roomType: {
              id: '1',
              name: 'Standard',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            price: 1000,
            status: RoomStatus.VACANT,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        meta: {
          page: 1,
          limit: 10,
          hasMore: false,
        },
      };

      mockRoomsService.findAll.mockResolvedValue(result);

      expect(await controller.findAll(1, 10, 'Room')).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith(1, 10, 'Room', undefined);
    });

    it('should return filtered rooms when search is provided', async () => {
      const mockRooms = [
        {
          id: '1',
          name: 'Room 101',
          roomType: {
            id: '1',
            name: 'Standard',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          price: 1000,
          status: RoomStatus.VACANT,
          createdAt: new Date(),
          updatedAt: new Date(),
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
    it('should return a room', async () => {
      const result = {
        id: '1',
        name: 'Room 1',
        roomType: {
          id: '1',
          name: 'Standard',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        price: 1000,
        status: RoomStatus.VACANT,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRoomsService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a room', async () => {
      const createRoomDto: CreateRoomDto = {
        name: 'Room 1',
        roomTypeId: '1',
        price: 1000,
        status: RoomStatus.VACANT,
        floor: 1,
        area: 50,
        description: 'Standard room',
        images: ['https://example.com/image1.jpg'],
        videos: ['https://example.com/video1.mp4'],
      };

      const result = {
        id: '1',
        ...createRoomDto,
        roomType: {
          id: '1',
          name: 'Standard',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRoomsService.create.mockResolvedValue(result);

      expect(await controller.create(createRoomDto)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(createRoomDto);
    });
  });

  describe('update', () => {
    it('should update a room', async () => {
      const updateRoomDto: Partial<CreateRoomDto> = {
        price: 2000,
        roomTypeId: '2',
      };

      const result = {
        id: '1',
        name: 'Room 1',
        roomType: {
          id: '2',
          name: 'Deluxe',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        price: 2000,
        status: RoomStatus.VACANT,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRoomsService.update.mockResolvedValue(result);

      expect(await controller.update('1', updateRoomDto)).toBe(result);
      expect(service.update).toHaveBeenCalledWith('1', updateRoomDto);
    });
  });

  describe('remove', () => {
    it('should remove a room', async () => {
      const result = {
        id: '1',
        name: 'Room 1',
        roomType: {
          id: '1',
          name: 'Standard',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        price: 1000,
        status: RoomStatus.VACANT,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRoomsService.remove.mockResolvedValue(result);

      expect(await controller.remove('1')).toBe(result);
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
}); 