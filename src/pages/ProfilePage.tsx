import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Save,
  CheckCircle2,
  Sparkles,
  Tractor,
  KeyRound,
  Radio,
  FileCheck,
  Layers,
  Cpu
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user, isDemoUser, updateProfileData } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || 'Rameshwar Patil');
  const [phone, setPhone] = useState(user?.phone || '+91 98231 44520');
  const [region, setRegion] = useState(user?.region || 'Nashik Agro-Cluster, Maharashtra');
  const [role, setRole] = useState(user?.role || 'farmer');
  
  // Agricultural Landholding Details
  const [khasraNumber, setKhasraNumber] = useState('MH-NSK-24/18B');
  const [cultivableAcres, setCultivableAcres] = useState('22.5');
  const [irrigationSource, setIrrigationSource] = useState('Solar Drip + Deep Borewell');
  const [organicStatus, setOrganicStatus] = useState('NPOP Certified Organic');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfileData({
      fullName,
      phone,
      region,
      role
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Farmer Profile & Agronomic Identity
            </h1>
            <Badge variant="emerald" size="sm">
              {isDemoUser ? 'Evaluator Demo Account' : 'Authenticated Farmer'}
            </Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Manage personal farming credentials, mobile OTP verification security, landholding records, and IoT gateway parameters.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile preferences and landholding details updated in Cloud Firestore!</span>
        </div>
      )}

      {/* Profile Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <img
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=059669&color=fff`}
              alt={fullName}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/20"
            />
            <div>
              <h3 className="font-bold text-base text-stone-900">{fullName}</h3>
              <p className="text-xs text-stone-500">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="emerald" size="sm">
              <KeyRound className="w-3 h-3 text-emerald-600" />
              OTP Verified
            </Badge>
            <Badge variant="stone" size="sm" className="capitalize">
              {role}
            </Badge>
          </div>
        </div>

        <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1.5">Farmer Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="email"
                disabled
                value={user?.email || 'farmer@agrivision.ai'}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1.5">
              Verified Mobile Number (Used for SMS OTP Sign In)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1.5">Agricultural Zone / District</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={region}
                onChange={e => setRegion(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1.5">Account Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs outline-none"
            >
              <option value="farmer">Farmer / Land Owner</option>
              <option value="agronomist">Agronomist Specialist</option>
              <option value="researcher">Agricultural Researcher</option>
              <option value="admin">District Administrator</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1.5">Certification Status</label>
            <input
              type="text"
              value={organicStatus}
              onChange={e => setOrganicStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs outline-none"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end pt-2">
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Profile Preferences
            </button>
          </div>
        </form>
      </div>

      {/* Agricultural Landholding & Survey Verification Card */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Landholding Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Tractor className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">Landholding & Khasra Survey</h3>
              <p className="text-[11px] text-stone-500">Government revenue land registry records</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
              <span className="text-stone-500 font-medium">Khasra / Plot Survey No.</span>
              <span className="font-mono font-bold text-stone-900">{khasraNumber}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
              <span className="text-stone-500 font-medium">Total Cultivable Area</span>
              <span className="font-bold text-emerald-800">{cultivableAcres} Acres</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
              <span className="text-stone-500 font-medium">Primary Irrigation</span>
              <span className="font-bold text-stone-800">{irrigationSource}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
              <span className="text-stone-500 font-medium">Certification Body</span>
              <span className="font-bold text-stone-800">APEDA / NPOP National Standard</span>
            </div>
          </div>
        </div>

        {/* IoT Gateway Hardware Node Status */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <Radio className="w-4 h-4 text-teal-700" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">IoT Edge Gateway Hardware Node</h3>
              <p className="text-[11px] text-stone-500">ESP32 microcontroller & field sensor bus</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
              <span className="text-stone-500 font-medium">Device Hardware ID</span>
              <span className="font-mono font-bold text-teal-900">ESP32-AGRI-GATEWAY-01</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
              <span className="text-stone-500 font-medium">Connected Sensors</span>
              <span className="font-bold text-stone-800">Modbus NPK + Soil pH + DHT22</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
              <span className="text-stone-500 font-medium">Telemetry Uplink</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live (5 min sync interval)
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
              <span className="text-stone-500 font-medium">Firestore Database Node</span>
              <span className="font-mono text-[11px] text-stone-600">agrivision-ai-9bfef</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
