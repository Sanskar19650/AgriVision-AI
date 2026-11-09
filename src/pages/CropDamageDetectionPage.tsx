import React, { useState } from 'react';
import {
  Crosshair,
  Upload,
  AlertOctagon,
  ShieldAlert,
  Percent,
  CheckCircle2,
  FileCheck,
  TrendingDown,
  Info
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { SAMPLE_DAMAGE_IMAGES } from '../services/mockData';
import { detectCropDamage } from '../services/aiService';
import { DamageAssessmentResult } from '../types';
import { useAuth } from '../context/AuthContext';
import { notarizeReportOnBlockchain } from '../services/blockchainService';

export const CropDamageDetectionPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedSample, setSelectedSample] = useState(SAMPLE_DAMAGE_IMAGES[0]);
  const [imagePreview, setImagePreview] = useState<string>(SAMPLE_DAMAGE_IMAGES[0].previewUrl);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DamageAssessmentResult | null>(null);
  const [showBoxes, setShowBoxes] = useState(true);
  const [blockchainSuccess, setBlockchainSuccess] = useState<string | null>(null);
  const [notarizing, setNotarizing] = useState(false);

  React.useEffect(() => {
    handleRunAssessment(SAMPLE_DAMAGE_IMAGES[0].id);
  }, []);

  const handleRunAssessment = async (sampleId?: string, customDataUri?: string) => {
    setAnalyzing(true);
    setBlockchainSuccess(null);
    try {
      const res = await detectCropDamage(
        user?.uid || 'demo-user-123',
        {
          sampleId,
          dataUri: customDataUri
        }
      );
      setResult(res);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_DAMAGE_IMAGES[0]) => {
    setSelectedSample(sample);
    setImagePreview(sample.previewUrl);
    handleRunAssessment(sample.id);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUri = uploadEvent.target?.result as string;
      setImagePreview(dataUri);
      handleRunAssessment(undefined, dataUri);
    };
    reader.readAsDataURL(file);
  };

  const handleNotarizeClaim = async () => {
    if (!result) return;
    setNotarizing(true);
    try {
      const record = await notarizeReportOnBlockchain(
        result.userId,
        result.id,
        'DAMAGE_AUDIT',
        result,
        `YOLOv8 crop damage survey for ${result.cropType} (${result.damagePercentage}% damage) certified for PMFBY insurance claim.`
      );
      setBlockchainSuccess(`Certified for Crop Insurance! Block #${record.blockNumber} • Tx: ${record.txHash.slice(0, 16)}...`);
    } finally {
      setNotarizing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Crop Damage & Loss Assessment (YOLOv8)
            </h1>
            <Badge variant="rose" size="sm">UAV & Field Computer Vision</Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Real-time object bounding boxes for pest swarms, hailstorm shredding, and drought stress with insurance claim qualification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="cursor-pointer px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 font-semibold text-xs text-stone-700 flex items-center gap-2 transition-colors">
            <Upload className="w-4 h-4 text-emerald-600" />
            Upload Drone Survey
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Sample Survey Selector Strip */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Field Drone Survey Dataset (Click for Instant Evaluation)
          </span>
          <span className="text-[11px] text-stone-400">YOLOv8 multi-class object detection</span>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          {SAMPLE_DAMAGE_IMAGES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                selectedSample.id === sample.id
                  ? 'border-rose-600 bg-rose-50/50 ring-2 ring-rose-500/20'
                  : 'border-stone-200 hover:border-rose-300 bg-white'
              }`}
            >
              <img
                src={sample.previewUrl}
                alt={sample.name}
                className="w-full h-32 object-cover rounded-xl mb-2"
              />
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-stone-900">{sample.damageCategory}</span>
                <Badge variant="rose" size="sm">{sample.damagePercentage}% Damage</Badge>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5 truncate">{sample.crop}</p>
            </button>
          ))}
        </div>
      </div>

      {blockchainSuccess && (
        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
            <span>{blockchainSuccess}</span>
          </div>
          <Badge variant="purple" size="sm">Audit Locked</Badge>
        </div>
      )}

      {/* Main Analysis Split */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive YOLO Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700">YOLOv8 Demarcation Canvas</span>
              <button
                onClick={() => setShowBoxes(!showBoxes)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
              >
                {showBoxes ? 'Hide Bounding Boxes' : 'Show Bounding Boxes'}
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-16/10 bg-stone-900 flex items-center justify-center">
              <img
                src={imagePreview}
                alt="Field damage specimen"
                className="w-full h-full object-cover select-none"
              />

              {/* YOLO Bounding Box Overlays */}
              {showBoxes && result && !analyzing && (
                <div className="absolute inset-0 pointer-events-none">
                  {result.detectedObjects.map((b) => {
                    const [ymin, xmin, ymax, xmax] = b.box;
                    const top = `${ymin}%`;
                    const left = `${xmin}%`;
                    const width = `${xmax - xmin}%`;
                    const height = `${ymax - ymin}%`;

                    return (
                      <div
                        key={b.id}
                        style={{
                          top,
                          left,
                          width,
                          height,
                          borderColor: b.color || '#ef4444'
                        }}
                        className="absolute border-2 rounded bg-rose-500/10 pointer-events-auto transition-all"
                      >
                        <span
                          style={{ backgroundColor: b.color || '#ef4444' }}
                          className="absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-white tracking-wider whitespace-nowrap shadow-xs"
                        >
                          {b.label} ({(b.confidence * 100).toFixed(0)}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {analyzing && (
                <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center">
                  <LoadingSpinner text="Running YOLOv8 Object Detection..." size="md" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
              <span>Model: YOLOv8x Agricultural Fine-Tuned</span>
              <span>IoU Threshold: 0.45 • Conf: 0.50</span>
            </div>
          </div>
        </div>

        {/* Right Column: Damage Summary & Insurance Claim */}
        <div className="lg:col-span-5 space-y-4">
          {result && !analyzing ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
              
              <div>
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                  Field Damage Severity
                </span>
                <h3 className="text-2xl font-black text-stone-900 mt-1">
                  {result.damageCategory}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">Crop: {result.cropType}</p>
              </div>

              {/* Damage Metrics Strip */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100">
                  <span className="text-[10px] text-rose-600 uppercase font-bold block">Damaged Acreage</span>
                  <span className="text-2xl font-black text-rose-900">{result.damagePercentage}%</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100">
                  <span className="text-[10px] text-amber-600 uppercase font-bold block">Est. Yield Loss</span>
                  <span className="text-2xl font-black text-amber-900">{result.estimatedYieldLossPercent}%</span>
                </div>
              </div>

              {/* Insurance Eligibility */}
              <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                result.insuranceClaimEligible
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                  : 'bg-stone-50 border-stone-200 text-stone-700'
              }`}>
                <div className="flex items-center gap-2 font-bold">
                  {result.insuranceClaimEligible ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>PMFBY Crop Insurance: Eligible for Claim</span>
                    </>
                  ) : (
                    <>
                      <Info className="w-4 h-4 text-stone-500" />
                      <span>Below 33% Loss Threshold</span>
                    </>
                  )}
                </div>
                <p className="text-[11px] leading-relaxed">
                  {result.insuranceClaimEligible
                    ? 'Field damage exceeds the statutory 33% threshold under Pradhan Mantri Fasal Bima Yojana. Notarize on blockchain to generate a verifiable digital loss survey certificate.'
                    : 'Damage is within manageable localized thresholds. Apply targeted mitigation below.'}
                </p>
              </div>

              {/* Action Required */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-stone-800 uppercase tracking-wider text-[10px] block">
                  Agronomic Mitigation Protocol:
                </span>
                <p className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-stone-700 leading-relaxed">
                  {result.actionRequired}
                </p>
              </div>

              {/* Blockchain Notary Button */}
              <button
                onClick={handleNotarizeClaim}
                disabled={notarizing}
                className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
              >
                <FileCheck className="w-4 h-4" />
                {notarizing ? 'Anchoring Audit...' : 'Anchor Survey on Blockchain'}
              </button>

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-stone-200/80 shadow-xs flex items-center justify-center">
              <LoadingSpinner text="Analyzing Field Boundaries with YOLOv8..." size="lg" />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
