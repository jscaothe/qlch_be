import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Settings } from './entities/settings.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Settings])],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {} 