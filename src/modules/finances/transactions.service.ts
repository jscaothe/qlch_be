import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionType } from './enums/transaction-type.enum';
import { Room } from '../rooms/entities/room.entity';
import { Tenant } from '../tenants/entities/tenant.entity';

@Injectable()
export class TransactionsService {
  constructor(private readonly em: EntityManager) {}

  async findAll(page = 1, limit = 10, type?: TransactionType) {
    const transactions = await this.em.find(Transaction, type ? { type } : {}, {
      populate: ['room', 'tenant'],
      offset: (page - 1) * limit,
      limit: limit + 1,
    });

    const hasMore = transactions.length > limit;
    const items = hasMore ? transactions.slice(0, -1) : transactions;

    return {
      data: items,
      meta: {
        hasMore,
        page,
        limit,
      },
    };
  }

  async findOne(id: string) {
    const transaction = await this.em.findOne(Transaction, { id }, {
      populate: ['room', 'tenant'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID "${id}" not found`);
    }

    return transaction;
  }

  async create(createTransactionDto: CreateTransactionDto) {
    const { roomId, tenantId, ...transactionData } = createTransactionDto;

    const room = roomId ? await this.em.findOne(Room, { id: roomId }) : null;
    if (roomId && !room) {
      throw new NotFoundException(`Room with ID "${roomId}" not found`);
    }

    const tenant = tenantId ? await this.em.findOne(Tenant, { id: tenantId }) : null;
    if (tenantId && !tenant) {
      throw new NotFoundException(`Tenant with ID "${tenantId}" not found`);
    }

    const transaction = this.em.create(Transaction, {
      ...transactionData,
      room,
      tenant,
    });

    await this.em.persistAndFlush(transaction);
    return transaction;
  }

  async remove(id: string) {
    const transaction = await this.findOne(id);
    await this.em.removeAndFlush(transaction);
  }
} 