import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
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
    try {
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
    } catch (error) {
      console.error('Error in findAll:', error);
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.userRepository.findOne({ id });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error in findOne:', error);
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userRepository.findOne({ email: createUserDto.email });
      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
        phone: createUserDto.phone,
      });
      await this.em.persistAndFlush(user);
      return user;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error in create:', error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.findOne(id);
      
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this.userRepository.findOne({ email: updateUserDto.email });
        if (existingUser) {
          throw new BadRequestException('Email already exists');
        }
      }

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
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error in update:', error);
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(id: number) {
    try {
      const user = await this.findOne(id);
      await this.em.removeAndFlush(user);
      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error in remove:', error);
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  async updateStatus(id: number, status: UserStatus) {
    try {
      const user = await this.findOne(id);
      user.status = status;
      await this.em.flush();
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error in updateStatus:', error);
      throw new InternalServerErrorException('Failed to update user status');
    }
  }
} 