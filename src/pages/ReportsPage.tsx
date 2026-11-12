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
  QrCode,
  FileCode,
  FileText
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { INITIAL_BLOCKCHAIN_RECORDS } from '../services/mockData';
import { useAuth } from '../context/AuthContext';
import { BlockchainRecord } from '../types';

export const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [filterType, setFilterType] = useState('ALL');
  const [selectedAudit, setSelectedAudit] = useState<BlockchainRecord>(INITIAL_BLOCKCHAIN_RECORDS[0]);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  const filteredRecords = filterType === 'ALL'
    ? INITIAL_BLOCKCHAIN_RECORDS
    : INITIAL_BLOCKCHAIN_RECORDS.filter(r => r.reportType === filterType);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReport = (record: BlockchainRecord, format: 'html' | 'json' = 'html') => {
    const farmerName = user?.fullName || 'Rameshwar Patil';
    const reportDate = new Date(record.timestamp).toLocaleDateString();

    if (format === 'json') {
      const jsonPayload = {
        title: 'AgriVision AI Certified Notarization Ledger',
        recordId: record.id,
        reportId: record.reportId,
        reportType: record.reportType,
        farmer: {
          name: farmerName,
          uid: record.userId,
          region: user?.region || 'Nashik Agro-Cluster, Maharashtra'
        },
        cryptographicProof: {
          sha256Digest: record.sha256Hash,
          blockchainTxHash: record.txHash,
          blockNumber: record.blockNumber,
          smartContractAddress: record.contractAddress,
          network: record.network,
          consensusStatus: record.status
        },
        auditorNotes: record.auditorNotes || 'Official automated diagnostic assessment certified via smart contract.',
        certifiedAt: record.timestamp
      };

      const blob = new Blob([JSON.stringify(jsonPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AgriVision_Audit_${record.reportId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // HTML Printable & Sealed Certificate Download
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AgriVision AI Notarized Certificate - ${record.reportId}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f9f9f7; color: #1c1917; padding: 40px; }
    .certificate-card { max-width: 800px; margin: 0 auto; background: #ffffff; border: 4px double #047857; border-radius: 16px; padding: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
    .header { text-align: center; border-bottom: 2px solid #e7e5e4; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { margin: 0; color: #064e3b; letter-spacing: 2px; font-size: 24px; text-transform: uppercase; }
    .header p { margin: 5px 0 0; color: #78716c; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; font-weight: bold; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
    .box { background: #f5f5f4; border-radius: 8px; padding: 16px; border: 1px solid #e7e5e4; font-size: 13px; }
    .box-label { font-size: 10px; font-weight: bold; text-transform: uppercase; color: #78716c; margin-bottom: 4px; display: block; }
    .box-val { font-size: 16px; font-weight: bold; color: #1c1917; }
    .crypto-box { background: #fdf4ff; border: 1px solid #f0abfc; border-radius: 8px; padding: 16px; margin-bottom: 24px; font-family: monospace; font-size: 12px; }
    .crypto-box strong { color: #581c87; font-family: sans-serif; font-size: 11px; text-transform: uppercase; display: block; margin-bottom: 4px; }
    .notes { font-style: italic; background: #ecfdf5; border-left: 4px solid #059669; padding: 12px 16px; font-size: 13px; color: #065f46; margin-bottom: 30px; border-radius: 0 8px 8px 0; }
    .footer { display: flex; justify-content: space-between; align-items: flex-end; border-top: 2px solid #e7e5e4; padding-top: 20px; font-size: 12px; }
    .signature { text-align: right; }
    .signature-name { font-family: serif; font-style: italic; font-size: 18px; color: #064e3b; font-weight: bold; }
    .badge { display: inline-block; background: #059669; color: white; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="certificate-card">
    <div class="header">
      <div style="font-size: 32px; color: #059669; margin-bottom: 8px;">🛡️</div>
      <h1>AgriVision AI Certified Field Notarization</h1>
      <p>Polygon Amoy Proof-of-Stake Immutable Ledger Verification Certificate</p>
    </div>

    <div class="grid">
      <div class="box">
        <span class="box-label">Farmer / Landowner</span>
        <span class="box-val">${farmerName}</span>
        <div style="font-size: 12px; color: #78716c; margin-top: 4px;">Region: ${user?.region || 'Nashik Agro-Cluster, Maharashtra'}</div>
      </div>
      <div class="box">
        <span class="box-label">Audit Type & Identifier</span>
        <span class="box-val">${record.reportType.replace('_', ' ')}</span>
        <div style="font-size: 12px; color: #78716c; margin-top: 4px;">Report ID: ${record.reportId} | Date: ${reportDate}</div>
      </div>
    </div>

    <div class="crypto-box">
      <strong>Cryptographic SHA-256 Digest:</strong>
      <div style="word-break: break-all; color: #581c87; font-weight: bold;">${record.sha256Hash}</div>
      <br/>
      <strong>Blockchain Transaction Hash:</strong>
      <div style="word-break: break-all; color: #44403c;">${record.txHash}</div>
      <br/>
      <div style="display: flex; gap: 20px; font-size: 11px; color: #57534e;">
        <span>Block Number: <strong>#${record.blockNumber}</strong></span>
        <span>Network: <strong>${record.network}</strong></span>
        <span>Consensus Status: <strong>${record.status}</strong></span>
      </div>
    </div>

    <div class="notes">
      "${record.auditorNotes || 'Official automated diagnostic assessment certified via smart contract.'}"
    </div>

    <div class="footer">
      <div>
        <span class="badge">POLYGON VERIFIED</span>
        <div style="font-size: 11px; color: #78716c; margin-top: 6px;">Smart Contract: ${record.contractAddress}</div>
      </div>
      <div class="signature">
        <div class="signature-name">Dr. Ananya Sharma</div>
        <div style="font-size: 10px; text-transform: uppercase; color: #78716c; font-weight: bold; border-top: 1px solid #d6d3d1; padding-top: 4px;">
          Authorized Agricultural Inspector
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AgriVision_Certificate_${record.reportId}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    setDownloadSuccessToast(`Certificate for ${record.reportId} downloaded as .${format} successfully!`);
    setTimeout(() => setDownloadSuccessToast(null), 3500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Real-time Download Toast */}
      {downloadSuccessToast && (
        <div className="p-4 rounded-2xl bg-emerald-900 text-white shadow-xl border border-emerald-500/50 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{downloadSuccessToast}</span>
          </div>
          <button
            onClick={() => setDownloadSuccessToast(null)}
            className="text-stone-300 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>
      )}

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
            Export and download official field verification certificates with SHA-256 integrity hashes for bank loans, crop insurance claims, and organic certification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownloadReport(selectedAudit, 'html')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors shrink-0"
          >
            <Download className="w-4 h-4" />
            Download Active Report (.html)
          </button>
          <button
            onClick={() => {
              setSelectedAudit(INITIAL_BLOCKCHAIN_RECORDS[0]);
              setShowPrintModal(true);
            }}
            className="px-3.5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-xs flex items-center gap-2 transition-colors shrink-0"
          >
            <Printer className="w-4 h-4" />
            Preview Certificate
          </button>
        </div>
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
                <th className="py-3.5 px-5 text-right">Actions</th>
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
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDownloadReport(rec, 'html')}
                        title="Download Certificate HTML file"
                        className="p-1.5 rounded-lg border border-emerald-300 hover:bg-emerald-50 text-emerald-800 font-bold transition-all text-[11px] flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAudit(rec);
                          setShowPrintModal(true);
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold transition-all text-[11px]"
                      >
                        Preview →
                      </button>
                    </div>
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
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 my-8">
            
            {/* Modal Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6 print:hidden">
              <span className="font-bold text-xs uppercase tracking-wider text-emerald-700">
                Official Agricultural Certificate
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadReport(selectedAudit, 'html')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  Download .html
                </button>
                <button
                  onClick={() => handleDownloadReport(selectedAudit, 'json')}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <FileCode className="w-4 h-4" />
                  Export .json
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-2 rounded-xl border border-stone-300 font-semibold text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  Print
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
                    <span className="text-[11px] text-stone-500 block">{user?.region || 'Nashik Agro-Cluster, Maharashtra'}</span>
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
