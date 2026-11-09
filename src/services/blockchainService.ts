/**
 * AgriVision AI - Blockchain Verification & SHA-256 Notarization Service
 * Supports client-side cryptographic hashing, Web3 simulation, and smart contract verification.
 */

import { BlockchainRecord } from '../types';
import { INITIAL_BLOCKCHAIN_RECORDS } from './mockData';

// Generate true SHA-256 cryptographic hash of arbitrary string / JSON object
export async function computeSHA256(payload: string | object): Promise<string> {
  const content = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Deterministic fallback for non-secure contexts
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'sha256_mock_' + Math.abs(hash).toString(16).padStart(64, '0');
}

// Generate random Ethereum-compatible Tx Hash
export function generateTxHash(): string {
  const chars = '0123456789abcdef';
  let tx = '0x';
  for (let i = 0; i < 64; i++) {
    tx += chars[Math.floor(Math.random() * chars.length)];
  }
  return tx;
}

// Local storage key for blockchain ledger persistence
const BLOCKCHAIN_STORAGE_KEY = 'agrivision_blockchain_ledger_v1';

export function getStoredBlockchainRecords(): BlockchainRecord[] {
  if (typeof window === 'undefined') return INITIAL_BLOCKCHAIN_RECORDS;
  try {
    const data = localStorage.getItem(BLOCKCHAIN_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(BLOCKCHAIN_STORAGE_KEY, JSON.stringify(INITIAL_BLOCKCHAIN_RECORDS));
      return INITIAL_BLOCKCHAIN_RECORDS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_BLOCKCHAIN_RECORDS;
  }
}

export function saveBlockchainRecord(record: BlockchainRecord): BlockchainRecord[] {
  const current = getStoredBlockchainRecords();
  const updated = [record, ...current];
  try {
    localStorage.setItem(BLOCKCHAIN_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving blockchain record to localStorage:', err);
  }
  return updated;
}

export async function notarizeReportOnBlockchain(
  userId: string,
  reportId: string,
  reportType: BlockchainRecord['reportType'],
  reportData: object,
  auditorNotes?: string
): Promise<BlockchainRecord> {
  const sha256Hash = await computeSHA256(reportData);
  const txHash = generateTxHash();
  const currentLedger = getStoredBlockchainRecords();
  const latestBlock = currentLedger.length > 0 ? currentLedger[0].blockNumber : 19842100;
  
  const record: BlockchainRecord = {
    id: `blk-${Date.now()}`,
    userId,
    reportId,
    reportType,
    sha256Hash,
    txHash,
    blockNumber: latestBlock + Math.floor(Math.random() * 5) + 1,
    contractAddress: '0x3F88a5312788e078E490cB4A66524Cd4E2f78235',
    network: 'Polygon Amoy PoS (ChainID: 80002)',
    status: 'CONFIRMED',
    timestamp: new Date().toISOString(),
    auditorNotes: auditorNotes || 'SHA-256 cryptographic proof committed to AgriVerification smart contract ledger.'
  };

  saveBlockchainRecord(record);
  return record;
}

export function verifyRecordAuthenticity(
  inputHash: string
): { verified: boolean; record?: BlockchainRecord } {
  const records = getStoredBlockchainRecords();
  const normalizedInput = inputHash.trim().toLowerCase();
  
  const found = records.find(r => 
    r.sha256Hash.toLowerCase() === normalizedInput ||
    r.txHash.toLowerCase() === normalizedInput ||
    r.reportId.toLowerCase() === normalizedInput
  );

  return {
    verified: !!found,
    record: found
  };
}

// Solidity Smart Contract Source Code for defense & VS Code export
export const SOLIDITY_CONTRACT_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AgriVerification
 * @dev Immutable Agricultural Diagnostic & Soil Test Report Notarization
 * B.Tech CSE Final Year Capstone Project
 */
contract AgriVerification {
    address public owner;
    
    struct AgriculturalReport {
        string reportId;
        string reportType;
        bytes32 sha256Digest;
        address registeredBy;
        uint256 timestamp;
        uint256 blockNumber;
        string ipfsHash;
        bool isValid;
    }

    // Mapping from SHA-256 digest to Report Struct
    mapping(bytes32 => AgriculturalReport) public reports;
    // Mapping from reportId to SHA-256 digest
    mapping(string => bytes32) public reportIdToDigest;
    // Total registered records
    uint256 public totalRecordsCount;

    event ReportNotarized(
        string indexed reportId,
        bytes32 indexed sha256Digest,
        address indexed farmer,
        string reportType,
        uint256 timestamp
    );

    event ReportRevoked(bytes32 indexed sha256Digest, string reason);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can invoke this");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function notarizeReport(
        string memory _reportId,
        string memory _reportType,
        bytes32 _sha256Digest,
        string memory _ipfsHash
    ) external returns (bool) {
        require(reports[_sha256Digest].timestamp == 0, "Report digest already notarized on-chain");
        require(reportIdToDigest[_reportId] == bytes32(0), "Report ID already registered");

        reports[_sha256Digest] = AgriculturalReport({
            reportId: _reportId,
            reportType: _reportType,
            sha256Digest: _sha256Digest,
            registeredBy: msg.sender,
            timestamp: block.timestamp,
            blockNumber: block.number,
            ipfsHash: _ipfsHash,
            isValid: true
        });

        reportIdToDigest[_reportId] = _sha256Digest;
        totalRecordsCount++;

        emit ReportNotarized(_reportId, _sha256Digest, msg.sender, _reportType, block.timestamp);
        return true;
    }

    function verifyReport(bytes32 _sha256Digest)
        external
        view
        returns (
            bool exists,
            string memory reportId,
            string memory reportType,
            address registeredBy,
            uint256 timestamp,
            uint256 blockNumber,
            bool isValid
        )
    {
        AgriculturalReport memory r = reports[_sha256Digest];
        if (r.timestamp == 0) {
            return (false, "", "", address(0), 0, 0, false);
        }
        return (true, r.reportId, r.reportType, r.registeredBy, r.timestamp, r.blockNumber, r.isValid);
    }
}`;
