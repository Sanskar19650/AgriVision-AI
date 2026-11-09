/**
 * AgriVision AI - Core TypeScript Definitions
 */

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phone?: string;
  region?: string;
  role: 'farmer' | 'agronomist' | 'researcher' | 'admin';
  createdAt?: string;
  photoURL?: string;
}

export interface FarmPlot {
  id: string;
  userId: string;
  name: string;
  location: string;
  totalAcres: number;
  primaryCrop: string;
  soilType: 'Alluvial' | 'Black' | 'Red' | 'Clay' | 'Sandy' | 'Loamy';
  irrigationType: 'Drip' | 'Sprinkler' | 'Canal' | 'Rainfed' | 'TubeWell';
  latitude: number;
  longitude: number;
  polygonCoords?: [number, number][];
  createdAt: string;
}

export interface SoilReading {
  id: string;
  userId: string;
  farmId: string;
  farmName?: string;
  nitrogen: number; // mg/kg (ppm)
  phosphorus: number; // mg/kg (ppm)
  potassium: number; // mg/kg (ppm)
  ph: number; // 0-14
  moisture: number; // %
  temperature: number; // °C
  organicMatter: number; // %
  electricalConductivity: number; // dS/m
  healthScore: number; // 0-100
  sensorSource: 'IoT Telemetry (ESP32)' | 'Soil Testing Lab' | 'Manual Calibration';
  timestamp: string;
}

export interface DiseaseDetectionResult {
  id: string;
  userId: string;
  farmId?: string;
  cropType: string;
  diseaseDetected: string;
  confidence: number; // 0-100
  severity: 'Healthy' | 'Low' | 'Moderate' | 'High' | 'Severe';
  pathogenType: 'Fungal' | 'Bacterial' | 'Viral' | 'Pest' | 'Nutritional' | 'None';
  symptoms: string;
  organicTreatment: string;
  chemicalTreatment: string;
  preventiveMeasures: string[];
  imageUrl: string;
  verifiedOnBlockchain: boolean;
  blockchainTxHash?: string;
  sha256Hash?: string;
  createdAt: string;
}

export interface BoundingBox {
  id: string;
  label: string;
  confidence: number;
  box: [number, number, number, number]; // [ymin, xmin, ymax, xmax] normalized 0-100
  color: string;
}

export interface DamageAssessmentResult {
  id: string;
  userId: string;
  farmId?: string;
  cropType: string;
  damageCategory: 'Pest Infestation' | 'Hail & Wind Shredding' | 'Drought & Moisture Stress' | 'Fungal Blight' | 'Nutrient Chlorosis';
  damagePercentage: number;
  boxesCount: number;
  detectedObjects: BoundingBox[];
  actionRequired: string;
  insuranceClaimEligible: boolean;
  estimatedYieldLossPercent: number;
  imageUrl: string;
  createdAt: string;
}

export interface RecommendedCrop {
  crop: string;
  probability: number;
  expectedYieldTonsPerAcre: number;
  waterRequirement: 'Low' | 'Medium' | 'High';
  growingPeriodDays: number;
  marketPriceEstimateINR: number;
  keyNutrientNeed: string;
}

export interface CropRecommendationResult {
  id: string;
  userId: string;
  farmId?: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
  topCrop: string;
  topProbability: number;
  recommendations: RecommendedCrop[];
  fertilizerAdvice: string;
  createdAt: string;
}

export interface BlockchainRecord {
  id: string;
  userId: string;
  reportId: string;
  reportType: 'DISEASE_SCAN' | 'DAMAGE_AUDIT' | 'SOIL_TEST' | 'CROP_CERTIFICATE';
  sha256Hash: string;
  txHash: string;
  blockNumber: number;
  contractAddress: string;
  network: string;
  status: 'CONFIRMED' | 'PENDING' | 'REVERTED';
  timestamp: string;
  auditorNotes?: string;
}

export interface WeatherData {
  city: string;
  currentTemp: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  pressure: number;
  uvIndex: number;
  precipitationChance: number;
  soilMoistureIndex: string;
  sprayingCondition: 'Optimal' | 'Caution' | 'Unfavorable';
  frostRisk: 'None' | 'Low' | 'High';
  forecast: {
    day: string;
    tempHigh: number;
    tempLow: number;
    condition: string;
    rainProb: number;
  }[];
  agriculturalAdvisories: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  category?: 'disease' | 'soil' | 'scheme' | 'market' | 'general';
}
