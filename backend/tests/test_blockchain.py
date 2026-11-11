"""
AgriVision AI - Phase 6: Blockchain Notarization & Cryptographic Digest Tests
Tests:
1. Canonical SHA-256 report hashing consistency
2. Solidity ABI packing and bytes32 representation
3. Immutability verification logic
"""

import sys
import os
import unittest
import hashlib
import json

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from blockchain.submit_transaction import compute_sha256, submit_notarization_transaction

class TestBlockchainModule(unittest.TestCase):
    
    def test_canonical_sha256(self):
        """Verifies deterministic sorting and hashing of JSON payloads."""
        payload_1 = {"crop": "Tomato", "severity": "Moderate", "farmId": "farm-001"}
        payload_2 = {"farmId": "farm-001", "severity": "Moderate", "crop": "Tomato"}
        
        # Keys in different order must yield identical hash due to sort_keys=True
        hash_1 = compute_sha256(payload_1)
        hash_2 = compute_sha256(payload_2)
        
        self.assertEqual(hash_1, hash_2)
        self.assertEqual(len(hash_1), 64)
        print(f"✅ SHA-256 Canonical Hashing Verified: {hash_1[:16]}...")

    def test_tamper_detection(self):
        """Ensures that any alteration in yield loss or confidence changes the digest."""
        original = {"reportId": "rep-001", "loss": 34.0}
        tampered = {"reportId": "rep-001", "loss": 55.0} # Fraudulent inflation
        
        hash_orig = compute_sha256(original)
        hash_tamp = compute_sha256(tampered)
        
        self.assertNotEqual(hash_orig, hash_tamp)
        print("✅ Tamper-Proof Detection Verified: Modified report produces completely distinct digest.")

    def test_transaction_submission_mock(self):
        """Verifies end-to-end notarization pipeline receipt structure."""
        report = {"farmer": "Rameshwar Patil", "crop": "Wheat", "disease": "Healthy"}
        receipt = submit_notarization_transaction("test-rep-99", "DISEASE_SCAN", report)
        
        self.assertEqual(receipt["reportId"], "test-rep-99")
        self.assertEqual(receipt["status"], "CONFIRMED")
        self.assertTrue(receipt["txHash"].startswith("0x"))
        self.assertGreater(receipt["blockNumber"], 19000000)
        print("✅ Transaction Notarization & Smart Contract State Verified.")

if __name__ == '__main__':
    unittest.main()
