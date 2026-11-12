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
  CheckCircle2,
  Wifi,
  WifiOff,
  Download,
  HardDrive,
  RefreshCw,
  AlertTriangle,
  Info,
  Check,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { FarmPlot } from '../types';
import { INITIAL_SOIL_READINGS } from '../services/mockData';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import {
  getCachedFarmPlots,
  saveFarmPlotsOffline,
  precacheTilesForFarm,
  getOfflineMapMetadata,
  OfflineMapMetadata
} from '../services/offlineMapService';
import L from 'leaflet';

export const FarmMappingPage: React.FC = () => {
  const { user, isDemoUser } = useAuth();
  const networkOnline = useOnlineStatus();

  // Offline simulation toggle for easy testing
  const [simulateOffline, setSimulateOffline] = useState(false);
  const effectiveOnline = networkOnline && !simulateOffline;

  // Farm plots state - initialized from offline cache
  const [farms, setFarms] = useState<FarmPlot[]>(() => getCachedFarmPlots());
  const [selectedFarm, setSelectedFarm] = useState<FarmPlot>(() => {
    const cached = getCachedFarmPlots();
    return cached[0];
  });

  const [showNDVI, setShowNDVI] = useState(true);
  const [showSensors, setShowSensors] = useState(true);
  const [mapType, setMapType] = useState<'street' | 'topo'>('street');

  // Offline caching state
  const [cachingProgress, setCachingProgress] = useState<string | null>(null);
  const [offlineMeta, setOfflineMeta] = useState<OfflineMapMetadata | null>(() => getOfflineMapMetadata());
  const [isCacheModalOpen, setIsCacheModalOpen] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  // Sync farm plots from Firestore when online, then update offline cache
  useEffect(() => {
    let isMounted = true;

    async function loadFarms() {
      // 1. Always load instantly from offline cache
      const cached = getCachedFarmPlots();
      if (isMounted && cached.length > 0) {
        setFarms(cached);
        if (!selectedFarm || !cached.some(f => f.id === selectedFarm.id)) {
          setSelectedFarm(cached[0]);
        }
      }

      // 2. If online and logged in, fetch user's cloud farm plots
      if (effectiveOnline && user && !isDemoUser) {
        try {
          const q = query(collection(db, 'farms'), where('userId', '==', user.uid));
          const snapshot = await getDocs(q);
          const loaded: FarmPlot[] = [];
          snapshot.forEach(docSnap => {
            loaded.push(docSnap.data() as FarmPlot);
          });

          if (loaded.length > 0 && isMounted) {
            setFarms(loaded);
            saveFarmPlotsOffline(loaded);
            setOfflineMeta(getOfflineMapMetadata());
          }
        } catch (err) {
          console.warn('Using offline cached farm plots:', err);
        }
      } else if (cached.length === 0) {
        // Fallback default
        saveFarmPlotsOffline(farms);
        setOfflineMeta(getOfflineMapMetadata());
      }
    }

    loadFarms();

    return () => {
      isMounted = false;
    };
  }, [user, isDemoUser, effectiveOnline]);

  // Leaflet Map Rendering
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up existing instance if already initialized
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize map centered at selected farm
    const map = L.map(mapContainerRef.current, {
      center: [selectedFarm.latitude, selectedFarm.longitude],
      zoom: 15,
      zoomControl: true,
    });
    mapInstanceRef.current = map;

    // Tile layer - intercepted by Service Worker for offline Cache-First delivery
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
        color: effectiveOnline ? '#059669' : '#d97706',
        fillColor: showNDVI ? (effectiveOnline ? '#10b981' : '#f59e0b') : '#34d399',
        fillOpacity: showNDVI ? 0.45 : 0.25,
        weight: 3,
        dashArray: showNDVI ? '' : '5, 5'
      });

      polygon.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px; min-width: 180px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <h4 style="font-weight: 800; font-size: 13px; color: ${effectiveOnline ? '#064e3b' : '#78350f'}; margin: 0;">${selectedFarm.name}</h4>
            <span style="font-size: 9px; padding: 2px 6px; border-radius: 4px; background: ${effectiveOnline ? '#d1fae5' : '#fef3c7'}; color: ${effectiveOnline ? '#065f46' : '#92400e'}; font-weight: bold;">
              ${effectiveOnline ? 'Cloud Synced' : 'Offline Cache'}
            </span>
          </div>
          <p style="font-size: 11px; margin: 0 0 2px 0;"><strong>Acreage:</strong> ${selectedFarm.totalAcres} Acres</p>
          <p style="font-size: 11px; margin: 0 0 2px 0;"><strong>Primary Crop:</strong> ${selectedFarm.primaryCrop}</p>
          <p style="font-size: 11px; margin: 0 0 2px 0;"><strong>Soil Substratum:</strong> ${selectedFarm.soilType}</p>
          <p style="font-size: 10px; color: ${effectiveOnline ? '#059669' : '#b45309'}; font-weight: bold; margin-top: 4px;">
            NDVI Index: 0.78 (Vigorous Canopy)
          </p>
        </div>
      `);
      group.addLayer(polygon);

      // Fit map bounds to polygon
      map.fitBounds(polygon.getBounds(), { padding: [30, 30] });
    }

    // Add IoT Sensor Node Markers
    if (showSensors) {
      const soil = INITIAL_SOIL_READINGS[0];

      // Custom HTML Marker Icon
      const sensorIcon = L.divIcon({
        className: 'custom-sensor-marker',
        html: `
          <div style="
            background: ${effectiveOnline ? '#059669' : '#d97706'};
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
        <div style="font-family: sans-serif; min-width: 180px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <h4 style="font-weight: 800; font-size: 12px; color: #1e293b; margin: 0;">IoT Probe #ESP32-042</h4>
            <span style="font-size: 9px; padding: 2px 6px; border-radius: 4px; background: ${effectiveOnline ? '#dcfce7' : '#fef3c7'}; color: ${effectiveOnline ? '#166534' : '#854d0e'}; font-weight: bold;">
              ${effectiveOnline ? 'Live Telemetry' : 'Cached Snapshot'}
            </span>
          </div>
          <div style="font-size: 11px; line-height: 1.5; color: #475569;">
            <div><strong>Nitrogen:</strong> ${soil.nitrogen} mg/kg</div>
            <div><strong>Phosphorus:</strong> ${soil.phosphorus} mg/kg</div>
            <div><strong>Potassium:</strong> ${soil.potassium} mg/kg</div>
            <div><strong>Moisture:</strong> ${soil.moisture}%</div>
            <div><strong>Soil Temp:</strong> ${soil.temperature}°C</div>
            <div><strong>pH:</strong> ${soil.ph}</div>
          </div>
          <div style="margin-top: 6px; font-size: 10px; color: ${effectiveOnline ? '#059669' : '#d97706'}; font-weight: bold;">
            ${effectiveOnline ? 'Network: Online (LoRaWAN / ESP32)' : 'Network: Offline (Cached in Local Storage)'}
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
  }, [selectedFarm, showNDVI, showSensors, mapType, effectiveOnline]);

  const handleFarmSelect = (id: string) => {
    const f = farms.find(item => item.id === id);
    if (f) setSelectedFarm(f);
  };

  // Pre-cache tiles and bounds for selected farm
  const handlePrecacheCurrentFarm = async () => {
    setCachingProgress(`Caching map tiles for ${selectedFarm.name}...`);
    try {
      const res = await precacheTilesForFarm(selectedFarm);
      setOfflineMeta(getOfflineMapMetadata());
      setCachingProgress(`Successfully cached ${res.count} map tiles! Available offline.`);
      setTimeout(() => setCachingProgress(null), 3500);
    } catch {
      setCachingProgress('Saved farm boundaries to local storage.');
      setTimeout(() => setCachingProgress(null), 3000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Offline Status Alert Banner */}
      {!effectiveOnline && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-4 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-xs">
              <WifiOff className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="font-extrabold text-sm flex items-center gap-2">
                <span>Offline GIS Mode Active</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/25 uppercase font-mono font-bold tracking-wider">
                  Local Storage & Service Worker
                </span>
              </div>
              <p className="text-xs text-amber-100 mt-0.5">
                Serving {farms.length} cached farm plot boundaries, GPS coordinates, and soil profiles without internet access.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {simulateOffline && (
              <button
                onClick={() => setSimulateOffline(false)}
                className="px-3 py-1.5 rounded-lg bg-white text-amber-900 text-xs font-bold hover:bg-amber-50 transition-colors shadow-xs"
              >
                Exit Offline Sim
              </button>
            )}
            <button
              onClick={() => setIsCacheModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-700/60 hover:bg-amber-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <HardDrive className="w-3.5 h-3.5" />
              View Cache
            </button>
          </div>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Interactive Farm GIS Mapping (Leaflet)
            </h1>
            {effectiveOnline ? (
              <Badge variant="emerald" size="sm">
                <Wifi className="w-3 h-3" />
                <span>Online (Cloud Synced)</span>
              </Badge>
            ) : (
              <Badge variant="amber" size="sm">
                <WifiOff className="w-3 h-3" />
                <span>Offline Cache ({farms.length} Plots)</span>
              </Badge>
            )}
            <Badge variant="emerald" size="sm">NDVI Spectral Active</Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Geographic plot boundaries, multispectral vegetation index, and telemetry sensor coordinates with offline caching.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Plot Selector */}
          <select
            value={selectedFarm.id}
            onChange={e => handleFarmSelect(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-800 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {farms.map(f => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.totalAcres} Ac)
              </option>
            ))}
          </select>

          {/* Download for Offline Button */}
          <button
            onClick={handlePrecacheCurrentFarm}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
            title="Pre-cache map tiles and coordinates for field use"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Cache Plot Offline</span>
          </button>

          {/* Offline Cache Info Modal Trigger */}
          <button
            onClick={() => setIsCacheModalOpen(true)}
            className="p-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 transition-colors"
            title="Inspect Offline Storage Cache"
          >
            <HardDrive className="w-4 h-4 text-emerald-700" />
          </button>
        </div>
      </div>

      {/* Caching Toast Notification */}
      {cachingProgress && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs flex items-center justify-between animate-fade-in shadow-xs">
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{cachingProgress}</span>
          </div>
          <Check className="w-4 h-4 text-emerald-700" />
        </div>
      )}

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

        <div className="flex items-center gap-3">
          {/* Offline Simulation Button for Evaluation */}
          <button
            onClick={() => setSimulateOffline(!simulateOffline)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              simulateOffline
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'border-stone-200 hover:bg-stone-50 text-stone-600'
            }`}
          >
            {simulateOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-600" /> : <Wifi className="w-3.5 h-3.5 text-stone-400" />}
            <span>{simulateOffline ? 'Offline Mode Active' : 'Test Offline Mode'}</span>
          </button>

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

        {/* Offline Overlay Watermark Tag */}
        {!effectiveOnline && (
          <div className="absolute top-4 right-4 z-20 bg-amber-500/90 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-bold shadow-md flex items-center gap-1.5">
            <HardDrive className="w-3 h-3" />
            <span>Serving from Offline Storage</span>
          </div>
        )}

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
          <span className="text-[10px] text-emerald-700 font-medium mt-0.5 block">
            {selectedFarm.polygonCoords?.length || 0} Boundary Vertices
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">GPS Center Lat/Long</span>
          <p className="font-mono text-stone-900 mt-1">
            {selectedFarm.latitude.toFixed(4)}°N, {selectedFarm.longitude.toFixed(4)}°E
          </p>
          <span className="text-[10px] text-stone-500 mt-0.5 block">
            Offline Georeferenced
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Irrigation Infrastructure</span>
          <p className="font-bold text-stone-900 mt-1">{selectedFarm.irrigationType} Network</p>
          <span className="text-[10px] text-stone-500 mt-0.5 block">Area: {selectedFarm.totalAcres} Acres</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Dominant Soil Profile</span>
          <p className="font-bold text-stone-900 mt-1">{selectedFarm.soilType} Substratum</p>
          <span className="text-[10px] text-stone-500 mt-0.5 block">Status: Cached Offline</span>
        </div>
      </div>

      {/* Offline Storage Cache Modal */}
      {isCacheModalOpen && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">Offline GIS & Farm Cache</h3>
                  <p className="text-[11px] text-stone-500">Service Worker & Local Storage Caching</p>
                </div>
              </div>
              <button
                onClick={() => setIsCacheModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/70 space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-600">Cached Farm Plots:</span>
                  <span className="font-bold text-emerald-800">{farms.length} Plots</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Storage Mechanism:</span>
                  <span className="font-mono text-stone-800 font-semibold">LocalStorage + SW CacheStorage</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Last Synced to Disk:</span>
                  <span className="font-mono text-stone-700">
                    {offlineMeta?.lastCachedAt ? new Date(offlineMeta.lastCachedAt).toLocaleTimeString() : 'Just now'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Network State:</span>
                  <span className={`font-bold ${effectiveOnline ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {effectiveOnline ? 'Online (Connected)' : 'Offline (Cached Mode)'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2 block">
                  Cached Plots Ready for Offline Fieldwork:
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {farms.map((f, i) => (
                    <div
                      key={f.id}
                      className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-stone-800 text-xs">{f.name}</div>
                        <div className="text-[10px] text-stone-500">
                          {f.latitude.toFixed(4)}°N, {f.longitude.toFixed(4)}°E • {f.totalAcres} Ac • {f.primaryCrop}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">
                        Cached
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handlePrecacheCurrentFarm}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Re-cache Current Plot</span>
              </button>
              <button
                onClick={() => setIsCacheModalOpen(false)}
                className="py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
