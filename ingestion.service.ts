import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeterHistory } from '../models/meter-history.entity';
import { VehicleHistory } from '../models/vehicle-history.entity';
import { MeterDto } from './dto/meter.dto';
import { VehicleDto } from './dto/vehicle.dto';

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(MeterHistory)
    private readonly meterRepo: Repository<MeterHistory>,

    @InjectRepository(VehicleHistory)
    private readonly vehicleRepo: Repository<VehicleHistory>,
  ) {}

  async ingestMeter(data: MeterDto) {
    console.log('📥 Ingesting Meter Data:', data);
    const record = this.meterRepo.create({
      meterId: data.meterId,
      vehicleId: data.vehicleId,
      kwhConsumedAc: data.kwhConsumedAc,
      voltage: data.voltage,
      timestamp: new Date(data.timestamp),
    });

    await this.meterRepo.save(record);
    console.log('✅ Meter Saved:', record);
    return record;
  }

  async ingestVehicle(data: VehicleDto) {
    const record = this.vehicleRepo.create({
      vehicleId: data.vehicleId,
      soc: data.soc,
      kwhDeliveredDc: data.kwhDeliveredDc,
      batteryTemp: data.batteryTemp,
      timestamp: new Date(data.timestamp),
    });

    await this.vehicleRepo.save(record);
    return record;
  }
}
