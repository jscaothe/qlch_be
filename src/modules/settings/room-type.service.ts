import { EntityManager } from '@mikro-orm/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RoomType } from './entities/room-type.entity';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';

@Injectable()
export class RoomTypeService {
  constructor(private readonly em: EntityManager) {}

  async findAll() {
    return this.em.find(RoomType, {});
  }

  async findOne(id: string) {
    const roomType = await this.em.findOne(RoomType, { id });
    if (!roomType) {
      throw new NotFoundException(`RoomType with ID ${id} not found`);
    }
    return roomType;
  }

  async create(createRoomTypeDto: CreateRoomTypeDto) {
    const roomType = this.em.create(RoomType, createRoomTypeDto);
    await this.em.persistAndFlush(roomType);
    return roomType;
  }

  async updateRoomType(id: string, updateRoomTypeDto: UpdateRoomTypeDto) {
    const roomType = await this.findOne(id);
    const updatedRoomType = this.em.assign(roomType, updateRoomTypeDto);
    await this.em.persistAndFlush(updatedRoomType);
    return updatedRoomType;
  }

  async remove(id: string) {
    const roomType = await this.findOne(id);
    await this.em.removeAndFlush(roomType);
    return roomType;
  }
} 