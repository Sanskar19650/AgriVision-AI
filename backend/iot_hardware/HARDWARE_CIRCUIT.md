# AgriVision AI — IoT Hardware Circuit & Pinout Architecture

This document specifies the exact component wiring, voltage requirements, calibration equations, and pinout mapping for deploying the **ESP32 Microcontroller Smart Soil Sensor Node**.

---

## 🛠️ Bill of Materials (BOM)

| Component | Interface / Protocol | Operating Voltage | Purpose |
|---|---|---|---|
| **ESP32 NodeMCU-32S** | WiFi (802.11 b/g/n) + BLE | 3.3V (5V via USB/Vin) | Core telemetry microcontroller |
| **RS485 Soil NPK Sensor** | Modbus RTU (Serial UART) | 9V - 24V DC | Available N, P, K macronutrient measurement |
| **MAX485 Transceiver Module**| TTL to RS485 converter | 5V / 3.3V | UART to RS485 differential line conversion |
| **Capacitive Soil Moisture v1.2**| Analog Voltage (ADC) | 3.3V - 5.0V | Corrosion-resistant volumetric water content (%) |
| **Soil pH Sensor Probe** | Analog Voltage (ADC) | 5.0V | Hydrogen ion activity (pH 3.0 - 9.0) |
| **DS18B20 Soil Probe / DHT22**| 1-Wire Digital Protocol | 3.3V - 5.0V | Soil and ambient temperature/humidity |
| **3.7V 18650 LiPo Battery** | Solar TP4056 Charger | 3.7V - 4.2V | Off-grid field power bank |

---

## 🔌 ESP32 Pin Assignment & Wiring Table

```text
       +--------------------------------------------+
       |             ESP32 NodeMCU-32S              |
       |                                            |
       | [GPIO 34] <--- Analog Out: Capacitive Moisture
       | [GPIO 35] <--- Analog Out: Soil pH Sensor  |
       | [GPIO 4 ] <--- Data: DS18B20 Temp (4.7kΩ)  |
       | [GPIO 16] <--- RX2 (RO on MAX485)          |
       | [GPIO 17] ---> TX2 (DI on MAX485)          |
       | [GPIO 5 ] ---> DE + RE (Direction Control) |
       | [GPIO 2 ] ---> Onboard Status LED          |
       | [3V3]     ---> Power: Sensors (3.3V Rail)  |
       | [GND]     ---> Common Ground Bus           |
       +--------------------------------------------+
```

### Detailed Connections

1. **Capacitive Moisture Sensor v1.2**:
   - `VCC` -> ESP32 `3V3`
   - `GND` -> ESP32 `GND`
   - `AOUT` -> ESP32 `GPIO 34` (ADC1 Channel 6)

2. **Analog Soil pH Sensor**:
   - `VCC` -> ESP32 `5V` (or Vin)
   - `GND` -> ESP32 `GND`
   - `PO` (pH Analog Out) -> ESP32 `GPIO 35` (ADC1 Channel 7)

3. **MAX485 RS485 Transceiver**:
   - `VCC` -> `5V`
   - `GND` -> `GND`
   - `RO` (Receiver Out) -> ESP32 `GPIO 16` (RX2)
   - `DI` (Driver In) -> ESP32 `GPIO 17` (TX2)
   - `DE` & `RE` (Tied together) -> ESP32 `GPIO 5`
   - `A` & `B` Terminals -> RS485 Soil NPK Sensor `A` (Yellow) & `B` (Blue)

4. **RS485 NPK Sensor Power**:
   - `V+` (Brown) -> 12V DC Step-Up Module
   - `V-` (Black) -> Common `GND`

---

## 🧪 Calibration Curves

### 1. Capacitive Soil Moisture (%)
The 12-bit ADC of the ESP32 (0 - 4095) is mapped to volumetric soil moisture:
$$\text{Moisture \%} = \frac{\text{ADC}_{\text{air}} - \text{ADC}_{\text{reading}}}{\text{ADC}_{\text{air}} - \text{ADC}_{\text{water}}} \times 100$$
- $\text{ADC}_{\text{air}} \approx 3200$ (Dry air calibration)
- $\text{ADC}_{\text{water}} \approx 1450$ (Completely saturated soil)

### 2. Soil pH Linear Equation
$$\text{pH} = 7.0 - ((\text{Voltage} - 1.65) \times 3.5)$$
where $\text{Voltage} = \frac{\text{ADC}}{4095.0} \times 3.3\text{V}$.

---

## 🛰️ Power Consumption & Deep Sleep
- Active WiFi & Sampling current: ~120mA (duration: 3 seconds)
- Deep Sleep current: < 15µA
- Estimated battery life on single 2600mAh 18650 cell with 15-minute sampling: **> 180 days**.
