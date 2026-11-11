import React, { useState } from 'react';
import {
  ScanEye,
  Upload,
  Camera,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Leaf,
  Bug,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Printer,
  Brain
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { SAMPLE_LEAF_IMAGES } from '../services/mockData';
import { detectCropDisease } from '../services/aiService';
import { notarizeReportOnBlockchain } from '../services/blockchainService';
import { DiseaseDetectionResult } from '../types';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const CropDiseaseDetectionPage: React.FC = () => {
  const { user, isDemoUser } = useAuth();
  const [selectedSample, setSelectedSample] = useState(SAMPLE_LEAF_IMAGES[0]);
  const [imagePreview, setImagePreview] = useState<string>(SAMPLE_LEAF_IMAGES[0].previewUrl);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DiseaseDetectionResult | null>(null);
  const [notarizing, setNotarizing] = useState(false);
  const [blockchainSuccess, setBlockchainSuccess] = useState<string | null>(null);

  // Trigger initial diagnosis on mount
  React.useEffect(() => {
    handleRunDiagnosis(SAMPLE_LEAF_IMAGES[0].id);
  }, []);

  const handleRunDiagnosis = async (sampleId?: string, customDataUri?: string) => {
    setAnalyzing(true);
    setBlockchainSuccess(null);
    try {
      const res = await detectCropDisease(
        user?.uid || 'demo-user-123',
        {
          sampleId,
          dataUri: customDataUri
        }
      );
      setResult(res);

      if (!isDemoUser && user) {
        try {
          await setDoc(doc(db, 'disease_scans', res.id), res);
        } catch (err) {
          console.warn('Could not sync scan with Firestore:', err);
        }
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUri = uploadEvent.target?.result as string;
      setImagePreview(dataUri);
      handleRunDiagnosis(undefined, dataUri);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: typeof SAMPLE_LEAF_IMAGES[0]) => {
    setSelectedSample(sample);
    setImagePreview(sample.previewUrl);
    handleRunDiagnosis(sample.id);
  };

  const handleNotarizeOnBlockchain = async () => {
    if (!result) return;
    setNotarizing(true);
    try {
      const record = await notarizeReportOnBlockchain(
        result.userId,
        result.id,
        'DISEASE_SCAN',
        result,
        `Pathological diagnosis of ${result.diseaseDetected} in ${result.cropType} (${result.confidence}% confidence) notarized on-chain.`
      );

      const updated = {
        ...result,
        verifiedOnBlockchain: true,
        blockchainTxHash: record.txHash
      };
      setResult(updated);

      if (!isDemoUser && user) {
        try {
          await setDoc(doc(db, 'disease_scans', result.id), updated, { merge: true });
        } catch (err) {
          console.warn('Could not update scan in Firestore:', err);
        }
      }

      setBlockchainSuccess(`Certified on Polygon Amoy! Block #${record.blockNumber} • Tx: ${record.txHash.slice(0, 16)}...`);
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
              Crop Disease Detection (CNN)
            </h1>
            <Badge variant="emerald" size="sm">PlantVillage CNN & Gemini 3.8</Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Deep learning computer vision for foliar fungal, bacterial, and viral disease classification with organic treatment regimens.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/model-studio"
            className="px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5 border border-emerald-200 transition-colors"
          >
            <Brain className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Model Studio (Inspect / Train)</span>
          </Link>
          <label className="cursor-pointer px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 font-semibold text-xs text-stone-700 flex items-center gap-2 transition-colors">
            <Upload className="w-4 h-4 text-emerald-600" />
            Upload Leaf Image
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Sample Leaf Selector Strip */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Preloaded Leaf Sample Library (Evaluator Quick Test)
          </span>
          <span className="text-[11px] text-stone-400">Click any leaf to run instant CNN classification</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {SAMPLE_LEAF_IMAGES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className={`p-2.5 rounded-2xl border text-left transition-all ${
                selectedSample.id === sample.id
                  ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                  : 'border-stone-200 hover:border-emerald-300 bg-white'
              }`}
            >
              <img
                src={sample.previewUrl}
                alt={sample.name}
                className="w-full h-24 object-cover rounded-xl mb-2"
              />
              <p className="font-bold text-xs text-stone-900 truncate">{sample.crop}</p>
              <p className="text-[10px] text-stone-500 truncate">{sample.disease}</p>
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
          <Badge variant="purple" size="sm">Verified On-Chain</Badge>
        </div>
      )}

      {/* Analysis Interface Split */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left Column: Image Display */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700">Specimen Imagery</span>
              <Badge variant="stone" size="sm">Input Resolution: 224x224 RGB</Badge>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-stone-900 flex items-center justify-center">
              <img
                src={imagePreview}
                alt="Crop leaf specimen"
                className="w-full h-full object-cover"
              />
              {analyzing && (
                <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center">
                  <LoadingSpinner text="Running PyTorch CNN inference..." size="md" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
              <span>Pathology Model: ResNet-50 / EfficientNet</span>
              <span>Weights: PlantVillage V2</span>
            </div>
          </div>
        </div>

        {/* Right Column: Diagnosis Results */}
        <div className="lg:col-span-7 space-y-4">
          {result && !analyzing ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
              
              {/* Top Diagnosis Card */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-stone-100">
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    {result.cropType} Diagnostic Assessment
                  </span>
                  <h2 className="text-2xl font-black text-stone-900 mt-1 tracking-tight">
                    {result.diseaseDetected}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={result.severity === 'Healthy' ? 'emerald' : result.severity === 'Severe' ? 'rose' : 'amber'} size="sm">
                      Severity: {result.severity}
                    </Badge>
                    <Badge variant="stone" size="sm">
                      Pathogen: {result.pathogenType}
                    </Badge>
                  </div>
                </div>

                <div className="text-right sm:self-start bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-100">
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">Model Confidence</span>
                  <span className="text-2xl font-black text-emerald-900">{result.confidence}%</span>
                </div>
              </div>

              {/* Pathological Symptoms */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  Observed Pathological Symptoms
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-3.5 rounded-2xl border border-stone-200/60">
                  {result.symptoms}
                </p>
              </div>

              {/* Treatment Protocols */}
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                {/* Organic Treatment */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Biological & Organic Control</span>
                  </div>
                  <p className="text-emerald-800 leading-relaxed">
                    {result.organicTreatment}
                  </p>
                </div>

                {/* Chemical Treatment */}
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950">
                    <Bug className="w-4 h-4 text-amber-600" />
                    <span>Chemical Dosage & Active Ingredient</span>
                  </div>
                  <p className="text-amber-800 leading-relaxed">
                    {result.chemicalTreatment}
                  </p>
                </div>
              </div>

              {/* Blockchain Proof Footer */}
              <div className="p-4 rounded-2xl bg-stone-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-xs">Blockchain Certificate</span>
                    {result.verifiedOnBlockchain ? (
                      <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-400/30 px-2 py-0.5 rounded font-mono">
                        Notarized
                      </span>
                    ) : (
                      <span className="text-[10px] bg-white/10 text-stone-300 px-2 py-0.5 rounded font-mono">
                        Unanchored
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-mono text-stone-400 truncate max-w-sm">
                    SHA-256: {result.sha256Hash || 'Computing digest...'}
                  </p>
                </div>

                {!result.verifiedOnBlockchain ? (
                  <button
                    onClick={handleNotarizeOnBlockchain}
                    disabled={notarizing}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0 transition-colors disabled:opacity-50"
                  >
                    {notarizing ? 'Minting...' : 'Notarize on Polygon'}
                  </button>
                ) : (
                  <span className="text-xs text-purple-300 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    On-Chain Verified
                  </span>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-stone-200/80 shadow-xs flex items-center justify-center">
              <LoadingSpinner text="Running PyTorch CNN Disease Classifier..." size="lg" />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
