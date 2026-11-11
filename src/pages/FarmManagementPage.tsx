import React, { useState, useEffect } from 'react';
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
  Calendar,
  Clock,
  Sparkles,
  ClipboardList,
  Check,
  Tag
} from 'lucide-react';
import { FarmPlot, CropActivity } from '../types';
import { INITIAL_FARMS, INITIAL_CROP_ACTIVITIES } from '../services/mockData';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { doc, setDoc, deleteDoc, collection, getDocs, query, where } from 'firebase/firestore';

const STORAGE_KEY_FARMS = 'agrivision_farms_v1';
const STORAGE_KEY_ACTIVITIES = 'agrivision_crop_activities_v1';

export const FarmManagementPage: React.FC = () => {
  const { user, isDemoUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'plots' | 'lifecycle'>('plots');

  // Farms state
  const [farms, setFarms] = useState<FarmPlot[]>(() => {
    if (typeof window === 'undefined') return INITIAL_FARMS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FARMS);
      return saved ? JSON.parse(saved) : INITIAL_FARMS;
    } catch {
      return INITIAL_FARMS;
    }
  });

  // Activities state
  const [activities, setActivities] = useState<CropActivity[]>(() => {
    if (typeof window === 'undefined') return INITIAL_CROP_ACTIVITIES;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
      return saved ? JSON.parse(saved) : INITIAL_CROP_ACTIVITIES;
    } catch {
      return INITIAL_CROP_ACTIVITIES;
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  // New Farm form
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

  // New Activity form
  const [activityForm, setActivityForm] = useState({
    farmId: INITIAL_FARMS[0].id,
    cropName: 'Tomato (Abhinav Hybrid)',
    activityType: 'Spraying' as CropActivity['activityType'],
    description: '',
    activityDate: new Date().toISOString().split('T')[0],
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
    localStorage.setItem(STORAGE_KEY_FARMS, JSON.stringify(updated));

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
    localStorage.setItem(STORAGE_KEY_FARMS, JSON.stringify(updated));

    if (!isDemoUser && user) {
      try {
        await deleteDoc(doc(db, 'farms', id));
      } catch (err) {
        console.warn('Failed to delete farm from Firestore:', err);
      }
    }
  };

  const handleSaveActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityForm.description.trim()) return;

    const newActivity: CropActivity = {
      id: `act-${Date.now()}`,
      userId: user?.uid || 'demo-user-123',
      farmId: activityForm.farmId,
      cropName: activityForm.cropName,
      activityType: activityForm.activityType,
      description: activityForm.description,
      status: 'Scheduled',
      activityDate: activityForm.activityDate,
      createdAt: new Date().toISOString()
    };

    const updated = [newActivity, ...activities];
    setActivities(updated);
    localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(updated));

    if (!isDemoUser && user) {
      try {
        await setDoc(doc(db, 'crop_activities', newActivity.id), newActivity);
      } catch (err) {
        console.warn('Could not sync activity with Firestore:', err);
      }
    }

    setIsActivityModalOpen(false);
    setActivityForm({
      farmId: farms[0]?.id || 'farm-001',
      cropName: 'Tomato (Abhinav Hybrid)',
      activityType: 'Spraying',
      description: '',
      activityDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleToggleActivityStatus = async (id: string) => {
    const updated = activities.map(a => {
      if (a.id === id) {
        const nextStatus: CropActivity['status'] = a.status === 'Completed' ? 'Scheduled' : 'Completed';
        return { ...a, status: nextStatus };
      }
      return a;
    });

    setActivities(updated);
    localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(updated));

    const targeted = updated.find(a => a.id === id);
    if (!isDemoUser && user && targeted) {
      try {
        await setDoc(doc(db, 'crop_activities', id), targeted, { merge: true });
      } catch (err) {
        console.warn('Failed to update activity in Firestore:', err);
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
              Farm & Crop Lifecycle Management
            </h1>
            <Badge variant="emerald" size="sm">{farms.length} Active Plots</Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Register agricultural properties, manage soil profiles, and schedule crop lifecycle events in Cloud Firestore.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs */}
          <div className="bg-stone-100 p-1 rounded-2xl flex items-center text-xs font-semibold">
            <button
              onClick={() => setActiveTab('plots')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'plots' ? 'bg-white text-emerald-900 shadow-xs font-bold' : 'text-stone-600'
              }`}
            >
              Land Plots
            </button>
            <button
              onClick={() => setActiveTab('lifecycle')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'lifecycle' ? 'bg-white text-emerald-900 shadow-xs font-bold' : 'text-stone-600'
              }`}
            >
              Lifecycle Activities
            </button>
          </div>

          {activeTab === 'plots' ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              Add Plot
            </button>
          ) : (
            <button
              onClick={() => setIsActivityModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              Schedule Activity
            </button>
          )}
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
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Soil Types Monitored</span>
          <p className="text-2xl font-bold text-stone-900 mt-1">
            {Array.from(new Set(farms.map(f => f.soilType))).length} Profiles
          </p>
          <p className="text-xs text-stone-500 mt-1">Alluvial, Black, Red</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Lifecycle Activities</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1">
            {activities.filter(a => a.status === 'Completed').length} / {activities.length} Completed
          </p>
          <p className="text-xs text-emerald-600 font-medium mt-1">Synced to Cloud Firestore</p>
        </div>
      </div>

      {/* TAB 1: LAND PLOTS */}
      {activeTab === 'plots' && (
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
      )}

      {/* TAB 2: CROP LIFECYCLE ACTIVITIES */}
      {activeTab === 'lifecycle' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-stone-900">Crop Lifecycle Operations Timeline</h3>
              <p className="text-xs text-stone-500">Track and log sowing, fertilization, spraying, and harvesting events in Firestore</p>
            </div>
            <Badge variant="emerald" size="sm">Phase 4 Active</Badge>
          </div>

          <div className="space-y-3">
            {activities.map((act) => {
              const isCompleted = act.status === 'Completed';
              return (
                <div
                  key={act.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                    isCompleted ? 'bg-emerald-50/40 border-emerald-200/80' : 'bg-stone-50/60 border-stone-200/80'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleActivityStatus(act.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isCompleted ? 'bg-emerald-600 text-white' : 'border border-stone-300 bg-white hover:border-emerald-500'
                      }`}
                    >
                      {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">{act.activityType}</span>
                        <Badge variant="stone" size="sm">{act.cropName}</Badge>
                        <span className="text-[11px] text-stone-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {act.activityDate}
                        </span>
                      </div>
                      <p className="text-stone-600 text-xs leading-relaxed">{act.description}</p>
                    </div>
                  </div>

                  <Badge variant={isCompleted ? 'emerald' : 'amber'} size="sm" className="self-start sm:self-auto shrink-0">
                    {act.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}

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

      {/* Add Crop Activity Modal */}
      {isActivityModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-stone-900">Schedule Crop Lifecycle Activity</h3>
              </div>
              <button
                onClick={() => setIsActivityModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveActivity} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Target Farm Plot</label>
                <select
                  value={activityForm.farmId}
                  onChange={e => setActivityForm({ ...activityForm, farmId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white outline-none"
                >
                  {farms.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.primaryCrop})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Crop Variety</label>
                  <input
                    type="text"
                    required
                    value={activityForm.cropName}
                    onChange={e => setActivityForm({ ...activityForm, cropName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Activity Category</label>
                  <select
                    value={activityForm.activityType}
                    onChange={e => setActivityForm({ ...activityForm, activityType: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white outline-none"
                  >
                    <option value="Sowing">Sowing / Transplanting</option>
                    <option value="Fertilization">Fertilization / Manure</option>
                    <option value="Irrigation">Irrigation Run</option>
                    <option value="Scouting">Disease / Pest Scouting</option>
                    <option value="Spraying">Foliar Spraying</option>
                    <option value="Harvesting">Harvesting & Yielding</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Scheduled / Completion Date</label>
                <input
                  type="date"
                  required
                  value={activityForm.activityDate}
                  onChange={e => setActivityForm({ ...activityForm, activityDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Operation Description & Dosages</label>
                <textarea
                  required
                  rows={3}
                  value={activityForm.description}
                  onChange={e => setActivityForm({ ...activityForm, description: e.target.value })}
                  placeholder="e.g. Applied 50 kg/acre Urea top-dressing followed by light drip irrigation."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsActivityModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                >
                  Save to Firestore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
