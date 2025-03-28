import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomStatus } from './enums/room-status.enum';

@Injectable()
export class RoomsService {
  constructor(private readonly em: EntityManager) {}

  async findAll(page: number, limit: number, search?: string, status?: RoomStatus) {
    const offset = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.$or = [
        { name: { $like: `%${search}%` } },
        { type: { $like: `%${search}%` } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const rooms = await this.em.find(Room, where, {
      limit,
      offset,
    });

    const total = await this.em.count(Room, where);

    return {
      data: rooms,
      meta: {
        hasMore: offset + rooms.length < total,
        page,
        limit,
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
    const room = this.em.create(Room, createRoomDto);
    await this.em.persistAndFlush(room);
    return room;
  }

  async update(id: string, updateRoomDto: Partial<CreateRoomDto>) {
    const room = await this.findOne(id);
    Object.assign(room, updateRoomDto);
    await this.em.persistAndFlush(room);
    return room;
  }

  async remove(id: string) {
    const room = await this.findOne(id);
    await this.em.removeAndFlush(room);
  }

  async updateStatus(id: string, status: RoomStatus): Promise<Room> {
    const room = await this.findOne(id);
    room.status = status;
    await this.em.persistAndFlush(room);
    return room;
  }
} 