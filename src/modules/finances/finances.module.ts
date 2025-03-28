import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from './entities/transaction.entity';
import { Room } from '../rooms/entities/room.entity';
import { Tenant } from '../tenants/entities/tenant.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Transaction, Room, Tenant])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class FinancesModule {} 