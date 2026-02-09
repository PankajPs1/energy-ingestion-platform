import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { VehicleHistory } from '../models/vehicle-history.entity';
import { MeterHistory } from '../models/meter-history.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(VehicleHistory)
    private readonly vehicleRepo: Repository<VehicleHistory>,

    @InjectRepository(MeterHistory)
    private readonly meterRepo: Repository<MeterHistory>,
  ) {}

  async getAllData() {
    console.log('📋 Checking Database Schema...');
    
    try {
      // Get table info
      const meterColumns = await this.meterRepo.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'meter_history'
      `);
      console.log('🔍 Meter Table Columns:', meterColumns);
      
      const vehicleColumns = await this.vehicleRepo.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'vehicle_history'
      `);
      console.log('🔍 Vehicle Table Columns:', vehicleColumns);
      
      // Get all data raw
      const allMeters = await this.meterRepo.query('SELECT * FROM meter_history');
      console.log('📊 All Meters from DB:', allMeters);
      
      const allVehicles = await this.vehicleRepo.query('SELECT * FROM vehicle_history');
      console.log('📊 All Vehicles from DB:', allVehicles);
      
      return {
        meterColumns,
        vehicleColumns,
        meters: allMeters,
        vehicles: allVehicles,
      };
    } catch (error) {
      console.error('❌ Error:', error);
      return { error: error.message };
    }
  }

  async performance(vehicleId: string) {
    console.log('🔍 Analytics Query for vehicleId:', vehicleId);

    // Get the LATEST saved data
    const latestMeters = await this.meterRepo.query(
      'SELECT * FROM meter_history ORDER BY id DESC LIMIT 10'
    );
    console.log('⚡ Latest 10 meters:', latestMeters);

    // Query for the specified vehicleId
    const vehicleMeters = await this.meterRepo.query(
      'SELECT * FROM meter_history WHERE "vehicleId" = $1',
      [vehicleId]
    );
    console.log(`🎯 Meters for ${vehicleId}:`, vehicleMeters);

    const vehicleData = await this.vehicleRepo.query(
      'SELECT * FROM vehicle_history WHERE "vehicleId" = $1',
      [vehicleId]
    );
    console.log(`🎯 Vehicles for ${vehicleId}:`, vehicleData);

    // Calculate sums
    const totalDc = vehicleData.reduce((sum, v) => sum + (v.kwhDeliveredDc || 0), 0);
    const avgBatteryTemp = vehicleData.length 
      ? vehicleData.reduce((sum, v) => sum + (v.batteryTemp || 0), 0) / vehicleData.length
      : 0;
    const totalAc = vehicleMeters.reduce((sum, m) => sum + (m.kwhConsumedAc || 0), 0);

    console.log('📊 Calculated Values:', { totalDc, totalAc, avgBatteryTemp });

    return {
      totalAc: Number(totalAc || 0),
      totalDc: Number(totalDc || 0),
      efficiency:
        totalAc && totalDc
          ? Number(totalDc) / Number(totalAc)
          : 0,
      avgBatteryTemp: Number(avgBatteryTemp || 0),
    };
  }
}
