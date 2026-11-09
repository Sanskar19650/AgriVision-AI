import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Code2,
  Terminal,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Download,
  Copy,
  Check,
  FileCode2,
  Cpu
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user, isDemoUser, updateProfileData, firebaseUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || 'Rameshwar Patil');
  const [phone, setPhone] = useState(user?.phone || '+91 98231 44520');
  const [region, setRegion] = useState(user?.region || 'Nashik Agro-Cluster, Maharashtra');
  const [role, setRole] = useState(user?.role || 'farmer');
  
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

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

  const copyCode = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const vsCodeCommands = {
    frontend: `# 1. Install Node.js frontend dependencies\nnpm install\n\n# 2. Start React + Vite development server on port 3000\nnpm run dev`,
    backend: `# 1. Run Node/Express API server (handles /api/* endpoints)\nnpx tsx server.ts`,
    python: `# 1. Navigate to FastAPI directory\ncd backend/python_fastapi\n\n# 2. Create and activate virtual environment\npython -m venv venv\nsource venv/bin/activate  # On Windows: venv\\Scripts\\activate\n\n# 3. Install PyTorch, Ultralytics YOLO, & FastAPI\npip install -r requirements.txt\n\n# 4. Start FastAPI inference microservice\nuvicorn main:app --reload --port 8000`,
    blockchain: `# 1. Navigate to smart contract directory\ncd backend/blockchain\n\n# 2. Compile and test with Hardhat / Remix / Web3.py\npython web3_verifier.py`
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Farmer Profile & VS Code Architecture
            </h1>
            <Badge variant="emerald" size="sm">
              {isDemoUser ? 'Evaluator Demo Account' : 'Authenticated Firebase User'}
            </Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Manage personal farming credentials, security keys, and local development environment instructions.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile preferences successfully updated in Firestore!</span>
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
          <Badge variant="stone" size="sm" className="capitalize">
            {role}
          </Badge>
        </div>

        <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1.5">Full Name</label>
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
                value={user?.email || ''}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1.5">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
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
            <label className="block font-semibold text-stone-700 mb-1.5">User Role</label>
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

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* VS Code Local Development & Execution Section */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Visual Studio Code (VS Code) Local Guide</h3>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Step-by-step instructions to download, open, edit, test, and run AgriVision locally on your machine.
            </p>
          </div>
          <Badge variant="stone" size="sm" className="bg-white/10 text-emerald-300 border-white/20">
            Exportable Project Architecture
          </Badge>
        </div>

        {/* 4 Execution Pillars */}
        <div className="space-y-4 text-xs">
          
          {/* 1. React Frontend */}
          <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Terminal className="w-4 h-4" />
                1. Frontend Development (React + Tailwind CSS + Vite)
              </span>
              <button
                onClick={() => copyCode('fe', vsCodeCommands.frontend)}
                className="text-[11px] text-stone-300 hover:text-white flex items-center gap-1"
              >
                {copiedSection === 'fe' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Commands
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-black/50 text-stone-300 font-mono text-[11px] overflow-x-auto">
              {vsCodeCommands.frontend}
            </pre>
          </div>

          {/* 2. Express Backend */}
          <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-teal-400 flex items-center gap-1.5">
                <Terminal className="w-4 h-4" />
                2. Node.js Express Backend (Gemini API & Blockchain Proxy)
              </span>
              <button
                onClick={() => copyCode('be', vsCodeCommands.backend)}
                className="text-[11px] text-stone-300 hover:text-white flex items-center gap-1"
              >
                {copiedSection === 'be' ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Commands
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-black/50 text-stone-300 font-mono text-[11px] overflow-x-auto">
              {vsCodeCommands.backend}
            </pre>
          </div>

          {/* 3. Python FastAPI AI */}
          <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                3. Python FastAPI AI Server (PyTorch CNN + YOLOv8 + Random Forest)
              </span>
              <button
                onClick={() => copyCode('py', vsCodeCommands.python)}
                className="text-[11px] text-stone-300 hover:text-white flex items-center gap-1"
              >
                {copiedSection === 'py' ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Commands
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-black/50 text-stone-300 font-mono text-[11px] overflow-x-auto">
              {vsCodeCommands.python}
            </pre>
          </div>

          {/* 4. Solidity Blockchain */}
          <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                4. Blockchain Smart Contract (Solidity v0.8.20 & Web3.py)
              </span>
              <button
                onClick={() => copyCode('bc', vsCodeCommands.blockchain)}
                className="text-[11px] text-stone-300 hover:text-white flex items-center gap-1"
              >
                {copiedSection === 'bc' ? <Check className="w-3.5 h-3.5 text-purple-400" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Commands
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-black/50 text-stone-300 font-mono text-[11px] overflow-x-auto">
              {vsCodeCommands.blockchain}
            </pre>
          </div>

        </div>
      </div>
    </div>
  );
};
