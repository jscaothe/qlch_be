import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/core';
import { RoomsService } from '../rooms.service';
import { Room } from '../entities/room.entity';
import { CreateRoomDto } from '../dto/create-room.dto';
import { NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { RoomStatus } from '../enums/room-status.enum';
import { RoomType } from '../../settings/entities/room-type.entity';

describe('RoomsService', () => {
  let service: RoomsService;
  let em: EntityManager;

  const mockEntityManager = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    persistAndFlush: jest.fn(),
    removeAndFlush: jest.fn(),
    count: jest.fn(),
    assign: jest.fn(),
  };

  const mockRoom = {
    id: '1',
    name: 'Room 101',
    roomType: { id: '1', name: 'Standard' },
    floor: 1,
    area: 50,
    price: 1000000,
    status: RoomStatus.VACANT,
    description: 'Standard room',
    amenities: ['AC', 'TV'],
    images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    videos: ['https://example.com/video1.mp4', 'https://example.com/video2.mp4'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
    em = module.get<EntityManager>(EntityManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of rooms', async () => {
      const mockRooms = [
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
      ];

      mockEntityManager.find.mockResolvedValue(mockRooms);
      mockEntityManager.count.mockResolvedValue(1);

      const result = await service.findAll(1, 10);

      expect(result.data).toEqual(mockRooms);
      expect(result.meta).toEqual({
        hasMore: false,
        page: 1,
        limit: 10,
      });
      expect(em.find).toHaveBeenCalledWith(Room, {}, {
        limit: 10,
        offset: 0,
      });
      expect(em.count).toHaveBeenCalledWith(Room, {});
    });

    it('should return filtered rooms when search is provided', async () => {
      const mockRooms = [
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
      ];

      mockEntityManager.find.mockResolvedValue(mockRooms);
      mockEntityManager.count.mockResolvedValue(1);

      const result = await service.findAll(1, 10, 'Test');

      expect(result.data).toEqual(mockRooms);
      expect(result.meta).toEqual({
        hasMore: false,
        page: 1,
        limit: 10,
      });
      expect(em.find).toHaveBeenCalledWith(Room, {
        $or: [
          { name: { $like: '%Test%' } },
          { 'roomType.name': { $like: '%Test%' } },
        ],
      }, {
        limit: 10,
        offset: 0,
      });
      expect(em.count).toHaveBeenCalledWith(Room, {
        $or: [
          { name: { $like: '%Test%' } },
          { 'roomType.name': { $like: '%Test%' } },
        ],
      });
    });
  });

  describe('findOne', () => {
    it('should return a single room', async () => {
      const mockRoom = {
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

      mockEntityManager.findOne.mockResolvedValue(mockRoom);

      const result = await service.findOne('1');

      expect(result).toEqual(mockRoom);
      expect(em.findOne).toHaveBeenCalledWith(Room, { id: '1' });
    });
  });

  describe('create', () => {
    it('should create a new room', async () => {
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

      const mockRoomType = {
        id: '1',
        name: 'Standard',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockRoom = {
        id: expect.any(String),
        name: 'Room 1',
        roomType: mockRoomType,
        price: 1000,
        status: RoomStatus.VACANT,
        floor: 1,
        area: 50,
        description: 'Standard room',
        images: ['https://example.com/image1.jpg'],
        videos: ['https://example.com/video1.mp4'],
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      };

      mockEntityManager.findOne.mockResolvedValue(mockRoomType);
      mockEntityManager.create.mockReturnValue(mockRoom);
      mockEntityManager.persistAndFlush.mockResolvedValue(undefined);

      const result = await service.create(createRoomDto);

      expect(result).toEqual(mockRoom);
      expect(em.findOne).toHaveBeenCalledWith(RoomType, { id: createRoomDto.roomTypeId });
      expect(em.create).toHaveBeenCalledWith(Room, {
        id: expect.any(String),
        ...createRoomDto,
        roomType: mockRoomType,
      });
      expect(em.persistAndFlush).toHaveBeenCalledWith(mockRoom);
    });

    it('should throw NotFoundException when room type not found', async () => {
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

      mockEntityManager.findOne.mockResolvedValue(null);

      await expect(service.create(createRoomDto)).rejects.toThrow(NotFoundException);
      expect(em.findOne).toHaveBeenCalledWith(RoomType, { id: createRoomDto.roomTypeId });
    });
  });

  describe('update', () => {
    it('should update a room', async () => {
      const updateRoomDto: Partial<CreateRoomDto> = {
        price: 2000,
        roomTypeId: '2',
      };

      const mockRoom = {
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

      const mockRoomType = {
        id: '2',
        name: 'Deluxe',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedRoom = {
        ...mockRoom,
        price: 2000,
        roomType: mockRoomType,
      };

      mockEntityManager.findOne
        .mockResolvedValueOnce(mockRoom)
        .mockResolvedValueOnce(mockRoomType);
      mockEntityManager.persistAndFlush.mockResolvedValue(undefined);

      const result = await service.update('1', updateRoomDto);

      expect(result).toEqual(updatedRoom);
      expect(em.findOne).toHaveBeenCalledWith(Room, { id: '1' });
      expect(em.findOne).toHaveBeenCalledWith(RoomType, { id: updateRoomDto.roomTypeId });
      expect(em.persistAndFlush).toHaveBeenCalledWith(expect.objectContaining({
        price: 2000,
        roomType: mockRoomType,
      }));
    });

    it('should throw NotFoundException when room is not found', async () => {
      const updateRoomDto: Partial<CreateRoomDto> = {
        price: 2000,
      };

      mockEntityManager.findOne.mockResolvedValue(null);

      await expect(service.update('1', updateRoomDto)).rejects.toThrow(NotFoundException);
      expect(em.findOne).toHaveBeenCalledWith(Room, { id: '1' });
    });

    it('should throw NotFoundException when room type is not found', async () => {
      const updateRoomDto: Partial<CreateRoomDto> = {
        price: 2000,
        roomTypeId: '2',
      };

      const mockRoom = {
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

      mockEntityManager.findOne
        .mockResolvedValueOnce(mockRoom)
        .mockResolvedValueOnce(null);

      await expect(service.update('1', updateRoomDto)).rejects.toThrow(NotFoundException);
      expect(em.findOne).toHaveBeenCalledWith(Room, { id: '1' });
      expect(em.findOne).toHaveBeenCalledWith(RoomType, { id: updateRoomDto.roomTypeId });
    });
  });

  describe('remove', () => {
    it('should remove a room', async () => {
      const mockRoom = {
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

      mockEntityManager.findOne.mockResolvedValue(mockRoom);
      mockEntityManager.removeAndFlush.mockResolvedValue(undefined);

      const result = await service.remove('1');

      expect(result).toEqual(mockRoom);
      expect(em.findOne).toHaveBeenCalledWith(Room, { id: '1' });
      expect(em.removeAndFlush).toHaveBeenCalledWith(mockRoom);
    });

    it('should throw NotFoundException when room is not found', async () => {
      mockEntityManager.findOne.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
      expect(em.findOne).toHaveBeenCalledWith(Room, { id: '1' });
    });
  });

  describe('updateStatus', () => {
    it('should update room status', async () => {
      mockEntityManager.findOne.mockResolvedValue(mockRoom);
      mockEntityManager.persistAndFlush.mockResolvedValue(undefined);

      const result = await service.updateStatus(mockRoom.id, RoomStatus.OCCUPIED);

      expect(result.status).toBe(RoomStatus.OCCUPIED);
      expect(mockEntityManager.persistAndFlush).toHaveBeenCalledWith(mockRoom);
    });

    it('should throw NotFoundException when updating status of non-existent room', async () => {
      mockEntityManager.findOne.mockResolvedValue(null);

      await expect(service.updateStatus('non-existent-id', RoomStatus.OCCUPIED)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
}); 