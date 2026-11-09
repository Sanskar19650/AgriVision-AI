import React, { useEffect, useRef, useState } from 'react';
import {
  MapPin,
  Layers,
  Activity,
  Droplets,
  Tractor,
  Maximize2,
  Eye,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { INITIAL_FARMS, INITIAL_SOIL_READINGS } from '../services/mockData';
import L from 'leaflet';

export const FarmMappingPage: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  const [selectedFarm, setSelectedFarm] = useState(INITIAL_FARMS[0]);
  const [showNDVI, setShowNDVI] = useState(true);
  const [showSensors, setShowSensors] = useState(true);
  const [mapType, setMapType] = useState<'street' | 'topo'>('street');

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up existing instance if already initialized
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      center: [selectedFarm.latitude, selectedFarm.longitude],
      zoom: 15,
      zoomControl: true,
    });
    mapInstanceRef.current = map;

    // Tile layer
    const tileUrl =
      mapType === 'street'
        ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        : 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';

    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors, AgriVision AI GIS'
    });
    tileLayer.addTo(map);

    // Layer group for dynamic polygons & markers
    const group = L.layerGroup().addTo(map);
    layersGroupRef.current = group;

    // Add Farm Boundary Polygon
    if (selectedFarm.polygonCoords && selectedFarm.polygonCoords.length > 0) {
      const polygon = L.polygon(selectedFarm.polygonCoords, {
        color: '#059669',
        fillColor: showNDVI ? '#10b981' : '#34d399',
        fillOpacity: showNDVI ? 0.45 : 0.25,
        weight: 3,
        dashArray: showNDVI ? '' : '5, 5'
      });

      polygon.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px;">
          <h4 style="font-weight: 800; font-size: 13px; color: #064e3b; margin: 0 0 4px 0;">${selectedFarm.name}</h4>
          <p style="font-size: 11px; margin: 0 0 2px 0;"><strong>Acreage:</strong> ${selectedFarm.totalAcres} Acres</p>
          <p style="font-size: 11px; margin: 0 0 2px 0;"><strong>Crop:</strong> ${selectedFarm.primaryCrop}</p>
          <p style="font-size: 11px; margin: 0 0 2px 0;"><strong>Soil:</strong> ${selectedFarm.soilType}</p>
          <p style="font-size: 10px; color: #059669; font-weight: bold; margin-top: 4px;">NDVI Vigorous Growth Zone (0.78)</p>
        </div>
      `);
      group.addLayer(polygon);
    }

    // Add IoT Sensor Node Markers
    if (showSensors) {
      const soil = INITIAL_SOIL_READINGS[0];

      // Custom HTML Marker Icon
      const sensorIcon = L.divIcon({
        className: 'custom-sensor-marker',
        html: `
          <div style="
            background: #059669;
            color: white;
            border: 2px solid white;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            font-size: 12px;
            font-weight: bold;
          ">
            🌱
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const sensorMarker = L.marker([selectedFarm.latitude, selectedFarm.longitude], {
        icon: sensorIcon
      });

      sensorMarker.bindPopup(`
        <div style="font-family: sans-serif; min-width: 170px;">
          <h4 style="font-weight: 800; font-size: 12px; color: #1e293b; margin: 0 0 6px 0;">IoT Probe #ESP32-042</h4>
          <div style="font-size: 11px; line-height: 1.5; color: #475569;">
            <div><strong>Nitrogen:</strong> ${soil.nitrogen} mg/kg</div>
            <div><strong>Phosphorus:</strong> ${soil.phosphorus} mg/kg</div>
            <div><strong>Potassium:</strong> ${soil.potassium} mg/kg</div>
            <div><strong>Soil Moisture:</strong> ${soil.moisture}%</div>
            <div><strong>Soil Temp:</strong> ${soil.temperature}°C</div>
            <div><strong>pH:</strong> ${soil.ph}</div>
          </div>
          <div style="margin-top: 6px; font-size: 10px; color: #059669; font-weight: bold;">
            Telemetry: Online (LoRaWAN)
          </div>
        </div>
      `);

      group.addLayer(sensorMarker);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [selectedFarm, showNDVI, showSensors, mapType]);

  const handleFarmSelect = (id: string) => {
    const f = INITIAL_FARMS.find(item => item.id === id);
    if (f) setSelectedFarm(f);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Interactive Farm GIS Mapping (Leaflet)
            </h1>
            <Badge variant="emerald" size="sm">NDVI Spectral Layer Active</Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Geographic plot boundaries, multispectral vegetation index, and telemetry sensor coordinates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedFarm.id}
            onChange={e => handleFarmSelect(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-800 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {INITIAL_FARMS.map(f => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.totalAcres} Ac)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Map Control Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-stone-700">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showNDVI}
              onChange={e => setShowNDVI(e.target.checked)}
              className="accent-emerald-600 rounded"
            />
            <span>NDVI Vegetation Health Overlay</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showSensors}
              onChange={e => setShowSensors(e.target.checked)}
              className="accent-emerald-600 rounded"
            />
            <span>IoT Sensor Probe Pins</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMapType(mapType === 'street' ? 'topo' : 'street')}
            className="px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700 transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            Switch to {mapType === 'street' ? 'Topographic' : 'Standard'} Base
          </button>
        </div>
      </div>

      {/* Leaflet Map Frame */}
      <div className="relative rounded-3xl overflow-hidden border border-stone-200/80 shadow-md bg-stone-100">
        <div
          ref={mapContainerRef}
          className="w-full h-[520px] z-10"
          style={{ minHeight: '520px' }}
        />

        {/* Floating NDVI Legend */}
        {showNDVI && (
          <div className="absolute bottom-6 right-6 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-stone-200 text-xs space-y-1.5 max-w-[210px]">
            <span className="font-bold text-[10px] text-stone-500 uppercase tracking-wider block">
              NDVI Vegetation Index
            </span>
            <div className="w-full h-3 rounded-full bg-gradient-to-r from-red-500 via-amber-400 via-lime-400 to-emerald-600" />
            <div className="flex justify-between text-[10px] text-stone-500 font-mono">
              <span>0.1 (Stressed)</span>
              <span>0.9 (Vigorous)</span>
            </div>
          </div>
        )}
      </div>

      {/* Farm Plot Details Footer */}
      <div className="grid sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Monitored Plot</span>
          <p className="font-bold text-stone-900 mt-1">{selectedFarm.name}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">GPS Center Lat/Long</span>
          <p className="font-mono text-stone-900 mt-1">
            {selectedFarm.latitude.toFixed(4)}°N, {selectedFarm.longitude.toFixed(4)}°E
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Irrigation Infrastructure</span>
          <p className="font-bold text-stone-900 mt-1">{selectedFarm.irrigationType} Network</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Dominant Soil Profile</span>
          <p className="font-bold text-stone-900 mt-1">{selectedFarm.soilType} Substratum</p>
        </div>
      </div>
    </div>
  );
};
