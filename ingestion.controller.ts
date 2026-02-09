import { Body, Controller, Post } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { MeterDto } from './dto/meter.dto';
import { VehicleDto } from './dto/vehicle.dto';

@Controller('ingest')
export class IngestionController {
  constructor(
    private readonly ingestionService: IngestionService,
  ) {}

  @Post('meter')
  ingestMeter(@Body() data: MeterDto) {
    // ✅ DB SAVE HOGA
    return this.ingestionService.ingestMeter(data);
  }

  @Post('vehicle')
  ingestVehicle(@Body() data: VehicleDto) {
    // ✅ DB SAVE HOGA
    return this.ingestionService.ingestVehicle(data);
  }
  
}
