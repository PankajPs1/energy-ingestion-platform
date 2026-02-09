import { Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';


@Controller('analytics')
export class AnalyticsController {
  constructor(private service: AnalyticsService) {}

  @Get('performance/:vehicleId')
  getPerformance(@Param('vehicleId') vehicleId: string) {
    return this.service.performance(vehicleId);
  }

  @Get('debug/all')
  async getAllData() {
    return this.service.getAllData();
  }
}
