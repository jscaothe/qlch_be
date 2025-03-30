import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Settings } from './entities/settings.entity';
import { RoomType } from './entities/room-type.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Settings, RoomType])],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {} 