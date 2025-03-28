import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, FilterQuery, EntityManager } from '@mikro-orm/core';
import { User, UserRole, UserStatus } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
  ) {}

  async findAll(page = 1, limit = 10, search?: string, role?: UserRole, status?: UserStatus) {
    const offset = (page - 1) * limit;
    const where: FilterQuery<User> = {};

    if (search) {
      where.$or = [
        { name: { $like: `%${search}%` } },
        { email: { $like: `%${search}%` } },
        { phone: { $like: `%${search}%` } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    const [users, total] = await this.userRepository.findAndCount(where, {
      offset,
      limit,
    });

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    await this.em.persistAndFlush(user);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    
    if (updateUserDto.name) {
      user.name = updateUserDto.name;
    }
    if (updateUserDto.email) {
      user.email = updateUserDto.email;
    }
    if (updateUserDto.phone) {
      user.phone = updateUserDto.phone;
    }
    if (updateUserDto.role) {
      user.role = updateUserDto.role as UserRole;
    }
    if (updateUserDto.status) {
      user.status = updateUserDto.status as UserStatus;
    }
    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.em.flush();
    return user;
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.em.removeAndFlush(user);
    return { message: 'User deleted successfully' };
  }

  async updateStatus(id: number, status: UserStatus) {
    const user = await this.findOne(id);
    user.status = status;
    await this.em.flush();
    return user;
  }
} 