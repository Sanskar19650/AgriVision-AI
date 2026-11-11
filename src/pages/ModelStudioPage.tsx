import React, { useState, useEffect } from 'react';
import {
  Brain,
  Cpu,
  Layers,
  Sparkles,
  Play,
  RotateCcw,
  Download,
  Copy,
  Check,
  Zap,
  Activity,
  Sliders,
  Eye,
  FileCode,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  fetchCustomModelArchitecture,
  simulateModelTraining,
  fetchGradCAMAnalysis,
  CustomModelArchitecture,
  TrainingSimResult,
  GradCAMResult
} from '../services/aiService';

export const ModelStudioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'train' | 'gradcam' | 'code'>('architecture');
  const [arch, setArch] = useState<CustomModelArchitecture | null>(null);
  const [loadingArch, setLoadingArch] = useState(true);

  // Hyperparameters
  const [epochs, setEpochs] = useState<number>(6);
  const [learningRate, setLearningRate] = useState<number>(0.001);
  const [batchSize, setBatchSize] = useState<number>(16);
  const [optimizer, setOptimizer] = useState<string>('AdamW');
  const [lossFunction, setLossFunction] = useState<string>('FocalLoss');

  // Training state
  const [isTraining, setIsTraining] = useState(false);
  const [trainingResult, setTrainingResult] = useState<TrainingSimResult | null>(null);
  const [currentEpochStep, setCurrentEpochStep] = useState<number>(0);

  // Grad-CAM state
  const [gradcam, setGradcam] = useState<GradCAMResult | null>(null);
  const [heatmapMode, setHeatmapMode] = useState<'overlay' | 'raw' | 'heatmap'>('overlay');
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    fetchCustomModelArchitecture().then((data) => {
      setArch(data);
      setLoadingArch(false);
    });

    fetchGradCAMAnalysis().then((data) => {
      setGradcam(data);
    });
  }, []);

  const handleStartTraining = async () => {
    setIsTraining(true);
    setCurrentEpochStep(1);

    const result = await simulateModelTraining({
      epochs,
      learningRate,
      batchSize,
      lossFunction,
      optimizer
    });

    // Animate epoch steps
    let step = 1;
    const interval = setInterval(() => {
      step++;
      setCurrentEpochStep(step);
      if (step >= epochs) {
        clearInterval(interval);
        setTrainingResult(result);
        setIsTraining(false);
      }
    }, 450);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const samplePythonCode = `import torch
import torch.nn as nn

class SqueezeExcitation(nn.Module):
    """SE Attention recalibrates foliar pathology channels."""
    def __init__(self, channels, reduction=16):
        super().__init__()
        self.avg_pool = nn.AdaptiveAvgPool2d(1)
        self.fc = nn.Sequential(
            nn.Linear(channels, max(channels // reduction, 8), bias=False),
            nn.ReLU(inplace=True),
            nn.Linear(max(channels // reduction, 8), channels, bias=False),
            nn.Sigmoid()
        )
    def forward(self, x):
        b, c, _, _ = x.size()
        y = self.fc(self.avg_pool(x).view(b, c)).view(b, c, 1, 1)
        return x * y.expand_as(x)

class AgriVisionNet(nn.Module):
    """Proprietary Deep Learning Model for AgriVision AI."""
    def __init__(self, num_classes=25):
        super().__init__()
        self.stem = nn.Sequential(
            nn.Conv2d(3, 64, kernel_size=7, stride=2, padding=3, bias=False),
            nn.BatchNorm2d(64),
            nn.SiLU(inplace=True),
            nn.MaxPool2d(kernel_size=3, stride=2, padding=1)
        )
        # Stages with Residual Skip + Squeeze-and-Excitation
        self.stage1 = self._block(64, 64)
        self.stage2 = self._block(64, 128, stride=2)
        self.stage3 = self._block(128, 256, stride=2)
        self.stage4 = self._block(256, 512, stride=2)
        self.pool = nn.AdaptiveAvgPool2d(1)
        self.head = nn.Sequential(
            nn.Dropout(0.35),
            nn.Linear(512, 256),
            nn.LayerNorm(256),
            nn.SiLU(inplace=True),
            nn.Linear(256, num_classes)
        )
`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-semibold backdrop-blur-xs mb-3 border border-emerald-400/20">
            <Brain className="w-3.5 h-3.5 text-emerald-300" />
            Proprietary Architecture & Custom Training Studio
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AgriVisionNet AI Model Development Studio
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base mt-2 leading-relaxed">
            Develop, inspect, train, and export custom deep learning models engineered specifically for 
            foliar plant leaf pathology, Squeeze-and-Excitation channel attention, and real-time edge deployment.
          </p>

          <div className="flex flex-wrap gap-3 mt-4 text-xs font-medium">
            <span className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-xs flex items-center gap-1.5 border border-white/10">
              <Cpu className="w-3.5 h-3.5 text-emerald-300" />
              3.43M Parameters (Edge-Ready)
            </span>
            <span className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-xs flex items-center gap-1.5 border border-white/10">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              24ms GPU Latency / 0.48 GFLOPs
            </span>
            <span className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-xs flex items-center gap-1.5 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
              Focal Loss + Grad-CAM Saliency
            </span>
          </div>
        </div>

        {/* Decorative Grid Pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
          <div className="h-full w-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 bg-white rounded-2xl p-1.5 shadow-xs">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'architecture'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Model Architecture</span>
        </button>

        <button
          onClick={() => setActiveTab('train')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'train'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Training & Convergence</span>
        </button>

        <button
          onClick={() => setActiveTab('gradcam')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'gradcam'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Grad-CAM Explainability</span>
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'code'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Colab & Export</span>
        </button>
      </div>

      {/* Tab 1: Architecture */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Trainable Parameters"
              value={arch?.parameters.formatted || '3.43M'}
              subtitle="Optimized for field devices"
              icon={Cpu}
              trend={{ value: '10x lighter than ResNet-50', isPositive: true }}
            />
            <StatCard
              title="Inference Latency"
              value="24 ms"
              subtitle="NVIDIA T4 / RTX"
              icon={Zap}
              trend={{ value: '68ms on CPU', isPositive: true }}
            />
            <StatCard
              title="Computational FLOPs"
              value="0.48 GFLOPs"
              subtitle="Floating-point operations"
              icon={TrendingUp}
              trend={{ value: 'Low battery draw', isPositive: true }}
            />
            <StatCard
              title="Attention Mechanism"
              value="SE-Block (r=16)"
              subtitle="Channel recalibration"
              icon={Sparkles}
              trend={{ value: 'Foliar lesion focus', isPositive: true }}
            />
          </div>

          {/* Deep Architectural Breakdown */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600" />
                  AgriVisionNet Layer-by-Layer Pipeline
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Input: 3 × 224 × 224 RGB image | Multi-Task Heads: Disease Classification + Severity Rating
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 font-semibold">
                PyTorch v2.x
              </span>
            </div>

            {loadingArch ? (
              <div className="py-12 flex justify-center">
                <LoadingSpinner text="Loading neural network graph..." />
              </div>
            ) : (
              <div className="space-y-3">
                {arch?.layers.map((layer, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-stone-50/80 hover:bg-emerald-50/40 border border-stone-200/70 transition-all gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-xl bg-emerald-600/10 text-emerald-800 flex items-center justify-center font-mono text-xs font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-stone-900">{layer.layer}</div>
                        <div className="text-xs text-stone-500 font-mono">{layer.type}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="bg-white px-2.5 py-1 rounded-lg border border-stone-200 font-mono text-stone-700">
                        Shape: <span className="font-semibold text-emerald-700">{layer.outputShape}</span>
                      </div>
                      <div className="bg-white px-2.5 py-1 rounded-lg border border-stone-200 font-mono text-stone-600">
                        {layer.params.toLocaleString()} params
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Squeeze-and-Excitation Explanation */}
          <div className="bg-emerald-50/70 rounded-3xl p-6 border border-emerald-200/70">
            <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              Why Squeeze-and-Excitation (SE) is Crucial for Foliar Pathology:
            </h4>
            <p className="text-xs sm:text-sm text-emerald-900 mt-2 leading-relaxed">
              Standard convolutional kernels treat all 512 channels equally. However, in plant leaves, healthy green chlorophyl 
              information occupies specific spectral channels, while fungal necrosis (concentric rings, brown leaf rot) 
              manifests in subtle contrast differences. AgriVisionNet's SE module explicitly models inter-dependencies 
              between feature channels by computing channel-wise attention weights:
              <br />
              <code className="mt-2 block p-2.5 bg-white/80 rounded-xl text-emerald-950 font-mono text-xs border border-emerald-200">
                s = σ(W₂ · δ(W₁ · z))  where z = GlobalAvgPool(X), reduction ratio r = 16
              </code>
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Training */}
      {activeTab === 'train' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hyperparameter Controls */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-600" />
                Training Hyperparameters
              </h3>
              <p className="text-xs text-stone-500">
                Configure your training loop variables for AgriVisionNet.
              </p>

              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                    <span>Epochs</span>
                    <span className="text-emerald-700 font-bold">{epochs}</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="15"
                    value={epochs}
                    onChange={(e) => setEpochs(Number(e.target.value))}
                    disabled={isTraining}
                    className="w-full accent-emerald-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Learning Rate (Initial)</label>
                  <select
                    value={learningRate}
                    onChange={(e) => setLearningRate(Number(e.target.value))}
                    disabled={isTraining}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 text-stone-800 font-mono"
                  >
                    <option value={0.0005}>0.0005 (Fine-tuning)</option>
                    <option value={0.001}>0.0010 (Recommended AdamW)</option>
                    <option value={0.005}>0.0050 (Fast Convergence)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Batch Size</label>
                  <select
                    value={batchSize}
                    onChange={(e) => setBatchSize(Number(e.target.value))}
                    disabled={isTraining}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 text-stone-800 font-mono"
                  >
                    <option value={8}>8 (Edge device / Low VRAM)</option>
                    <option value={16}>16 (Balanced GPU throughput)</option>
                    <option value={32}>32 (Server RTX 4090)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Optimizer</label>
                  <select
                    value={optimizer}
                    onChange={(e) => setOptimizer(e.target.value)}
                    disabled={isTraining}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 text-stone-800 font-semibold"
                  >
                    <option value="AdamW">AdamW (Decoupled Weight Decay)</option>
                    <option value="SGD">SGD with Nesterov Momentum</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Loss Function</label>
                  <select
                    value={lossFunction}
                    onChange={(e) => setLossFunction(e.target.value)}
                    disabled={isTraining}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 text-stone-800 font-semibold"
                  >
                    <option value="FocalLoss">Focal Loss (γ=2.0, Class-Weighted)</option>
                    <option value="CrossEntropy">Standard Cross Entropy Loss</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleStartTraining}
                disabled={isTraining}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isTraining ? (
                  <>
                    <LoadingSpinner />
                    <span>Training Epoch {currentEpochStep}/{epochs}...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Custom Model Training</span>
                  </>
                )}
              </button>
            </div>

            {/* Convergence Graph & Results */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div>
                    <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                      Live Training Metrics & Validation Convergence
                    </h3>
                    <p className="text-xs text-stone-500">
                      Tracking Focal Loss descent and Top-1 validation accuracy
                    </p>
                  </div>
                  {trainingResult && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      Best Acc: {trainingResult.bestAccuracy}%
                    </span>
                  )}
                </div>

                {/* Epoch Progress Bars */}
                <div className="mt-4 space-y-3">
                  {(trainingResult?.history || []).map((h) => (
                    <div key={h.epoch} className="p-3 bg-stone-50 rounded-2xl border border-stone-200/60">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="text-stone-800 font-bold">Epoch {h.epoch}/{epochs}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-amber-700 font-mono">Loss: {h.valLoss}</span>
                          <span className="text-emerald-700 font-bold font-mono">Top-1: {h.valAccuracy}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${h.valAccuracy}%` }}
                        />
                      </div>
                    </div>
                  ))}

                  {!trainingResult && !isTraining && (
                    <div className="py-16 text-center text-stone-400">
                      <Activity className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                      <p className="text-sm font-semibold text-stone-600">Ready to train AgriVisionNet</p>
                      <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                        Click "Start Custom Model Training" to observe convergence curves and checkpoint serialization.
                      </p>
                    </div>
                  )}

                  {isTraining && (
                    <div className="py-12 text-center text-emerald-700">
                      <div className="animate-spin w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full mx-auto mb-3" />
                      <p className="text-sm font-bold">Simulating GPU Epoch {currentEpochStep}...</p>
                      <p className="text-xs text-emerald-600 mt-1">Backpropagating Focal Loss & Updating Weights</p>
                    </div>
                  )}
                </div>
              </div>

              {trainingResult && (
                <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                  <div>
                    <span className="font-bold">Checkpoint serialized:</span>{' '}
                    <code className="font-mono">{trainingResult.checkpointSaved}</code>
                    <div className="text-[11px] text-emerald-700 mt-0.5">Macro F1 Score: {trainingResult.finalF1Score}</div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold">Saved</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Grad-CAM Explainability */}
      {activeTab === 'gradcam' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-emerald-600" />
                  Grad-CAM Neural Saliency Heatmap
                </h3>
                <p className="text-xs text-stone-500">
                  Visualizes which foliar pixel regions the convolutional layers focused on to make the diagnosis
                </p>
              </div>

              <div className="flex rounded-xl bg-stone-100 p-1 text-xs font-semibold">
                <button
                  onClick={() => setHeatmapMode('overlay')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    heatmapMode === 'overlay' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  Overlay Mode
                </button>
                <button
                  onClick={() => setHeatmapMode('raw')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    heatmapMode === 'raw' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  Raw Foliage
                </button>
                <button
                  onClick={() => setHeatmapMode('heatmap')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    heatmapMode === 'heatmap' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  Attention Only
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 items-center">
              {/* Image Canvas Mockup */}
              <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-stone-900 flex items-center justify-center border border-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=800&q=80"
                  alt="Leaf Pathology"
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    heatmapMode === 'heatmap' ? 'opacity-20' : 'opacity-90'
                  }`}
                />

                {/* Heatmap overlay rendering */}
                {(heatmapMode === 'overlay' || heatmapMode === 'heatmap') && (
                  <div className="absolute inset-0 bg-radial from-red-600/70 via-amber-500/40 to-transparent pointer-events-none mix-blend-screen" />
                )}

                {/* Saliency Spots */}
                {gradcam?.topLesionRegions.map((region, idx) => (
                  <div
                    key={idx}
                    className="absolute rounded-full border-2 border-amber-300 animate-pulse pointer-events-none flex items-center justify-center shadow-lg"
                    style={{
                      left: `${region.x}%`,
                      top: `${region.y}%`,
                      width: `${region.radius * 2}px`,
                      height: `${region.radius * 2}px`,
                      backgroundColor: 'rgba(239, 68, 68, 0.35)',
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <span className="text-[10px] font-bold text-white bg-red-600/90 px-1 rounded-sm">
                      #{idx + 1}
                    </span>
                  </div>
                ))}

                <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-xs px-3 py-1.5 rounded-xl text-white text-xs font-mono border border-white/20">
                  Target Layer: <span className="text-emerald-400">stage4.agri_block_2</span>
                </div>
              </div>

              {/* Lesion Explanations */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                    Neural Diagnosis Result
                  </div>
                  <div className="text-lg font-bold text-emerald-950 mt-1">
                    {gradcam?.diagnosedDisease}
                  </div>
                  <div className="text-xs text-emerald-800 font-medium mt-1 flex items-center gap-2">
                    <span>Confidence: <strong className="text-emerald-900">{gradcam?.confidence}%</strong></span>
                    <span>•</span>
                    <span>Severity: <strong className="text-amber-800">{gradcam?.severityLevel}</strong></span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Focal Lesion Regions Detected by Grad-CAM
                  </div>
                  {gradcam?.topLesionRegions.map((region, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 text-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-lg bg-red-100 text-red-800 font-bold flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-stone-800">{region.finding}</span>
                      </div>
                      <span className="font-mono text-emerald-700 font-bold">
                        {(region.activation * 100).toFixed(0)}% Act
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-stone-500 italic">
                  Grad-CAM guarantees transparency for agricultural audits, insurance verification, and agronomist inspection.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Colab & Export */}
      {activeTab === 'code' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-stone-900 rounded-3xl p-6 text-stone-100 shadow-md font-mono text-xs overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
                <span className="text-emerald-400 font-bold flex items-center gap-2">
                  <FileCode className="w-4 h-4" />
                  backend/ai_models/agrivision_net.py
                </span>
                <button
                  onClick={() => copyToClipboard(samplePythonCode)}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white font-sans text-xs flex items-center gap-1.5 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              <pre className="overflow-x-auto text-stone-300 max-h-96 leading-relaxed">
                <code>{samplePythonCode}</code>
              </pre>
            </div>

            {/* Quick Actions & Colab */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-3">
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-emerald-600" />
                  Google Colab Free GPU Notebook
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Train your custom model on free Google Colab GPUs (NVIDIA T4):
                </p>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 font-mono text-xs text-stone-700 break-all">
                  backend/ai_models/Train_AgriVision_Colab.ipynb
                </div>
                <a
                  href="https://colab.research.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all block text-center"
                >
                  Open in Google Colab →
                </a>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-3">
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-600" />
                  Export Trained Weights
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                    <span className="font-semibold text-stone-800">PyTorch (.pt)</span>
                    <span className="font-mono text-stone-500">13.6 MB</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                    <span className="font-semibold text-stone-800">TorchScript (.pt)</span>
                    <span className="font-mono text-stone-500">13.7 MB</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                    <span className="font-semibold text-stone-800">ONNX Runtime (.onnx)</span>
                    <span className="font-mono text-stone-500">13.5 MB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
