import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';
import { Contract } from './entities/contract.entity';
import { Tenant } from '../tenants/entities/tenant.entity';
import { Room } from '../rooms/entities/room.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Contract, Tenant, Room])],
  controllers: [ContractsController],
  providers: [ContractsService],
  exports: [ContractsService],
})
export class ContractsModule {} 