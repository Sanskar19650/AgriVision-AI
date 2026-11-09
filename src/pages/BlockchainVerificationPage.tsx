import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Cpu,
  FileCheck2
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import {
  getStoredBlockchainRecords,
  verifyRecordAuthenticity,
  computeSHA256,
  SOLIDITY_CONTRACT_SOURCE
} from '../services/blockchainService';
import { BlockchainRecord } from '../types';

export const BlockchainVerificationPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    performed: boolean;
    verified: boolean;
    record?: BlockchainRecord;
  }>({ performed: false, verified: false });

  // Custom SHA-256 hasher tool state
  const [hasherInput, setHasherInput] = useState('{"farmer": "Ramesh Patil", "crop": "Tomato", "disease": "Early Blight", "loss": "34%"}');
  const [computedDigest, setComputedDigest] = useState('');
  const [copiedContract, setCopiedContract] = useState(false);
  const [activeTab, setActiveTab] = useState<'explorer' | 'verify' | 'contract'>('explorer');

  const records = getStoredBlockchainRecords();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const res = verifyRecordAuthenticity(searchQuery);
    setVerificationResult({
      performed: true,
      verified: res.verified,
      record: res.record
    });
  };

  const handleComputeHash = async () => {
    const hash = await computeSHA256(hasherInput);
    setComputedDigest(hash);
  };

  const handleCopySolidity = () => {
    navigator.clipboard.writeText(SOLIDITY_CONTRACT_SOURCE);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Blockchain Verification & Ledger Explorer
            </h1>
            <Badge variant="purple" size="sm">Polygon PoS Testnet (Amoy)</Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Immutable SHA-256 notarization preventing insurance claim fraud and agricultural certificate tampering.
          </p>
        </div>

        {/* Tab switch */}
        <div className="bg-stone-100 p-1 rounded-2xl flex items-center text-xs font-semibold">
          <button
            onClick={() => setActiveTab('explorer')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'explorer' ? 'bg-white text-purple-900 shadow-xs' : 'text-stone-600'
            }`}
          >
            Ledger Feed
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'verify' ? 'bg-white text-purple-900 shadow-xs' : 'text-stone-600'
            }`}
          >
            Verify Hash
          </button>
          <button
            onClick={() => setActiveTab('contract')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'contract' ? 'bg-white text-purple-900 shadow-xs' : 'text-stone-600'
            }`}
          >
            Smart Contract
          </button>
        </div>
      </div>

      {/* Smart Contract Technical Spec Card */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Smart Contract Address</span>
          <p className="font-mono text-purple-900 font-bold mt-1 truncate">
            0x3F88a5312788e078E490cB4A66524Cd4E2f78235
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Consensus Mechanism</span>
          <p className="font-bold text-stone-900 mt-1">Proof-of-Stake (PoS)</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Cryptographic Digest</span>
          <p className="font-bold text-stone-900 mt-1">256-Bit SHA-256 (Keccak-256)</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Notarized Records</span>
          <p className="font-bold text-emerald-700 mt-1">{records.length} Confirmed Blocks</p>
        </div>
      </div>

      {/* TAB 1: Ledger Explorer */}
      {activeTab === 'explorer' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-stone-900">Mined Agricultural Blocks Feed</h3>
              <p className="text-xs text-stone-500">Real-time block stream on Polygon Amoy testnet</p>
            </div>
            <Badge variant="purple" size="sm">EVM Compatible</Badge>
          </div>

          <div className="space-y-3">
            {records.map((rec) => (
              <div
                key={rec.id}
                className="p-5 rounded-2xl bg-purple-50/30 border border-purple-100/80 hover:bg-purple-50/60 transition-colors text-xs space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-purple-900 text-purple-100 font-mono font-bold text-xs">
                      Block #{rec.blockNumber}
                    </span>
                    <Badge variant="purple" size="sm">{rec.reportType}</Badge>
                    <span className="font-semibold text-stone-700">Report ID: {rec.reportId}</span>
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">
                    {new Date(rec.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-2 pt-2 border-t border-purple-100/60 text-[11px] font-mono">
                  <div>
                    <span className="text-stone-400 block">SHA-256 Hash Digest:</span>
                    <span className="text-purple-950 font-bold truncate block">{rec.sha256Hash}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Transaction Hash (Tx):</span>
                    <span className="text-stone-700 truncate block">{rec.txHash}</span>
                  </div>
                </div>

                {rec.auditorNotes && (
                  <p className="text-[11px] text-stone-600 bg-white/70 p-2 rounded-lg border border-purple-100/50">
                    <strong>Smart Contract Memo:</strong> {rec.auditorNotes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Verify Hash Tool */}
      {activeTab === 'verify' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Search / Verify Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
            <div>
              <h3 className="font-bold text-sm text-stone-900">Verify Report Authenticity</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Paste any SHA-256 digest or transaction hash to verify whether it exists in the immutable ledger.
              </p>
            </div>

            <form onSubmit={handleSearch} className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Paste SHA-256 hash or Tx hash (e.g. e3b0c44...)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 font-mono text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                Query Blockchain Ledger
              </button>
            </form>

            {verificationResult.performed && (
              <div className={`p-5 rounded-2xl border text-xs space-y-2 animate-in fade-in ${
                verificationResult.verified
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {verificationResult.verified ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Tamper-Proof Verification Successful!</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                      <span>Hash Not Found on Blockchain!</span>
                    </>
                  )}
                </div>
                <p className="text-[11px] leading-relaxed">
                  {verificationResult.verified
                    ? `This agricultural assessment is mathematically proven authentic. Registered in Block #${verificationResult.record?.blockNumber} with zero tamper alterations.`
                    : 'The provided hash does not match any notarized record in the AgriVerification contract. The report may be uncertified or modified.'}
                </p>
              </div>
            )}
          </div>

          {/* Interactive SHA-256 Hash Generator */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-sm text-stone-900">Interactive SHA-256 Digest Calculator</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Type or paste JSON report payload to generate its cryptographic signature:
              </p>
            </div>

            <textarea
              rows={4}
              value={hasherInput}
              onChange={e => setHasherInput(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-300 font-mono text-xs focus:ring-2 focus:ring-purple-500 outline-none"
            />

            <button
              onClick={handleComputeHash}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs transition-colors"
            >
              Generate SHA-256 Digest
            </button>

            {computedDigest && (
              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-100 text-xs font-mono space-y-1">
                <span className="text-[10px] text-purple-700 font-bold uppercase block">Resulting 256-bit Digest:</span>
                <span className="text-purple-950 break-all font-bold">{computedDigest}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Solidity Smart Contract Source */}
      {activeTab === 'contract' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-purple-600" />
                AgriVerification.sol (Solidity v0.8.20)
              </h3>
              <p className="text-xs text-stone-500">Academic capstone reference code for local Hardhat / Ganache deployment</p>
            </div>
            <button
              onClick={handleCopySolidity}
              className="px-3.5 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-xs font-bold text-stone-700 flex items-center gap-1.5 transition-colors"
            >
              {copiedContract ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedContract ? 'Copied to Clipboard' : 'Copy Source Code'}
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-stone-900 text-emerald-400 font-mono text-xs overflow-x-auto max-h-[460px] leading-relaxed">
            {SOLIDITY_CONTRACT_SOURCE}
          </pre>
        </div>
      )}
    </div>
  );
};
