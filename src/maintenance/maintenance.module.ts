import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceService } from './maintenance.service';
import { Maintenance } from './entities/maintenance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Maintenance])],
  providers: [MaintenanceService],
  exports: [MaintenanceService],
})
export class MaintenanceModule {} 