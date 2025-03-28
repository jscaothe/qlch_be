import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/core';
import { RoomsService } from '../rooms.service';
import { Room } from '../entities/room.entity';
import { CreateRoomDto } from '../dto/create-room.dto';
import { NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { RoomStatus } from '../enums/room-status.enum';

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
  };

  const mockRoom: Room = {
    id: uuidv4(),
    name: 'Test Room',
    type: 'Standard',
    floor: 1,
    area: 20,
    price: 1000,
    status: RoomStatus.VACANT,
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
          type: 'Standard',
          price: 1000,
          status: 'vacant' as RoomStatus,
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
          type: 'Standard',
          price: 1000,
          status: 'vacant' as RoomStatus,
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
          { type: { $like: '%Test%' } },
        ],
      }, {
        limit: 10,
        offset: 0,
      });
      expect(em.count).toHaveBeenCalledWith(Room, {
        $or: [
          { name: { $like: '%Test%' } },
          { type: { $like: '%Test%' } },
        ],
      });
    });
  });

  describe('findOne', () => {
    it('should return a single room', async () => {
      const mockRoom = {
        id: '1',
        name: 'Room 1',
        type: 'Standard',
        price: 1000,
        status: 'vacant' as RoomStatus,
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
        type: 'Standard',
        price: 1000,
        status: 'vacant' as RoomStatus,
      };

      const mockRoom = {
        id: '1',
        ...createRoomDto,
      };

      mockEntityManager.create.mockReturnValue(mockRoom);
      mockEntityManager.persistAndFlush.mockResolvedValue(undefined);

      const result = await service.create(createRoomDto);

      expect(result).toEqual(mockRoom);
      expect(em.create).toHaveBeenCalledWith(Room, createRoomDto);
      expect(em.persistAndFlush).toHaveBeenCalledWith(mockRoom);
    });
  });

  describe('update', () => {
    it('should update a room', async () => {
      const updateRoomDto: Partial<CreateRoomDto> = {
        price: 2000,
      };

      const mockRoom = {
        id: '1',
        name: 'Room 1',
        type: 'Standard',
        price: 1000,
        status: 'vacant' as RoomStatus,
      };

      mockEntityManager.findOne.mockResolvedValue(mockRoom);
      mockEntityManager.persistAndFlush.mockResolvedValue(undefined);

      const result = await service.update('1', updateRoomDto);

      expect(result).toEqual({ ...mockRoom, ...updateRoomDto });
      expect(em.findOne).toHaveBeenCalledWith(Room, { id: '1' });
      expect(em.persistAndFlush).toHaveBeenCalledWith({
        ...mockRoom,
        ...updateRoomDto,
      });
    });
  });

  describe('remove', () => {
    it('should remove a room', async () => {
      const mockRoom = {
        id: '1',
        name: 'Room 1',
        type: 'Standard',
        price: 1000,
        status: 'vacant' as RoomStatus,
      };

      mockEntityManager.findOne.mockResolvedValue(mockRoom);
      mockEntityManager.removeAndFlush.mockResolvedValue(undefined);

      await service.remove('1');

      expect(em.findOne).toHaveBeenCalledWith(Room, { id: '1' });
      expect(em.removeAndFlush).toHaveBeenCalledWith(mockRoom);
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