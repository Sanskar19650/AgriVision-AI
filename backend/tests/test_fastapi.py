"""
AgriVision AI - Phase 6: FastAPI Microservice Integration Tests
Tests:
- GET /
- POST /api/predict-crop
- POST /api/disease-detect
- POST /api/damage-detect
- POST /api/iot/telemetry
- POST /api/compute-hash
"""

import sys
import os
import unittest
from fastapi.testclient import TestClient

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from python_fastapi.main import app

class TestFastAPIRoutes(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_root_health(self):
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data.get("status"), "operational")
        print("✅ FastAPI Health Check Passed.")

    def test_predict_crop_endpoint(self):
        payload = {
            "nitrogen": 85.0,
            "phosphorus": 45.0,
            "potassium": 40.0,
            "temperature": 25.0,
            "humidity": 80.0,
            "ph": 6.5,
            "rainfall": 200.0
        }
        res = self.client.post("/api/predict-crop", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("topCrop", data)
        self.assertIn("recommendations", data)
        self.assertGreater(len(data["recommendations"]), 0)
        print(f"✅ Crop Recommendation Endpoint Passed (Top: {data['topCrop']}, {data['topProbability']}%).")

    def test_disease_detect_endpoint(self):
        res = self.client.post("/api/disease-detect", data={"cropHint": "Tomato"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("diseaseDetected", data)
        self.assertIn("organicTreatment", data)
        print(f"✅ Disease Detection Endpoint Passed ({data['diseaseDetected']}).")

    def test_damage_detect_endpoint(self):
        res = self.client.post("/api/damage-detect", data={"cropHint": "Cotton"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("damage_percentage", data)
        self.assertIn("detected_objects", data)
        print(f"✅ Crop Damage Endpoint Passed (Loss: {data['damage_percentage']}%).")

    def test_iot_telemetry_endpoint(self):
        payload = {
            "farmId": "farm-001",
            "deviceId": "ESP32-TEST-NODE",
            "nitrogen": 140.0,
            "phosphorus": 35.0,
            "potassium": 190.0,
            "ph": 6.8,
            "moisture": 32.0,
            "temperature": 24.0
        }
        res = self.client.post("/api/iot/telemetry", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data.get("status"), "acknowledged")
        print("✅ IoT Telemetry Ingestion Endpoint Passed.")

    def test_compute_hash_endpoint(self):
        payload = {"test": "data", "reportId": "rep-101"}
        res = self.client.post("/api/compute-hash", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("sha256", data)
        self.assertEqual(len(data["sha256"]), 64) # 256-bit hex
        print(f"✅ SHA-256 Notary Hash Endpoint Passed ({data['sha256'][:16]}...).")

if __name__ == '__main__':
    unittest.main()
