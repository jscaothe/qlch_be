import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Maintenance } from './entities/maintenance.entity';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(Maintenance)
    private maintenanceRepository: Repository<Maintenance>,
  ) {}

  create(createMaintenanceDto: CreateMaintenanceDto): Promise<Maintenance> {
    const maintenance = this.maintenanceRepository.create({
      ...createMaintenanceDto,
      status: 'pending',
    });
    return this.maintenanceRepository.save(maintenance);
  }

  findAll(): Promise<Maintenance[]> {
    return this.maintenanceRepository.find();
  }

  findOne(id: number): Promise<Maintenance> {
    return this.maintenanceRepository.findOne({ where: { id } });
  }

  async update(id: number, updateMaintenanceDto: UpdateMaintenanceDto): Promise<Maintenance> {
    await this.maintenanceRepository.update(id, {
      ...updateMaintenanceDto,
      updatedAt: new Date(),
    });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.maintenanceRepository.delete(id);
  }
} 