"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vehicle_history_entity_1 = require("../models/vehicle-history.entity");
const meter_history_entity_1 = require("../models/meter-history.entity");
let AnalyticsService = class AnalyticsService {
    constructor(vehicleRepo, meterRepo) {
        this.vehicleRepo = vehicleRepo;
        this.meterRepo = meterRepo;
    }
    async getAllData() {
        console.log('📋 Checking Database Schema...');
        try {
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
        }
        catch (error) {
            console.error('❌ Error:', error);
            return { error: error.message };
        }
    }
    async performance(vehicleId) {
        console.log('🔍 Analytics Query for vehicleId:', vehicleId);
        const latestMeters = await this.meterRepo.query('SELECT * FROM meter_history ORDER BY id DESC LIMIT 10');
        console.log('⚡ Latest 10 meters:', latestMeters);
        const vehicleMeters = await this.meterRepo.query('SELECT * FROM meter_history WHERE "vehicleId" = $1', [vehicleId]);
        console.log(`🎯 Meters for ${vehicleId}:`, vehicleMeters);
        const vehicleData = await this.vehicleRepo.query('SELECT * FROM vehicle_history WHERE "vehicleId" = $1', [vehicleId]);
        console.log(`🎯 Vehicles for ${vehicleId}:`, vehicleData);
        const totalDc = vehicleData.reduce((sum, v) => sum + (v.kwhDeliveredDc || 0), 0);
        const avgBatteryTemp = vehicleData.length
            ? vehicleData.reduce((sum, v) => sum + (v.batteryTemp || 0), 0) / vehicleData.length
            : 0;
        const totalAc = vehicleMeters.reduce((sum, m) => sum + (m.kwhConsumedAc || 0), 0);
        console.log('📊 Calculated Values:', { totalDc, totalAc, avgBatteryTemp });
        return {
            totalAc: Number(totalAc || 0),
            totalDc: Number(totalDc || 0),
            efficiency: totalAc && totalDc
                ? Number(totalDc) / Number(totalAc)
                : 0,
            avgBatteryTemp: Number(avgBatteryTemp || 0),
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vehicle_history_entity_1.VehicleHistory)),
    __param(1, (0, typeorm_1.InjectRepository)(meter_history_entity_1.MeterHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map