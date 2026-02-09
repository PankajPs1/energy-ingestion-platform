import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { MeterHistory } from '../models/meter-history.entity';
import { VehicleHistory } from '../models/vehicle-history.entity';
import { MeterLive } from '../models/meter-live.entity';
import { VehicleLive } from '../models/vehicle-live.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MeterHistory,
      VehicleHistory,
      MeterLive,
      VehicleLive,
    ]),
  ],
  controllers: [IngestionController],
  providers: [IngestionService],
})
export class IngestionModule {}
