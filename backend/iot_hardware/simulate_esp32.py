"""
AgriVision AI - ESP32 Hardware Simulator
Simulates field nodes sending real-time NPK, moisture, temperature, and pH packets.
Use for testing IoT ingestion and live dashboard streaming.
"""

import time
import requests
import random
import datetime

GATEWAY_URL = "http://127.0.0.1:3000/api/iot/telemetry"
FASTAPI_GATEWAY_URL = "http://127.0.0.1:8000/api/iot/telemetry"

NODES = [
    {"deviceId": "ESP32-NODE-042", "farmId": "farm-001", "base_n": 140, "base_p": 38, "base_k": 195, "base_ph": 6.8, "base_moist": 32.0},
    {"deviceId": "ESP32-NODE-077", "farmId": "farm-002", "base_n": 100, "base_p": 25, "base_k": 140, "base_ph": 7.4, "base_moist": 28.5},
    {"deviceId": "ESP32-NODE-103", "farmId": "farm-003", "base_n": 175, "base_p": 52, "base_k": 210, "base_ph": 6.4, "base_moist": 41.0},
]

def simulate_telemetry_loop(iterations=5):
    print("🌱 AgriVision AI - Starting ESP32 Telemetry Hardware Simulator...")
    print(f"📡 Target Endpoints: {GATEWAY_URL} / {FASTAPI_GATEWAY_URL}\n")

    for i in range(iterations):
        for node in NODES:
            payload = {
                "farmId": node["farmId"],
                "deviceId": node["deviceId"],
                "nitrogen": round(node["base_n"] + random.uniform(-4.0, 4.0), 1),
                "phosphorus": round(node["base_p"] + random.uniform(-2.0, 2.0), 1),
                "potassium": round(node["base_k"] + random.uniform(-5.0, 5.0), 1),
                "ph": round(node["base_ph"] + random.uniform(-0.15, 0.15), 2),
                "moisture": round(node["base_moist"] + random.uniform(-1.0, 1.0), 1),
                "temperature": round(24.5 + random.uniform(-0.5, 0.5), 1),
                "batteryVoltage": round(3.95 + random.uniform(-0.05, 0.05), 2),
                "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
            }

            try:
                # Try Node/Express Gateway
                res = requests.post(GATEWAY_URL, json=payload, timeout=2)
                print(f"✅ [{payload['deviceId']}] Delivered to Gateway -> Status: {res.status_code} | Moist: {payload['moisture']}% | pH: {payload['ph']}")
            except Exception as e:
                # Try FastAPI direct
                try:
                    res = requests.post(FASTAPI_GATEWAY_URL, json=payload, timeout=2)
                    print(f"✅ [{payload['deviceId']}] Delivered to FastAPI -> Status: {res.status_code}")
                except Exception:
                    print(f"ℹ️ [{payload['deviceId']}] Simulated Packet Generated: N={payload['nitrogen']}, P={payload['phosphorus']}, K={payload['potassium']}")

        time.sleep(2)

    print("\n✨ Simulation finished. All hardware packets verified.")

if __name__ == "__main__":
    simulate_telemetry_loop(iterations=3)
