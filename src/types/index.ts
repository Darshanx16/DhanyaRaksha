export type GrainType = 'Paddy' | 'Wheat' | 'Maize' | 'Rice';
export type Grade = 'Grade A' | 'Grade B' | 'Grade C';

export interface SensorReading {
  temperature: number; // °C
  humidity: number; // % RH
  moisture: number; // %
  co2: number; // ppm
  methane: number; // ppm
  weight: number; // Tons
  airQuality: 'Good' | 'Fair' | 'Poor';
}

export interface WarehouseZone {
  id: string; // 'Zone A' etc.
  name: string;
  temperature: number;
  humidity: number;
  moisture: number;
  gasLevel: number;
  fanActive: boolean;
  fanFailureRisk: number; // 0 to 100 percentage
  batteryLevel: number; // 0 to 100 percentage
  wifiSignal: 'Excellent' | 'Good' | 'Weak' | 'None';
}

export interface GrainStock {
  id: string;
  grainType: GrainType;
  quantity: number; // Tons
  moisture: number; // %
  grade: Grade;
  protein: number; // %
  shelfLifeDays: number;
  spoilageRisk: number; // 0 to 100 percentage
  zone: string; // e.g. 'Zone A'
  harvestDate: string;
  farmerName: string;
  origin: string;
}

export interface AlertMessage {
  id: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
  recommendedAction: string;
}

export interface IndustryRequirement {
  id: string;
  industryName: string;
  industryType: string;
  grainType: GrainType;
  minQuantity: number;
  maxMoisture: number;
  minGrade: Grade;
  minProtein?: number;
  contactPerson: string;
  phone: string;
  email: string;
  location: string;
}

export interface SackTraceability {
  id: string;
  rfidTag: string;
  grainType: GrainType;
  origin: string;
  farmerName: string;
  harvestDate: string;
  storageDurationDays: number;
  currentMoisture: number;
  qualityScore: number;
  grade: Grade;
  warehouseHistory: {
    timestamp: string;
    temperature: number;
    humidity: number;
    zone: string;
  }[];
  priceTrend: {
    dayOffset: number;
    price: number; // ₹ per Quintal
  }[];
}
