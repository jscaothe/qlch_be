import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { UsersModule } from './modules/users/users.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { FinancesModule } from './modules/finances/finances.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MikroOrmModule.forRoot({
      driver: PostgreSqlDriver,
      dbName: process.env.DB_NAME || 'qlch_db',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      entities: ['./dist/**/*.entity.js'],
      entitiesTs: ['./src/**/*.entity.ts'],
      debug: process.env.NODE_ENV !== 'production',
      discovery: {
        warnWhenNoEntities: false,
      },
    }),
    UsersModule,
    RoomsModule,
    TenantsModule,
    ContractsModule,
    FinancesModule,
  ],
})
export class AppModule {} 