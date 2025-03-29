import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Maintenance, MaintenanceStatus, MaintenancePriority } from './entities/maintenance.entity';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceStatusDto } from './dto/update-maintenance-status.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MaintenanceService {
  constructor(private readonly em: EntityManager) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    status?: MaintenanceStatus;
    type?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const { page = 1, limit = 10, status, type, startDate, endDate } = query;
    const offset = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (type) {
      where.maintenanceType = type;
    }

    if (startDate) {
      where.startDate = { $gte: startDate };
    }

    if (endDate) {
      where.startDate = { ...where.startDate, $lte: endDate };
    }

    const maintenances = await this.em.find(Maintenance, where, {
      limit,
      offset,
    });
    const total = await this.em.count(Maintenance, where);

    return {
      maintenances,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(createMaintenanceDto: CreateMaintenanceDto) {
    const maintenance = new Maintenance();
    maintenance.id = uuidv4();
    maintenance.equipmentId = createMaintenanceDto.equipmentId;
    maintenance.equipmentName = createMaintenanceDto.equipmentName;
    maintenance.maintenanceType = createMaintenanceDto.maintenanceType;
    maintenance.description = createMaintenanceDto.description;
    maintenance.startDate = new Date(createMaintenanceDto.startDate);
    maintenance.priority = createMaintenanceDto.priority;
    maintenance.assignedTo = createMaintenanceDto.assignedTo;
    maintenance.status = MaintenanceStatus.PENDING;

    await this.em.persistAndFlush(maintenance);
    return maintenance;
  }

  async updateStatus(id: string, updateMaintenanceStatusDto: UpdateMaintenanceStatusDto) {
    const maintenance = await this.em.findOne(Maintenance, { id });
    if (!maintenance) {
      throw new Error('Maintenance record not found');
    }
    
    maintenance.status = updateMaintenanceStatusDto.status;
    if (updateMaintenanceStatusDto.notes) {
      maintenance.notes = updateMaintenanceStatusDto.notes;
    }

    await this.em.persistAndFlush(maintenance);
    return maintenance;
  }

  async findOne(id: string) {
    const maintenance = await this.em.findOne(Maintenance, { id });
    if (!maintenance) {
      throw new Error('Maintenance record not found');
    }
    return maintenance;
  }
} 