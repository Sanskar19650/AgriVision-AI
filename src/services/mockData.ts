/**
 * AgriVision AI - Realistic Agricultural Mock Data & Presets
 * Preloaded for instant B.Tech demonstration and offline VS Code testing.
 */

import { FarmPlot, SoilReading, DiseaseDetectionResult, DamageAssessmentResult, WeatherData, BlockchainRecord, CropActivity } from '../types';

export const INITIAL_FARMS: FarmPlot[] = [
  {
    id: 'farm-001',
    userId: 'demo-user-123',
    name: 'GreenField Agro Sanctuary',
    location: 'Nashik, Maharashtra',
    totalAcres: 14.5,
    primaryCrop: 'Grapes & Tomatoes',
    soilType: 'Black',
    irrigationType: 'Drip',
    latitude: 19.9975,
    longitude: 73.7898,
    polygonCoords: [
      [19.999, 73.788],
      [20.001, 73.793],
      [19.996, 73.795],
      [19.994, 73.790],
    ],
    createdAt: '2026-03-15T09:30:00Z',
  },
  {
    id: 'farm-002',
    userId: 'demo-user-123',
    name: 'Shree Krishna Organic Farm',
    location: 'Ludhiana, Punjab',
    totalAcres: 28.0,
    primaryCrop: 'Wheat & Mustard',
    soilType: 'Alluvial',
    irrigationType: 'Canal',
    latitude: 30.9010,
    longitude: 75.8573,
    polygonCoords: [
      [30.903, 75.855],
      [30.905, 75.861],
      [30.899, 75.862],
      [30.898, 75.856],
    ],
    createdAt: '2026-02-10T11:15:00Z',
  },
  {
    id: 'farm-003',
    userId: 'demo-user-123',
    name: 'Cauvery River Basin Orchards',
    location: 'Mandya, Karnataka',
    totalAcres: 8.2,
    primaryCrop: 'Sugarcane & Rice',
    soilType: 'Red',
    irrigationType: 'Sprinkler',
    latitude: 12.5230,
    longitude: 76.8970,
    polygonCoords: [
      [12.525, 76.895],
      [12.527, 76.900],
      [12.521, 76.902],
      [12.519, 76.896],
    ],
    createdAt: '2026-04-01T14:20:00Z',
  }
];

export const INITIAL_SOIL_READINGS: SoilReading[] = [
  {
    id: 'soil-001',
    userId: 'demo-user-123',
    farmId: 'farm-001',
    farmName: 'GreenField Agro Sanctuary',
    nitrogen: 142, // mg/kg
    phosphorus: 38,
    potassium: 195,
    ph: 6.8,
    moisture: 32.4, // %
    temperature: 24.5, // °C
    organicMatter: 2.1,
    electricalConductivity: 0.85,
    healthScore: 84,
    sensorSource: 'IoT Telemetry (ESP32)',
    timestamp: '2026-11-09T06:30:00Z',
  },
  {
    id: 'soil-002',
    userId: 'demo-user-123',
    farmId: 'farm-002',
    farmName: 'Shree Krishna Organic Farm',
    nitrogen: 98,
    phosphorus: 22,
    potassium: 140,
    ph: 7.4,
    moisture: 26.8,
    temperature: 21.0,
    organicMatter: 1.6,
    electricalConductivity: 1.12,
    healthScore: 68,
    sensorSource: 'IoT Telemetry (ESP32)',
    timestamp: '2026-11-09T05:45:00Z',
  },
  {
    id: 'soil-003',
    userId: 'demo-user-123',
    farmId: 'farm-003',
    farmName: 'Cauvery River Basin Orchards',
    nitrogen: 180,
    phosphorus: 55,
    potassium: 220,
    ph: 6.4,
    moisture: 42.1,
    temperature: 27.2,
    organicMatter: 2.8,
    electricalConductivity: 0.65,
    healthScore: 92,
    sensorSource: 'Soil Testing Lab',
    timestamp: '2026-11-08T16:10:00Z',
  }
];

export const SAMPLE_LEAF_IMAGES = [
  {
    id: 'sample-1',
    name: 'Tomato - Early Blight (Alternaria solani)',
    crop: 'Tomato',
    disease: 'Early Blight',
    pathogen: 'Fungal',
    severity: 'Moderate',
    confidence: 96.4,
    previewUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=600&q=80',
    symptoms: 'Concentric dark brown circular spots with yellow halo forming a "target board" appearance on lower mature foliage.',
    organicTreatment: 'Spray 5% Neem seed kernel extract (NSKE) or Copper Oxychloride 3g/L. Apply Trichoderma viride to root zone.',
    chemicalTreatment: 'Mancozeb 75% WP @ 2.5g/L or Azoxystrobin 23% SC @ 1ml/L at 10-day intervals.',
  },
  {
    id: 'sample-2',
    name: 'Potato - Late Blight (Phytophthora infestans)',
    crop: 'Potato',
    disease: 'Late Blight',
    pathogen: 'Fungal / Oomycete',
    severity: 'Severe',
    confidence: 98.2,
    previewUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    symptoms: 'Water-soaked irregular black/dark lesions expanding rapidly in cold humid conditions, white mold on leaf underside.',
    organicTreatment: 'Prophylactic Bordeaux mixture (1%) application. Ensure ridges are well-drained and avoid overhead sprinkler watering.',
    chemicalTreatment: 'Cymoxanil 8% + Mancozeb 64% WP @ 3g/L or Metalaxyl 8% + Mancozeb 64% WP @ 2.5g/L.',
  },
  {
    id: 'sample-3',
    name: 'Corn (Maize) - Common Rust (Puccinia sorghi)',
    crop: 'Maize',
    disease: 'Common Rust',
    pathogen: 'Fungal',
    severity: 'High',
    confidence: 94.8,
    previewUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
    symptoms: 'Cinnamon-brown elongated powdery pustules rupturing upper and lower leaf surfaces, causing premature senescence.',
    organicTreatment: 'Spray bio-fungicide Bacillus subtilis 5ml/L. Remove volunteer corn and weed hosts around field margins.',
    chemicalTreatment: 'Propiconazole 25% EC @ 1ml/L or Tebuconazole 25.9% EC @ 1.5ml/L.',
  },
  {
    id: 'sample-4',
    name: 'Apple - Apple Scab (Venturia inaequalis)',
    crop: 'Apple',
    disease: 'Apple Scab',
    pathogen: 'Fungal',
    severity: 'Moderate',
    confidence: 95.1,
    previewUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    symptoms: 'Dull olive-green velvety spots progressing into corky, scabby lesions on leaves and fruit skin.',
    organicTreatment: 'Apply wettable sulfur @ 3g/L or lime sulfur during green-tip stage. Prune canopy for sunlight penetration.',
    chemicalTreatment: 'Difenoconazole 25% EC @ 0.5ml/L or Captan 50% WP @ 2.5g/L.',
  },
  {
    id: 'sample-5',
    name: 'Rice (Paddy) - Healthy Vigorous Leaf',
    crop: 'Rice',
    disease: 'Healthy Crop (No Disease Detected)',
    pathogen: 'None',
    severity: 'Healthy',
    confidence: 99.4,
    previewUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=600&q=80',
    symptoms: 'Uniform deep green blade, sturdy venation, zero necrotic spots, robust chlorophyll fluorescence.',
    organicTreatment: 'Maintain balanced Azotobacter and PSB biofertilizer consortium. Regular water level regulation (2-3 cm).',
    chemicalTreatment: 'None required. Continue standard balanced 120:60:40 NPK application schedule.',
  }
];

export const SAMPLE_DAMAGE_IMAGES = [
  {
    id: 'damage-1',
    name: 'Drone Survey - Locust Swarm Defoliation',
    crop: 'Cotton & Soybean',
    damageCategory: 'Pest Infestation' as const,
    damagePercentage: 38.5,
    estimatedYieldLoss: 42,
    previewUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    boxes: [
      { id: 'b1', label: 'Severe Defoliation', confidence: 0.94, box: [15, 20, 48, 55] as [number, number, number, number], color: '#ef4444' },
      { id: 'b2', label: 'Locust Cluster', confidence: 0.89, box: [35, 60, 70, 88] as [number, number, number, number], color: '#f97316' },
      { id: 'b3', label: 'Chewed Stem Base', confidence: 0.85, box: [55, 12, 85, 45] as [number, number, number, number], color: '#eab308' },
    ],
    actionRequired: 'Deploy drone ultra-low volume (ULV) Malathion 96% spray or Chlorpyrifos 20% EC. File PMFBY insurance claim immediately.',
  },
  {
    id: 'damage-2',
    name: 'Field Camera - Hailstorm Leaf Shredding',
    crop: 'Wheat',
    damageCategory: 'Hail & Wind Shredding' as const,
    damagePercentage: 45.2,
    estimatedYieldLoss: 50,
    previewUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80',
    boxes: [
      { id: 'b1', label: 'Stem Lodging', confidence: 0.96, box: [20, 10, 65, 50] as [number, number, number, number], color: '#ef4444' },
      { id: 'b2', label: 'Crushed Earheads', confidence: 0.91, box: [40, 50, 85, 92] as [number, number, number, number], color: '#dc2626' },
    ],
    actionRequired: 'Foliar application of Potassium Nitrate (13-0-45) @ 15g/L + Carbendazim @ 1g/L to prevent secondary wound fungal infections.',
  },
  {
    id: 'damage-3',
    name: 'Satellite Multispectral - Severe Moisture Drought',
    crop: 'Sorghum & Pulses',
    damageCategory: 'Drought & Moisture Stress' as const,
    damagePercentage: 29.8,
    estimatedYieldLoss: 34,
    previewUrl: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=800&q=80',
    boxes: [
      { id: 'b1', label: 'Wilting Zone A', confidence: 0.92, box: [10, 15, 50, 60] as [number, number, number, number], color: '#f59e0b' },
      { id: 'b2', label: 'Extreme Chlorosis', confidence: 0.88, box: [45, 40, 80, 85] as [number, number, number, number], color: '#d97706' },
    ],
    actionRequired: 'Provide emergency deficit drip irrigation. Apply Kaolin clay 5% foliar spray as anti-transpirant to reduce leaf water loss.',
  }
];

export const INITIAL_BLOCKCHAIN_RECORDS: BlockchainRecord[] = [
  {
    id: 'blk-001',
    userId: 'demo-user-123',
    reportId: 'scan-tom-8812',
    reportType: 'DISEASE_SCAN',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    txHash: '0x8f14b2d398e72c5a01bc4976d8a39e88bf0a41d9116e2578bca6184a441e9b21',
    blockNumber: 19842104,
    contractAddress: '0x3F88a5312788e078E490cB4A66524Cd4E2f78235',
    network: 'Polygon Amoy PoS (ChainID: 80002)',
    status: 'CONFIRMED',
    timestamp: '2026-11-09T07:15:32Z',
    auditorNotes: 'Diagnostic CNN inference + Gemini 3.8 Flash validation notarized by District Agronomist node.'
  },
  {
    id: 'blk-002',
    userId: 'demo-user-123',
    reportId: 'soil-health-9941',
    reportType: 'SOIL_TEST',
    sha256Hash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
    txHash: '0x3a921d749e75c889a74160413bde7cf81050e8912e75399587bfac89182390a4',
    blockNumber: 19842065,
    contractAddress: '0x3F88a5312788e078E490cB4A66524Cd4E2f78235',
    network: 'Polygon Amoy PoS (ChainID: 80002)',
    status: 'CONFIRMED',
    timestamp: '2026-11-09T05:50:18Z',
    auditorNotes: 'IoT LoRaWAN gateway packet verification stamp with SHA-256 payload digest.'
  },
  {
    id: 'blk-003',
    userId: 'demo-user-123',
    reportId: 'claim-audit-4421',
    reportType: 'DAMAGE_AUDIT',
    sha256Hash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    txHash: '0x1c88e9942a781b0a762c954e76a089df713b19280d5345719abcef948194ad67',
    blockNumber: 19841890,
    contractAddress: '0x3F88a5312788e078E490cB4A66524Cd4E2f78235',
    network: 'Polygon Amoy PoS (ChainID: 80002)',
    status: 'CONFIRMED',
    timestamp: '2026-11-08T18:22:04Z',
    auditorNotes: 'YOLOv8 damage assessment certified for Pradhan Mantri Fasal Bima Yojana (PMFBY) claim processing.'
  }
];

export const INITIAL_WEATHER: WeatherData = {
  city: 'Nashik Agriculture Zone',
  currentTemp: 26.4,
  feelsLike: 27.2,
  condition: 'Partly Cloudy',
  humidity: 58,
  windSpeed: 11.2,
  windDirection: 'WSW (240°)',
  pressure: 1012,
  uvIndex: 6.5,
  precipitationChance: 15,
  soilMoistureIndex: 'Optimal (32%)',
  sprayingCondition: 'Optimal',
  frostRisk: 'None',
  forecast: [
    { day: 'Mon', tempHigh: 28, tempLow: 18, condition: 'Sunny', rainProb: 5 },
    { day: 'Tue', tempHigh: 29, tempLow: 19, condition: 'Clear', rainProb: 10 },
    { day: 'Wed', tempHigh: 27, tempLow: 19, condition: 'Partly Cloudy', rainProb: 20 },
    { day: 'Thu', tempHigh: 26, tempLow: 18, condition: 'Light Showers', rainProb: 65 },
    { day: 'Fri', tempHigh: 25, tempLow: 17, condition: 'Thunderstorm', rainProb: 80 },
    { day: 'Sat', tempHigh: 27, tempLow: 18, condition: 'Clear', rainProb: 15 },
    { day: 'Sun', tempHigh: 28, tempLow: 19, condition: 'Sunny', rainProb: 10 },
  ],
  agriculturalAdvisories: [
    'Optimal foliar spraying window active between 07:00 AM - 10:30 AM before wind speed exceeds 14 km/h.',
    'Expected rain on Thursday-Friday (65-80% probability). Postpone urea top-dressing to prevent nitrogen runoff.',
    'Atmospheric vapor pressure deficit (VPD) is 1.15 kPa - healthy transpiration rate for tomato and grapes.',
    'Soil moisture in upper 15cm is holding steady. Drip irrigation can be reduced by 25% for the next 48 hours.',
  ],
};

export const INITIAL_CROP_ACTIVITIES: CropActivity[] = [
  {
    id: 'act-001',
    userId: 'demo-user-123',
    farmId: 'farm-001',
    cropName: 'Tomato (Abhinav Hybrid)',
    activityType: 'Sowing',
    description: 'Nursery seedbed preparation with Trichoderma viride seed treatment @ 4g/kg seed.',
    status: 'Completed',
    activityDate: '2026-09-15',
    createdAt: '2026-09-15T08:00:00Z',
  },
  {
    id: 'act-002',
    userId: 'demo-user-123',
    farmId: 'farm-001',
    cropName: 'Tomato (Abhinav Hybrid)',
    activityType: 'Fertilization',
    description: 'Basal dose application: DAP @ 50 kg/acre + MOP @ 30 kg/acre + Neem cake 200 kg/acre.',
    status: 'Completed',
    activityDate: '2026-10-02',
    createdAt: '2026-10-02T09:30:00Z',
  },
  {
    id: 'act-003',
    userId: 'demo-user-123',
    farmId: 'farm-001',
    cropName: 'Tomato (Abhinav Hybrid)',
    activityType: 'Irrigation',
    description: 'Deficit drip irrigation schedule (2.5 hrs/day, dripper discharge 2.0 LPH).',
    status: 'Completed',
    activityDate: '2026-10-20',
    createdAt: '2026-10-20T06:00:00Z',
  },
  {
    id: 'act-004',
    userId: 'demo-user-123',
    farmId: 'farm-001',
    cropName: 'Tomato (Abhinav Hybrid)',
    activityType: 'Scouting',
    description: 'Foliar pathology scouting for early blight lesions and whitefly vector trap counts.',
    status: 'Completed',
    activityDate: '2026-11-05',
    createdAt: '2026-11-05T10:15:00Z',
  },
  {
    id: 'act-005',
    userId: 'demo-user-123',
    farmId: 'farm-001',
    cropName: 'Tomato (Abhinav Hybrid)',
    activityType: 'Spraying',
    description: 'Prophylactic 5% Neem Seed Kernel Extract (NSKE) spray for sucking pest deterrence.',
    status: 'Scheduled',
    activityDate: '2026-11-14',
    createdAt: '2026-11-09T08:00:00Z',
  },
  {
    id: 'act-006',
    userId: 'demo-user-123',
    farmId: 'farm-001',
    cropName: 'Tomato (Abhinav Hybrid)',
    activityType: 'Harvesting',
    description: 'First picking of breaker stage tomatoes for regional wholesale market dispatch.',
    status: 'Scheduled',
    activityDate: '2026-12-01',
    createdAt: '2026-11-09T08:00:00Z',
  }
];

export const CROP_LIFECYCLE_GUIDES = [
  {
    cropName: 'Wheat',
    botanicalName: 'Triticum aestivum',
    category: 'Cereal' as const,
    totalDurationDays: 130,
    optimalSoilPh: { min: 6.0, max: 7.5 },
    idealTemperature: '15°C - 24°C',
    seedRatePerAcre: '40 - 45 kg',
    expectedYieldPerAcre: '20 - 24 Quintals',
    stages: [
      {
        stageNumber: 1,
        name: 'Land Preparation & Seed Treatment',
        dayRange: 'Day 0 - 10',
        durationDays: 10,
        waterRequirement: 'Pre-sowing irrigation (Paleva) to ensure 70% field capacity.',
        npkNutrientRatio: 'Basal Dose: 50 kg DAP + 25 kg MOP + 10 kg Zinc Sulfate per acre.',
        criticalOperations: [
          'Deep plowing with disc harrow followed by 2 cross-plowings to achieve fine tilth.',
          'Treat seeds with Thiram (2.5 g/kg) + Azotobacter biofertilizer (10 g/kg).',
          'Level field with laser land leveler to prevent water stagnation.'
        ],
        diseaseScoutingPoints: ['Check for termite activity and soil-borne flag smut spores.'],
        expectedMilestone: 'Moist seedbed prepared; seed dormancy broken.'
      },
      {
        stageNumber: 2,
        name: 'Sowing & Crown Root Initiation (CRI)',
        dayRange: 'Day 11 - 25',
        durationDays: 15,
        waterRequirement: 'First critical irrigation at 21 days after sowing (CRI stage) is mandatory.',
        npkNutrientRatio: 'No top-dressing yet; rely on basal fertilizer.',
        criticalOperations: [
          'Sow using Seed-cum-Fertilizer Drill at 4 - 5 cm depth.',
          'Maintain row spacing of 20 - 22.5 cm.',
          'Ensure uniform germination by maintaining soil crust moisture.'
        ],
        diseaseScoutingPoints: ['Scout for damping-off and foot rot in heavy soils.'],
        expectedMilestone: 'Uniform 95%+ seedling emergence; primary root system anchored.'
      },
      {
        stageNumber: 3,
        name: 'Tillering & Jointing Vegetative Phase',
        dayRange: 'Day 26 - 55',
        durationDays: 30,
        waterRequirement: 'Second irrigation at active tillering (40-45 DAS).',
        npkNutrientRatio: 'First top dressing: 45 kg Urea/acre before irrigation.',
        criticalOperations: [
          'Weed control: Spray Sulfosulfuron 75% + Metsulfuron 5% @ 16 g/acre at 30-35 DAS.',
          'Inspect tiller density (aim for 6-8 healthy tillers per plant).',
          'Soil aeration through light inter-cultivation if soil crusted.'
        ],
        diseaseScoutingPoints: ['Check underside of lower leaves for Yellow Rust (Puccinia striiformis) pustules.'],
        expectedMilestone: 'Canopy closure; rapid biomass accumulation.'
      },
      {
        stageNumber: 4,
        name: 'Booting, Heading & Flowering (Anthesis)',
        dayRange: 'Day 56 - 85',
        durationDays: 30,
        waterRequirement: 'Third & fourth critical irrigations at late jointing and flowering.',
        npkNutrientRatio: 'Second top dressing: 30 kg Urea + foliar spray of NPK 19:19:19 @ 1 kg/acre.',
        criticalOperations: [
          'Avoid water stress during earhead emergence to prevent floret sterility.',
          'Foliar spray of Soluble Boron (20%) @ 1 g/L to stimulate pollen tube growth.',
          'Pest monitoring for armyworms and aphid colonies on developing spikes.'
        ],
        diseaseScoutingPoints: ['Monitor for Powdery Mildew and Loose Smut in dense microclimates.'],
        expectedMilestone: 'Earhead emergence complete; 100% pollination achieved.'
      },
      {
        stageNumber: 5,
        name: 'Milking & Dough Grain Filling',
        dayRange: 'Day 86 - 110',
        durationDays: 25,
        waterRequirement: 'Light irrigation at milk stage; strictly discontinue 10 days before harvest.',
        npkNutrientRatio: 'Foliar spray of 0:0:50 (Potassium Sulfate) @ 1.5 kg/acre to boost grain test weight.',
        criticalOperations: [
          'Protect crop from sudden terminal heat waves with light evening sprinkler runs.',
          'Prevent lodging by avoiding irrigation during high wind forecasts.',
          'Cease all synthetic chemical sprays to respect minimum residue limits.'
        ],
        diseaseScoutingPoints: ['Inspect grain heads for Karnal Bunt and glume blotch.'],
        expectedMilestone: 'Grains harden from milk to hard dough; green pigment converts to golden straw.'
      },
      {
        stageNumber: 6,
        name: 'Harvesting, Threshing & Safe Storage',
        dayRange: 'Day 111 - 130',
        durationDays: 20,
        waterRequirement: 'Zero irrigation. Allow crop and soil to dry completely.',
        npkNutrientRatio: 'None.',
        criticalOperations: [
          'Harvest when grain moisture drops to 12 - 14% (grain cracks firmly between teeth).',
          'Use combine harvester or manual sickle reaping during clear sunny hours.',
          'Thresh, winnow, and clean chaff from seed lot.',
          'Sun dry grain on tarpaulin for 2 days until moisture is under 12%.',
          'Store in airtight metallic bins or hermetic bags fumigated with Aluminum Phosphide.'
        ],
        diseaseScoutingPoints: ['Check storage bins for Rice Weevil (Sitophilus oryzae) and grain mold.'],
        expectedMilestone: 'Certified dry grain safely stored; stubble incorporated for soil carbon.'
      }
    ]
  },
  {
    cropName: 'Tomato',
    botanicalName: 'Solanum lycopersicum',
    category: 'Horticulture' as const,
    totalDurationDays: 110,
    optimalSoilPh: { min: 6.0, max: 7.0 },
    idealTemperature: '20°C - 30°C',
    seedRatePerAcre: '50 - 60 grams (Hybrid)',
    expectedYieldPerAcre: '25 - 35 Tonnes',
    stages: [
      {
        stageNumber: 1,
        name: 'Nursery Raising & Seedbed Prep',
        dayRange: 'Day 0 - 25',
        durationDays: 25,
        waterRequirement: 'Fine rose-can misting twice daily in pro-trays.',
        npkNutrientRatio: 'Sterilized cocopeat + vermicompost + 5g Trichoderma/kg substrate.',
        criticalOperations: [
          'Sow hybrid seeds in 98-cell seedling trays under 50% shade net.',
          'Drench nursery with Copper Oxychloride (2.5 g/L) against damping off.',
          'Hardening of seedlings 4 days prior to transplanting by withholding water.'
        ],
        diseaseScoutingPoints: ['Look for seedling stem collar damping-off (Pythium).'],
        expectedMilestone: 'Healthy 4-leaf seedlings (12-15 cm height) ready for transplanting.'
      },
      {
        stageNumber: 2,
        name: 'Field Transplanting & Bed Formation',
        dayRange: 'Day 26 - 40',
        durationDays: 15,
        waterRequirement: 'Immediate flood/drip soaking immediately after transplanting in the evening.',
        npkNutrientRatio: 'Basal: 50 kg SSP + 30 kg MOP + 25 kg Urea + 10 t FYM/acre.',
        criticalOperations: [
          'Form raised beds (90 cm width, 30 cm height) with silver-black mulch film.',
          'Transplant in zigzag layout with 45 cm plant-to-plant distance.',
          'Install drip line under the mulch film.'
        ],
        diseaseScoutingPoints: ['Scout for transplant shock and cutworm attacks at soil level.'],
        expectedMilestone: '100% transplant survival; new feeder roots established.'
      },
      {
        stageNumber: 3,
        name: 'Vegetative Growth & Trellising / Staking',
        dayRange: 'Day 41 - 65',
        durationDays: 25,
        waterRequirement: 'Drip fertigation run 2-3 hours every alternate day.',
        npkNutrientRatio: 'Fertigation: 19:19:19 @ 3 kg/acre every 4 days through venturi injector.',
        criticalOperations: [
          'Erect bamboo stakes and GI wire trellis system (1.5 m height).',
          'Prune side suckers to maintain single or double leader vine structure.',
          'Tie vines with twine every 20 cm to prevent soil contact.'
        ],
        diseaseScoutingPoints: ['Inspect lower leaves for concentric rings of Early Blight (Alternaria solani).'],
        expectedMilestone: 'Robust vertical vine framework; first floral clusters emerging.'
      },
      {
        stageNumber: 4,
        name: 'Profuse Flowering & Fruit Setting',
        dayRange: 'Day 66 - 85',
        durationDays: 20,
        waterRequirement: 'Consistent soil moisture without swings to prevent Blossom End Rot.',
        npkNutrientRatio: 'Switch fertigation to 12:61:00 (MAP) + Calcium Nitrate @ 2.5 kg/acre.',
        criticalOperations: [
          'Install yellow sticky traps (15 traps/acre) for whitefly vector control.',
          'Foliar spray of Planofix (NAA) @ 4 ml/15 L water to minimize flower drop.',
          'Spray Boron (20%) @ 1 g/L to enhance fruit set and prevent catfacing.'
        ],
        diseaseScoutingPoints: ['Watch for Tomato Leaf Curl Virus (ToLCV) transmitted by whiteflies.'],
        expectedMilestone: 'Dense fruit clusters setting; golf-ball sized green fruits developing.'
      },
      {
        stageNumber: 5,
        name: 'Fruit Enlargement & Color Turning (Breaker)',
        dayRange: 'Day 86 - 100',
        durationDays: 15,
        waterRequirement: 'Moderate uniform drip; avoid sudden flooding which causes fruit cracking.',
        npkNutrientRatio: 'Potassium Nitrate 13:0:45 @ 4 kg/acre + Micronutrient mixture.',
        criticalOperations: [
          'Foliar spray of Calcium Chloride @ 0.5% to firm fruit rind.',
          'Inspect fruits for Helicoverpa tomato fruit borer bore holes.',
          'Install pheromone traps (Helilure) @ 5 traps/acre.'
        ],
        diseaseScoutingPoints: ['Scout for Late Blight (Phytophthora) water-soaked lesions during humid spells.'],
        expectedMilestone: 'First cluster reaches breaker stage (pink blush at blossom end).'
      },
      {
        stageNumber: 6,
        name: 'Multi-Pick Harvesting & Post-Harvest Care',
        dayRange: 'Day 101 - 110+',
        durationDays: 20,
        waterRequirement: 'Maintain light drip runs between harvests.',
        npkNutrientRatio: 'Maintenance 0:0:50 @ 2 kg/acre per picking flush.',
        criticalOperations: [
          'Harvest at breaker stage for distant transit; red ripe for local consumption.',
          'Pick with calyx intact during early morning or late afternoon.',
          'Sort out culled, sun-scalded, or pest-damaged fruits immediately.',
          'Pack in plastic ventilated crates (not gunny sacks) to prevent bruising.'
        ],
        diseaseScoutingPoints: ['Inspect post-harvest crates for Anthracnose and Rhizopus soft rot.'],
        expectedMilestone: 'High grade harvest dispatched to market; 6-8 total pickings obtained.'
      }
    ]
  },
  {
    cropName: 'Rice / Paddy',
    botanicalName: 'Oryza sativa',
    category: 'Cereal' as const,
    totalDurationDays: 140,
    optimalSoilPh: { min: 5.5, max: 6.8 },
    idealTemperature: '22°C - 34°C',
    seedRatePerAcre: '15 - 20 kg (Transplanted)',
    expectedYieldPerAcre: '26 - 32 Quintals',
    stages: [
      {
        stageNumber: 1,
        name: 'Puddle Preparation & Nursery Seeding',
        dayRange: 'Day 0 - 25',
        durationDays: 25,
        waterRequirement: 'Standing water of 2-3 cm maintained in nursery bed.',
        npkNutrientRatio: 'Basal nursery: 2 kg DAP + 1 kg MOP per 100 sq. meter bed.',
        criticalOperations: [
          'Seed salt-floatation test and fungicide dressing with Carbendazim (2 g/kg).',
          'Puddle main field thoroughly with cage wheels to create impermeable hardpan.'
        ],
        diseaseScoutingPoints: ['Scout for Rice Blast (Pyricularia oryzae) spindle lesions.'],
        expectedMilestone: 'Robust 25-day old seedlings with 4-5 leaves ready for transplanting.'
      },
      {
        stageNumber: 2,
        name: 'Transplanting & Tillering',
        dayRange: 'Day 26 - 60',
        durationDays: 35,
        waterRequirement: 'Maintain 3 - 5 cm shallow standing water during early tillering.',
        npkNutrientRatio: 'Basal dose: 50 kg DAP + 30 kg MOP + 10 kg Zinc Sulfate 21% per acre.',
        criticalOperations: [
          'Transplant 2-3 seedlings per hill at 20 cm x 15 cm spacing.',
          'Apply Pre-emergence herbicide Pretilachlor @ 500 ml/acre within 3 days.'
        ],
        diseaseScoutingPoints: ['Check for Bacterial Leaf Blight (Xanthomonas) leaf tip yellowing.'],
        expectedMilestone: '15-20 effective tillers per hill developed.'
      },
      {
        stageNumber: 3,
        name: 'Panicle Initiation & Booting',
        dayRange: 'Day 61 - 90',
        durationDays: 30,
        waterRequirement: 'Uninterrupted 5 cm standing water layer is critical.',
        npkNutrientRatio: 'Top dress 35 kg Urea/acre + foliar spray of NPK 13:0:45.',
        criticalOperations: [
          'Scout for Yellow Stem Borer (dead hearts) and Leaf Folder.',
          'Install bird perches for natural insect predation.'
        ],
        diseaseScoutingPoints: ['Monitor for Sheath Blight (Rhizoctonia solani) snakeskin lesions.'],
        expectedMilestone: 'Panicles fully elongated within the flag leaf sheath.'
      },
      {
        stageNumber: 4,
        name: 'Flowering & Grain Filling',
        dayRange: 'Day 91 - 120',
        durationDays: 30,
        waterRequirement: 'Saturated soil; drain water 10 days before anticipated harvest.',
        npkNutrientRatio: 'Foliar spray of 0:52:34 @ 1 kg/acre for bold grain fill.',
        criticalOperations: [
          'Inspect for Brown Planthopper (BPH) hopper-burn at base of hills.',
          'Prevent lodging by managing drainage channels.'
        ],
        diseaseScoutingPoints: ['Watch for False Smut yellowish spore balls.'],
        expectedMilestone: 'Panicles turn from green to golden amber; 85% grains filled.'
      },
      {
        stageNumber: 5,
        name: 'Harvesting, Threshing & Drying',
        dayRange: 'Day 121 - 140',
        durationDays: 20,
        waterRequirement: 'Dry field condition.',
        npkNutrientRatio: 'None.',
        criticalOperations: [
          'Harvest when 80% panicles have golden-yellow color and grain moisture is 20%.',
          'Thresh and dry grain down to 14% moisture before warehousing.'
        ],
        diseaseScoutingPoints: ['Storage grain moths and weevils in silos.'],
        expectedMilestone: 'High milling quality paddy safely bagged and certified.'
      }
    ]
  }
];

export const INITIAL_DAILY_ANALYSES = [
  {
    id: 'daily-2026-11-11',
    userId: 'demo-user-123',
    farmId: 'farm-001',
    farmName: 'GreenField Agro Sanctuary',
    cropName: 'Tomato (Abhinav Hybrid)',
    analysisDate: '2026-11-11',
    dayNumber: 48,
    overallHealthScore: 94,
    soilMetrics: {
      ph: 6.6,
      moisture: 38.2,
      temperature: 24.5,
      nitrogen: 185,
      phosphorus: 42,
      potassium: 210
    },
    diseaseRisk: {
      riskScorePercent: 8,
      suspectedPathogen: 'Low - Native Trichoderma Antagonism Active',
      soilPhFactor: 'Optimal (pH 6.6) buffers against Fusarium and Phytophthora',
      correctiveAction: 'No chemical intervention required; maintain current 2.5 LPH drip cycle.'
    },
    irrigationStatus: 'Optimal' as const,
    growthStage: 'Vegetative & Trellising (Day 48 of 110)',
    priorityTasks: [
      'Tie vines to trellis GI wire to prevent foliage ground contact.',
      'Maintain yellow sticky traps against whitefly vectors.',
      'Scheduled foliar spray of NPK 19:19:19 tomorrow morning at 07:00 AM.'
    ],
    storedInFirestore: true,
    createdAt: '2026-11-11T06:00:00Z'
  },
  {
    id: 'daily-2026-11-10',
    userId: 'demo-user-123',
    farmId: 'farm-001',
    farmName: 'GreenField Agro Sanctuary',
    cropName: 'Tomato (Abhinav Hybrid)',
    analysisDate: '2026-11-10',
    dayNumber: 47,
    overallHealthScore: 92,
    soilMetrics: {
      ph: 6.5,
      moisture: 36.8,
      temperature: 25.1,
      nitrogen: 180,
      phosphorus: 40,
      potassium: 205
    },
    diseaseRisk: {
      riskScorePercent: 12,
      suspectedPathogen: 'Early Blight risk low-moderate due to afternoon humidity spike',
      soilPhFactor: 'Rhizosphere balanced; beneficial mycorrhizae active',
      correctiveAction: 'Inspect lower foliage for pinpoint target spots.'
    },
    irrigationStatus: 'Optimal' as const,
    growthStage: 'Vegetative & Trellising (Day 47 of 110)',
    priorityTasks: [
      'Executed 2 hour drip irrigation run.',
      'Pruned suckers on row 4 to improve air circulation.'
    ],
    storedInFirestore: true,
    createdAt: '2026-11-10T06:00:00Z'
  },
  {
    id: 'daily-2026-11-09',
    userId: 'demo-user-123',
    farmId: 'farm-001',
    farmName: 'GreenField Agro Sanctuary',
    cropName: 'Tomato (Abhinav Hybrid)',
    analysisDate: '2026-11-09',
    dayNumber: 46,
    overallHealthScore: 89,
    soilMetrics: {
      ph: 6.4,
      moisture: 32.5,
      temperature: 26.0,
      nitrogen: 172,
      phosphorus: 38,
      potassium: 198
    },
    diseaseRisk: {
      riskScorePercent: 15,
      suspectedPathogen: 'Moisture deficit detected, slightly elevated stress index',
      soilPhFactor: 'Slightly acidic trend, stable microbial balance',
      correctiveAction: 'Increase drip run by 30 minutes.'
    },
    irrigationStatus: 'Under-Irrigated' as const,
    growthStage: 'Vegetative & Trellising (Day 46 of 110)',
    priorityTasks: [
      'Calibrated ESP32 soil moisture probe.',
      'Adjusted dripper line pressure to 1.5 bar.'
    ],
    storedInFirestore: true,
    createdAt: '2026-11-09T06:00:00Z'
  }
];

