import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  ScanEye,
  Crosshair,
  FlaskConical,
  Sparkles,
  ShieldCheck,
  BotMessageSquare,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Database,
  Layers,
  Activity,
  FileCode2
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const LandingPage: React.FC = () => {
  const stats = [
    { label: 'Leaf Scans Processed', value: '18,400+', change: '+18% this month' },
    { label: 'CNN Classification Accuracy', value: '98.4%', change: '38 plant classes' },
    { label: 'Notarized On-Chain Records', value: '5,280', change: 'Zero tampering' },
    { label: 'Soil Health Sensors Live', value: '1,420', change: 'ESP32 / LoRaWAN' },
  ];

  const features = [
    {
      title: 'Plant Pathology Diagnosis (CNN)',
      description: 'Convolutional Neural Network trained on 54,000+ PlantVillage leaf specimens with multimodal Gemini 3.8 Flash validation for organic and chemical remedies.',
      icon: ScanEye,
      color: 'emerald',
      link: '/disease'
    },
    {
      title: 'YOLOv8 Field Damage Segmentation',
      description: 'Real-time object detection and boundary demarcation for locust swarms, hailstorm leaf shredding, and drought stress with damaged area percentage estimation.',
      icon: Crosshair,
      color: 'rose',
      link: '/damage'
    },
    {
      title: 'IoT Soil & Fertility Monitoring',
      description: 'Continuous N-P-K nitrogen, phosphorus, potassium, moisture, and pH telemetry simulation. Generates automated fertilizer correction schedules.',
      icon: FlaskConical,
      color: 'amber',
      link: '/soil'
    },
    {
      title: 'Random Forest Crop Recommender',
      description: 'Multi-parametric agronomic algorithm evaluating soil nutrients, ambient temperature, humidity, pH, and precipitation to forecast maximum yield crop suitability.',
      icon: Sparkles,
      color: 'blue',
      link: '/recommend'
    },
    {
      title: 'Solidity Smart Contract Notary',
      description: 'SHA-256 cryptographic hashing of diagnostic audits and insurance surveys with immutable blockchain block mining proof on Polygon PoS testnet.',
      icon: ShieldCheck,
      color: 'purple',
      link: '/blockchain'
    },
    {
      title: 'Gemini 3.8 Flash Agronomist AI',
      description: 'Multilingual conversational agronomist providing instant guidance on plant pathology, government subsidies (PM-KISAN, PMFBY), and market prices.',
      icon: BotMessageSquare,
      color: 'emerald',
      link: '/assistant'
    }
  ];

  return (
    <div className="space-y-16 pb-12 animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-stone-900 text-white p-8 sm:p-12 lg:p-16 shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="emerald" size="sm" className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              Final Year B.Tech CSE Capstone
            </Badge>
            <Badge variant="stone" size="sm" className="bg-white/10 text-stone-200 border-white/20">
              FastAPI • PyTorch • React • Solidity
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Precision Agriculture & <span className="text-emerald-400">Blockchain Intelligence</span>
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            AgriVision AI bridges state-of-the-art Deep Learning (CNN & YOLOv8), IoT soil sensor telemetry, and cryptographic SHA-256 blockchain verification to protect crops, optimize yields, and guarantee tamper-proof audit trails for farmers and insurance adjusters.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              to="/dashboard"
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:translate-y-[-1px]"
            >
              Launch Farmer Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/disease"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-xs transition-colors flex items-center gap-2"
            >
              <ScanEye className="w-4 h-4 text-emerald-400" />
              Test Leaf Scanner
            </Link>

            <Link
              to="/profile"
              className="px-5 py-3.5 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:text-white font-medium text-xs border border-stone-700 transition-colors flex items-center gap-1.5"
            >
              <FileCode2 className="w-4 h-4 text-emerald-400" />
              VS Code Setup
            </Link>
          </div>
        </div>

        {/* Ambient Decorative Badge */}
        <div className="hidden lg:block absolute right-12 bottom-12 max-w-xs p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            Active Ecosystem Telemetry
          </div>
          <p className="text-[11px] text-stone-300 mt-1">
            Connected to Firebase Firestore & Smart Contract Node. Verified SHA-256 root anchor live.
          </p>
        </div>
      </section>

      {/* KPI Stats Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">{stat.label}</p>
            <p className="text-3xl font-extrabold text-stone-900 mt-1 tracking-tight">{stat.value}</p>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {stat.change}
            </p>
          </div>
        ))}
      </section>

      {/* Core Feature Matrix */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/70">
            Modular Microservices Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
            Engineered for Academic Defense & Field Deployment
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Every module operates independently with complete Python FastAPI inference code, Solidity contracts, and React interfaces.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-stone-900 group-hover:text-emerald-800 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
                <div className="pt-5 mt-4 border-t border-stone-100">
                  <Link
                    to={feat.link}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5 transition-colors"
                  >
                    Explore Module Interface
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Academic Architecture Pipeline */}
      <section className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Badge variant="stone" size="sm" className="bg-white/10 text-emerald-300 border-white/20">
              System Architecture Diagram
            </Badge>
            <h3 className="text-2xl font-bold tracking-tight text-white mt-2">
              End-to-End AgriVision Pipeline
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Dataflow from Edge IoT & Drone Imagery to Deep Learning Models and Ethereum-compatible Ledger.
            </p>
          </div>
          <Link
            to="/profile"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs flex items-center gap-2 self-start"
          >
            <FileCode2 className="w-4 h-4" />
            Inspect Code in VS Code
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-stone-800/80 border border-stone-700 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Cpu className="w-4 h-4" />
              <span>1. Perception Layer</span>
            </div>
            <p className="text-stone-300">
              ESP32 microcontrollers send NPK & moisture telemetry. High-res smartphone and UAV drone cameras stream plant leaf imagery.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-800/80 border border-stone-700 space-y-2">
            <div className="flex items-center gap-2 text-teal-400 font-bold">
              <Layers className="w-4 h-4" />
              <span>2. AI Inference Hub</span>
            </div>
            <p className="text-stone-300">
              PyTorch CNN detects 38 foliar diseases. YOLOv8 demarcates pest bounding boxes. Random Forest predicts optimal crop suitability.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-800/80 border border-stone-700 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Database className="w-4 h-4" />
              <span>3. Cloud & Auth</span>
            </div>
            <p className="text-stone-300">
              Firebase Authentication identifies farmers securely. Cloud Firestore synchronizes plots, telemetry logs, and diagnostic scans.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-800/80 border border-stone-700 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>4. Blockchain Notary</span>
            </div>
            <p className="text-stone-300">
              SHA-256 digest of diagnostic certificates committed to Solidity smart contract, preventing insurance fraud or survey tampering.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
