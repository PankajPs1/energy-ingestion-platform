import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IngestionModule } from './ingestion/ingestion.module';
import { AnalyticsModule } from './analytics/analytics.module';

import { VehicleHistory } from './models/vehicle-history.entity';
import { MeterHistory } from './models/meter-history.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'energy',

      entities: [VehicleHistory, MeterHistory],  // 🔥 THIS WAS MISSING
      synchronize: true,                          // 🔥 VERY IMPORTANT
    }),

    IngestionModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
