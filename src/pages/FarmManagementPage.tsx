import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Tractor,
  Plus,
  MapPin,
  Droplets,
  Layers,
  Trash2,
  ExternalLink,
  CheckCircle2,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { FarmPlot } from '../types';
import { INITIAL_FARMS } from '../services/mockData';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

const STORAGE_KEY = 'agrivision_farms_v1';

export const FarmManagementPage: React.FC = () => {
  const { user, isDemoUser } = useAuth();
  const [farms, setFarms] = useState<FarmPlot[]>(() => {
    if (typeof window === 'undefined') return INITIAL_FARMS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_FARMS;
    } catch {
      return INITIAL_FARMS;
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    totalAcres: 10,
    primaryCrop: 'Wheat',
    soilType: 'Alluvial' as FarmPlot['soilType'],
    irrigationType: 'Drip' as FarmPlot['irrigationType'],
    latitude: 19.9975,
    longitude: 73.7898,
  });

  const handleSaveFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newFarm: FarmPlot = {
      id: `farm-${Date.now()}`,
      userId: user?.uid || 'demo-user-123',
      name: formData.name,
      location: formData.location || 'Central Agricultural Cluster',
      totalAcres: Number(formData.totalAcres),
      primaryCrop: formData.primaryCrop,
      soilType: formData.soilType,
      irrigationType: formData.irrigationType,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      polygonCoords: [
        [Number(formData.latitude), Number(formData.longitude)],
        [Number(formData.latitude) + 0.003, Number(formData.longitude) + 0.004],
        [Number(formData.latitude) - 0.002, Number(formData.longitude) + 0.005],
        [Number(formData.latitude) - 0.003, Number(formData.longitude)],
      ],
      createdAt: new Date().toISOString()
    };

    const updated = [newFarm, ...farms];
    setFarms(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    if (!isDemoUser && user) {
      try {
        await setDoc(doc(db, 'farms', newFarm.id), newFarm);
      } catch (err) {
        console.warn('Could not sync farm with Firestore:', err);
      }
    }

    setIsModalOpen(false);
    setFormData({
      name: '',
      location: '',
      totalAcres: 10,
      primaryCrop: 'Wheat',
      soilType: 'Alluvial',
      irrigationType: 'Drip',
      latitude: 19.9975,
      longitude: 73.7898,
    });
  };

  const handleDeleteFarm = async (id: string) => {
    const updated = farms.filter(f => f.id !== id);
    setFarms(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    if (!isDemoUser && user) {
      try {
        await deleteDoc(doc(db, 'farms', id));
      } catch (err) {
        console.warn('Failed to delete farm from Firestore:', err);
      }
    }
  };

  const totalMonitoredAcres = farms.reduce((acc, f) => acc + f.totalAcres, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Farm & Land Management
            </h1>
            <Badge variant="emerald" size="sm">{farms.length} Active Plots</Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Register agricultural properties, define soil types, irrigation methods, and GIS boundary coordinates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/mapping"
            className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors"
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
            Open GIS Demarcation
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Farm Plot
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Farm Holding</span>
          <p className="text-2xl font-bold text-stone-900 mt-1">{totalMonitoredAcres.toFixed(1)} Acres</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">100% active cultivation</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Soil Types Represented</span>
          <p className="text-2xl font-bold text-stone-900 mt-1">
            {Array.from(new Set(farms.map(f => f.soilType))).length} Profiles
          </p>
          <p className="text-xs text-stone-500 mt-1">Alluvial, Black, Red</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Irrigation Technology</span>
          <p className="text-2xl font-bold text-stone-900 mt-1">82% Precision Drip</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">PMKSY Subsidy Compliant</p>
        </div>
      </div>

      {/* Farms Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms.map((farm) => (
          <div
            key={farm.id}
            className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                  <Tractor className="w-6 h-6" />
                </div>
                <Badge variant="stone" size="sm">
                  {farm.totalAcres} Acres
                </Badge>
              </div>

              <div>
                <h3 className="font-bold text-base text-stone-900">{farm.name}</h3>
                <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  {farm.location}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-stone-100">
                <div className="p-2.5 rounded-xl bg-stone-50">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block">Primary Crop</span>
                  <span className="font-bold text-stone-800">{farm.primaryCrop}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block">Soil Type</span>
                  <span className="font-bold text-stone-800">{farm.soilType}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block">Irrigation</span>
                  <span className="font-bold text-stone-800">{farm.irrigationType}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block">Coordinates</span>
                  <span className="font-mono text-[11px] text-stone-700">
                    {farm.latitude.toFixed(2)}°, {farm.longitude.toFixed(2)}°
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
              <Link
                to={`/mapping?lat=${farm.latitude}&lng=${farm.longitude}`}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View GIS Map
              </Link>
              <button
                onClick={() => handleDeleteFarm(farm.id)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Remove farm plot"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Farm Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Tractor className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-stone-900">Register New Farm Plot</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFarm} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Farm Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sahyadri Organic Vineyards"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Location / District</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Nashik, Maharashtra"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Total Acres</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={formData.totalAcres}
                    onChange={e => setFormData({ ...formData, totalAcres: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Primary Crop</label>
                  <input
                    type="text"
                    required
                    value={formData.primaryCrop}
                    onChange={e => setFormData({ ...formData, primaryCrop: e.target.value })}
                    placeholder="e.g. Grapes, Tomato, Wheat"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Soil Type</label>
                  <select
                    value={formData.soilType}
                    onChange={e => setFormData({ ...formData, soilType: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Alluvial">Alluvial (Indo-Gangetic)</option>
                    <option value="Black">Black Regur (Cotton Soil)</option>
                    <option value="Red">Red & Yellow Loam</option>
                    <option value="Clay">Clay Heavy Soil</option>
                    <option value="Sandy">Sandy Loam</option>
                    <option value="Loamy">Rich Loamy Soil</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Irrigation</label>
                  <select
                    value={formData.irrigationType}
                    onChange={e => setFormData({ ...formData, irrigationType: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Drip">Drip Irrigation</option>
                    <option value="Sprinkler">Sprinkler System</option>
                    <option value="Canal">Canal Irrigation</option>
                    <option value="TubeWell">Borewell / Tube</option>
                    <option value="Rainfed">Rainfed (Dryland)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.latitude}
                    onChange={e => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.longitude}
                    onChange={e => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                >
                  Register Farm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
