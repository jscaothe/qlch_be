import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Contract } from './entities/contract.entity';
import { ContractStatus } from './enums/contract-status.enum';
import { CreateContractDto } from './dto/create-contract.dto';
import { Tenant } from '../tenants/entities/tenant.entity';
import { Room } from '../rooms/entities/room.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ContractsService {
  constructor(private readonly em: EntityManager) {}

  async findAll(page = 1, limit = 10, search?: string) {
    const where: any = {};

    if (search) {
      where.$or = [
        { tenantId: { $like: `%${search}%` } },
        { roomId: { $like: `%${search}%` } },
      ];
    }

    const contracts = await this.em.find(Contract, where, {
      limit,
      offset: (page - 1) * limit,
    });

    const total = await this.em.count(Contract, where);

    return {
      data: contracts,
      meta: {
        hasMore: (page - 1) * limit + contracts.length < total,
        page,
        limit,
      },
    };
  }

  async findOne(id: string) {
    const contract = await this.em.findOne(Contract, { id }, {
      populate: ['room', 'tenant'],
    });

    if (!contract) {
      throw new NotFoundException(`Contract with ID "${id}" not found`);
    }

    return contract;
  }

  async create(createContractDto: CreateContractDto) {
    const { roomId, tenantId, ...contractData } = createContractDto;

    const room = await this.em.findOne(Room, { id: roomId });
    if (!room) {
      throw new NotFoundException(`Room with ID "${roomId}" not found`);
    }

    const tenant = await this.em.findOne(Tenant, { id: tenantId });
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID "${tenantId}" not found`);
    }

    const contract = this.em.create(Contract, {
      startDate: new Date(contractData.startDate),
      endDate: new Date(contractData.endDate),
      deposit: contractData.deposit,
      monthlyRent: contractData.monthlyRent,
      terms: contractData.terms,
      room,
      tenant,
      status: ContractStatus.ACTIVE,
    });

    await this.em.persistAndFlush(contract);
    return contract;
  }

  async update(id: string, updateContractDto: Partial<CreateContractDto>) {
    const contract = await this.findOne(id);
    this.em.assign(contract, updateContractDto);
    await this.em.persistAndFlush(contract);
    return contract;
  }

  async remove(id: string) {
    const contract = await this.findOne(id);
    await this.em.removeAndFlush(contract);
  }

  async renew(id: string, newEndDate: string, newMonthlyRent?: number): Promise<Contract> {
    const contract = await this.findOne(id);
    if (contract.status !== ContractStatus.ACTIVE) {
      throw new Error('Only active contracts can be renewed');
    }

    contract.endDate = new Date(newEndDate);
    if (newMonthlyRent) {
      contract.monthlyRent = newMonthlyRent;
    }

    await this.em.persistAndFlush(contract);
    return contract;
  }

  async terminate(id: string, reason: string, terminationDate: string): Promise<Contract> {
    const contract = await this.findOne(id);
    if (contract.status !== ContractStatus.ACTIVE) {
      throw new Error('Only active contracts can be terminated');
    }

    contract.status = ContractStatus.TERMINATED;
    contract.terminationReason = reason;
    contract.terminationDate = new Date(terminationDate);

    await this.em.persistAndFlush(contract);
    return contract;
  }

  async checkExpiredContracts(): Promise<void> {
    const today = new Date();
    const expiredContracts = await this.em.find(Contract, {
      status: ContractStatus.ACTIVE,
      endDate: { $lt: today },
    });

    for (const contract of expiredContracts) {
      contract.status = ContractStatus.EXPIRED;
    }

    await this.em.persistAndFlush(expiredContracts);
  }
} 