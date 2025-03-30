import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomStatus } from './enums/room-status.enum';
import { RoomType } from '../settings/entities/room-type.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RoomsService {
  constructor(private readonly em: EntityManager) {}

  async findAll(page = 1, limit = 10, search?: string, status?: RoomStatus) {
    const offset = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.$or = [
        { name: { $like: `%${search}%` } },
        { 'roomType.name': { $like: `%${search}%` } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      this.em.find(Room, where, {
        limit,
        offset,
      }),
      this.em.count(Room, where),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        hasMore: total > page * limit,
      },
    };
  }

  async findOne(id: string) {
    const room = await this.em.findOne(Room, { id });
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return room;
  }

  async create(createRoomDto: CreateRoomDto) {
    const roomType = await this.em.findOne(RoomType, { id: createRoomDto.roomTypeId });
    if (!roomType) {
      throw new NotFoundException(`RoomType with ID ${createRoomDto.roomTypeId} not found`);
    }

    const room = this.em.create(Room, {
      id: uuidv4(),
      ...createRoomDto,
      roomType,
    });

    await this.em.persistAndFlush(room);
    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    const room = await this.findOne(id);
    let roomType = room.roomType;

    if (updateRoomDto.roomTypeId) {
      roomType = await this.em.findOne(RoomType, { id: updateRoomDto.roomTypeId });
      if (!roomType) {
        throw new NotFoundException(`RoomType with ID ${updateRoomDto.roomTypeId} not found`);
      }
      room.roomType = roomType;
    }

    const { roomTypeId, ...updateData } = updateRoomDto;
    Object.assign(room, updateData);
    await this.em.persistAndFlush(room);
    return room;
  }

  async remove(id: string) {
    const room = await this.findOne(id);
    await this.em.removeAndFlush(room);
    return room;
  }

  async updateStatus(id: string, status: RoomStatus): Promise<Room> {
    const room = await this.findOne(id);
    room.status = status;
    await this.em.persistAndFlush(room);
    return room;
  }
} 