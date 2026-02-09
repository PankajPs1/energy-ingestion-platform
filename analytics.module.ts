import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { VehicleHistory } from '../models/vehicle-history.entity';
import { MeterHistory } from '../models/meter-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VehicleHistory,
      MeterHistory,
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
