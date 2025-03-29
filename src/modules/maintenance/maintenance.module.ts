import { Module } from '@nestjs/common';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceService } from './maintenance.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Maintenance } from './entities/maintenance.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Maintenance])],
  controllers: [MaintenanceController],
  providers: [MaintenanceService],
  exports: [MaintenanceService],
})
export class MaintenanceModule {} 