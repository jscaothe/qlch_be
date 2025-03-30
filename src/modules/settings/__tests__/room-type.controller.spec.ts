import { Test, TestingModule } from '@nestjs/testing';
import { SettingsController } from '../settings.controller';
import { SettingsService } from '../settings.service';
import { CreateRoomTypeDto } from '../dto/create-room-type.dto';
import { RoomType } from '../entities/room-type.entity';
import { v4 as uuidv4 } from 'uuid';

describe('RoomType Controller', () => {
  let controller: SettingsController;
  let service: SettingsService;

  const mockSettingsService = {
    createRoomType: jest.fn(),
    findAllRoomTypes: jest.fn(),
    findRoomTypeById: jest.fn(),
    updateRoomType: jest.fn(),
    deleteRoomType: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [
        {
          provide: SettingsService,
          useValue: mockSettingsService,
        },
      ],
    }).compile();

    controller = module.get<SettingsController>(SettingsController);
    service = module.get<SettingsService>(SettingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createRoomType', () => {
    it('should create a new room type', async () => {
      const createRoomTypeDto: CreateRoomTypeDto = {
        name: 'Studio',
        description: 'Studio apartment',
      };

      const mockRoomType: RoomType = {
        id: uuidv4(),
        ...createRoomTypeDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockSettingsService.createRoomType.mockResolvedValue(mockRoomType);

      const result = await controller.createRoomType(createRoomTypeDto);

      expect(result).toEqual(mockRoomType);
      expect(mockSettingsService.createRoomType).toHaveBeenCalledWith(createRoomTypeDto);
    });
  });

  describe('findAllRoomTypes', () => {
    it('should return all room types', async () => {
      const mockRoomTypes = [
        { id: '1', name: 'Studio' },
        { id: '2', name: '1 Bedroom' },
      ];

      mockSettingsService.findAllRoomTypes.mockResolvedValue(mockRoomTypes);

      const result = await controller.findAllRoomTypes();

      expect(result).toEqual(mockRoomTypes);
      expect(mockSettingsService.findAllRoomTypes).toHaveBeenCalled();
    });
  });

  describe('findRoomTypeById', () => {
    it('should return a room type by id', async () => {
      const mockRoomType = { id: '1', name: 'Studio' };

      mockSettingsService.findRoomTypeById.mockResolvedValue(mockRoomType);

      const result = await controller.findRoomTypeById('1');

      expect(result).toEqual(mockRoomType);
      expect(mockSettingsService.findRoomTypeById).toHaveBeenCalledWith('1');
    });
  });

  describe('updateRoomType', () => {
    it('should update a room type', async () => {
      const mockRoomType = { id: '1', name: 'Studio' };
      const updateDto = { name: 'Updated Studio' };

      mockSettingsService.updateRoomType.mockResolvedValue({ ...mockRoomType, ...updateDto });

      const result = await controller.updateRoomType('1', updateDto);

      expect(result.name).toBe(updateDto.name);
      expect(mockSettingsService.updateRoomType).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('deleteRoomType', () => {
    it('should delete a room type', async () => {
      mockSettingsService.deleteRoomType.mockResolvedValue(undefined);

      await controller.deleteRoomType('1');

      expect(mockSettingsService.deleteRoomType).toHaveBeenCalledWith('1');
    });
  });
}); 