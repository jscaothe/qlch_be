import { Test, TestingModule } from '@nestjs/testing';
import { RoomTypeService } from '../room-type.service';
import { EntityManager } from '@mikro-orm/core';
import { NotFoundException } from '@nestjs/common';
import { RoomType } from '../entities/room-type.entity';
import { CreateRoomTypeDto } from '../dto/create-room-type.dto';
import { v4 as uuidv4 } from 'uuid';

describe('RoomType Service', () => {
  let service: RoomTypeService;
  let mockEm: EntityManager;

  const mockEntityManager = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    persistAndFlush: jest.fn(),
    removeAndFlush: jest.fn(),
    assign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomTypeService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<RoomTypeService>(RoomTypeService);
    mockEm = module.get<EntityManager>(EntityManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of room types', async () => {
      const mockRoomTypes = [
        {
          id: '1',
          name: 'Studio',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockEntityManager.find.mockResolvedValue(mockRoomTypes);

      const result = await service.findAll();

      expect(result).toEqual(mockRoomTypes);
      expect(mockEm.find).toHaveBeenCalledWith(RoomType, {});
    });
  });

  describe('findOne', () => {
    it('should return a room type', async () => {
      const mockRoomType = {
        id: '1',
        name: 'Studio',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockEntityManager.findOne.mockResolvedValue(mockRoomType);

      const result = await service.findOne('1');

      expect(result).toEqual(mockRoomType);
      expect(mockEm.findOne).toHaveBeenCalledWith(RoomType, { id: '1' });
    });

    it('should throw NotFoundException when room type is not found', async () => {
      mockEntityManager.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
      expect(mockEm.findOne).toHaveBeenCalledWith(RoomType, { id: '1' });
    });
  });

  describe('create', () => {
    it('should create a room type', async () => {
      const createDto = { name: 'Studio' };
      const mockRoomType = {
        id: '1',
        name: 'Studio',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockEntityManager.create.mockReturnValue(mockRoomType);
      mockEntityManager.persistAndFlush.mockResolvedValue(undefined);

      const result = await service.create(createDto);

      expect(result).toEqual(mockRoomType);
      expect(mockEm.create).toHaveBeenCalledWith(RoomType, createDto);
      expect(mockEm.persistAndFlush).toHaveBeenCalledWith(mockRoomType);
    });
  });

  describe('updateRoomType', () => {
    it('should update a room type', async () => {
      const updateDto = { name: 'Updated Studio' };
      const mockRoomType = {
        id: '1',
        name: 'Studio',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedRoomType = {
        ...mockRoomType,
        name: updateDto.name,
      };

      mockEntityManager.findOne.mockResolvedValue(mockRoomType);
      mockEntityManager.assign.mockReturnValue(updatedRoomType);
      mockEntityManager.persistAndFlush.mockResolvedValue(undefined);

      const result = await service.updateRoomType('1', updateDto);

      expect(result).toEqual(updatedRoomType);
      expect(mockEm.assign).toHaveBeenCalledWith(mockRoomType, updateDto);
      expect(mockEm.persistAndFlush).toHaveBeenCalled();
    });

    it('should throw NotFoundException when room type is not found', async () => {
      const updateDto = { name: 'Updated Studio' };

      mockEntityManager.findOne.mockResolvedValue(null);

      await expect(service.updateRoomType('1', updateDto)).rejects.toThrow(NotFoundException);
      expect(mockEm.findOne).toHaveBeenCalledWith(RoomType, { id: '1' });
    });
  });

  describe('remove', () => {
    it('should remove a room type', async () => {
      const mockRoomType = {
        id: '1',
        name: 'Studio',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockEntityManager.findOne.mockResolvedValue(mockRoomType);
      mockEntityManager.removeAndFlush.mockResolvedValue(undefined);

      const result = await service.remove('1');

      expect(result).toEqual(mockRoomType);
      expect(mockEm.findOne).toHaveBeenCalledWith(RoomType, { id: '1' });
      expect(mockEm.removeAndFlush).toHaveBeenCalledWith(mockRoomType);
    });

    it('should throw NotFoundException when room type is not found', async () => {
      mockEntityManager.findOne.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
      expect(mockEm.findOne).toHaveBeenCalledWith(RoomType, { id: '1' });
    });
  });
}); 