import React, { useState } from 'react';
import {
  FileBarChart2,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Filter,
  Search,
  ExternalLink,
  QrCode
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { INITIAL_BLOCKCHAIN_RECORDS, INITIAL_SOIL_READINGS, SAMPLE_LEAF_IMAGES } from '../services/mockData';
import { useAuth } from '../context/AuthContext';

export const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [filterType, setFilterType] = useState('ALL');
  const [selectedAudit, setSelectedAudit] = useState(INITIAL_BLOCKCHAIN_RECORDS[0]);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const filteredRecords = filterType === 'ALL'
    ? INITIAL_BLOCKCHAIN_RECORDS
    : INITIAL_BLOCKCHAIN_RECORDS.filter(r => r.reportType === filterType);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Reports & Notarized Audit Certificates
            </h1>
            <Badge variant="purple" size="sm">Cryptographically Sealed</Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Export official field verification certificates with SHA-256 integrity hashes for bank loans, crop insurance claims, and organic certification.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedAudit(INITIAL_BLOCKCHAIN_RECORDS[0]);
            setShowPrintModal(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
        >
          <Printer className="w-4 h-4" />
          Preview Official Certificate
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-400" />
          <span className="font-bold text-stone-600">Filter Category:</span>
          {['ALL', 'DISEASE_SCAN', 'SOIL_TEST', 'DAMAGE_AUDIT'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              className={`px-3 py-1.5 rounded-xl transition-all font-semibold ${
                filterType === cat
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat === 'ALL' ? 'All Certificates' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        <span className="text-stone-400 font-mono text-[11px]">
          Showing {filteredRecords.length} Verified Entries
        </span>
      </div>

      {/* Audit Certificates Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-5">Block #</th>
                <th className="py-3.5 px-5">Audit Type</th>
                <th className="py-3.5 px-5">Report Identifier</th>
                <th className="py-3.5 px-5">SHA-256 Digest</th>
                <th className="py-3.5 px-5">Timestamp</th>
                <th className="py-3.5 px-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-4 px-5 font-mono font-bold text-purple-900">
                    #{rec.blockNumber}
                  </td>
                  <td className="py-4 px-5">
                    <Badge variant={rec.reportType === 'DISEASE_SCAN' ? 'emerald' : rec.reportType === 'SOIL_TEST' ? 'blue' : 'rose'} size="sm">
                      {rec.reportType.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="py-4 px-5 font-semibold text-stone-900">
                    {rec.reportId}
                  </td>
                  <td className="py-4 px-5 font-mono text-stone-500 truncate max-w-[180px]">
                    {rec.sha256Hash}
                  </td>
                  <td className="py-4 px-5 text-stone-500">
                    {new Date(rec.timestamp).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-5">
                    <button
                      onClick={() => {
                        setSelectedAudit(rec);
                        setShowPrintModal(true);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-stone-300 hover:border-emerald-500 hover:text-emerald-800 text-stone-700 font-bold transition-all text-[11px]"
                    >
                      Certificate →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Certificate Modal */}
      {showPrintModal && selectedAudit && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 my-8">
            
            {/* Modal Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6 print:hidden">
              <span className="font-bold text-xs uppercase tracking-wider text-emerald-700">
                Official Agricultural Certificate Preview
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-3 py-2 rounded-xl border border-stone-300 font-semibold text-xs text-stone-700 hover:bg-stone-50"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Printable Certificate Body */}
            <div className="border-4 border-double border-emerald-900/40 p-6 rounded-2xl bg-stone-50/50 space-y-6">
              
              {/* Certificate Header */}
              <div className="text-center space-y-2 border-b-2 border-stone-200 pb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-700 text-white shadow-sm mb-1">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-widest text-emerald-950">
                  AgriVision AI Certified Notarization
                </h2>
                <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500">
                  Polygon Proof-of-Stake Immutable Ledger Verification Certificate
                </p>
              </div>

              {/* Certificate Details */}
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-stone-200">
                  <div>
                    <span className="text-[10px] text-stone-400 font-bold uppercase block">Owner / Applicant</span>
                    <span className="text-sm font-bold text-stone-900">{user?.fullName || 'Rameshwar Patil'}</span>
                    <span className="text-[11px] text-stone-500 block">Nashik Agro-Cluster, Maharashtra</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 font-bold uppercase block">Audit Type</span>
                    <span className="text-sm font-bold text-emerald-800">{selectedAudit.reportType.replace('_', ' ')}</span>
                    <span className="text-[11px] text-stone-500 block">Record ID: {selectedAudit.reportId}</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2 font-mono text-[11px]">
                  <div>
                    <span className="text-[10px] text-stone-400 font-sans font-bold uppercase block">
                      Cryptographic SHA-256 Digest:
                    </span>
                    <span className="text-purple-950 font-bold break-all block">
                      {selectedAudit.sha256Hash}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 font-sans font-bold uppercase block">
                      Ethereum/Polygon Transaction Hash:
                    </span>
                    <span className="text-stone-700 break-all block">
                      {selectedAudit.txHash}
                    </span>
                  </div>
                </div>

                {selectedAudit.auditorNotes && (
                  <div className="p-3 bg-white rounded-xl border border-stone-200 text-stone-700 text-[11px] italic">
                    "{selectedAudit.auditorNotes}"
                  </div>
                )}
              </div>

              {/* Certificate Footer with Signature & Stamp */}
              <div className="pt-4 border-t-2 border-stone-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-white border border-stone-300 flex items-center justify-center p-1">
                    <QrCode className="w-10 h-10 text-stone-800" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block text-[11px]">Scan to Verify On-Chain</span>
                    <span className="text-[10px] text-stone-500">Contract: 0x3F88...8235</span>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="font-serif italic text-base text-emerald-900 font-bold">
                    Dr. Ananya Sharma
                  </div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block border-t border-stone-300 pt-0.5">
                    Authorized Agricultural Officer
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};
