import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Tenant } from './entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { TenantStatus } from './enums/tenant-status.enum';

@Injectable()
export class TenantsService {
  constructor(private readonly em: EntityManager) {}

  async findAll(page: number, limit: number, search?: string) {
    const offset = (page - 1) * limit;
    const where = search
      ? {
          $or: [
            { name: { $like: `%${search}%` } },
            { email: { $like: `%${search}%` } },
          ],
        }
      : {};

    const tenants = await this.em.find(Tenant, where, {
      limit,
      offset,
    });

    const total = await this.em.count(Tenant, where);

    return {
      data: tenants,
      meta: {
        hasMore: offset + tenants.length < total,
        page,
        limit,
      },
    };
  }

  async findOne(id: string) {
    const tenant = await this.em.findOne(Tenant, { id });
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant;
  }

  async create(createTenantDto: CreateTenantDto) {
    const tenant = this.em.create(Tenant, {
      ...createTenantDto,
      status: TenantStatus.ACTIVE,
    });
    await this.em.persistAndFlush(tenant);
    return tenant;
  }

  async update(id: string, updateTenantDto: Partial<CreateTenantDto>) {
    const tenant = await this.findOne(id);
    Object.assign(tenant, updateTenantDto);
    await this.em.persistAndFlush(tenant);
    return tenant;
  }

  async updateStatus(id: string, status: TenantStatus) {
    const tenant = await this.findOne(id);
    tenant.status = status;
    await this.em.persistAndFlush(tenant);
    return tenant;
  }

  async remove(id: string) {
    const tenant = await this.findOne(id);
    await this.em.removeAndFlush(tenant);
  }
} 