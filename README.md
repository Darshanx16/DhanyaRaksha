# DhānyaRakṣa AI 🌾🛡️
> **Smart Grain Storage & AI Industry Marketplace**

DhānyaRakṣa AI is a mobile and web application built with React Native and Expo, designed to prevent post-harvest grain losses. It monitors live warehouse telemetry feeds (temperature, humidity, moisture, CO₂) simulated from ESP32 edge IoT nodes, predicts crop shelf life using Edge-AI, and matches grain stocks with regional industry buyers.

---

## 📱 Download & Install Native App (Android APK)

You can download and install the native Android application permanently directly from this repository:

### 1. Scan QR Code to Download
Scan this QR code with your mobile device to immediately download the Android APK:

![DhānyaRakṣa APK Download QR Code](https://Darshanx16.github.io/DhanyaRaksha/assets/qr_code.png)

### 2. Direct Download Links
* 🌐 **[Download APK from Web (GitHub Pages)](https://Darshanx16.github.io/DhanyaRaksha/dhanyaraksa.apk)** (Best for mobile browsers)
* 📦 **[Download APK from GitHub Raw](https://github.com/Darshanx16/DhanyaRaksha/raw/master/assets/dhanyaraksa.apk)**

*Note: Sideloading the APK requires enabling "Install from Unknown Sources" on your Android device settings.*

---

## 💻 Live Mobile-Web Preview
The responsive mobile-web distribution of the app is hosted live at:
🔗 **[DhānyaRakṣa Web App Portal](https://Darshanx16.github.io/DhanyaRaksha/)**

---

## ✨ Features

### 1. Warehouse Owner / Farmer Workspace
* **Live IoT Telemetry Monitoring**: Feeds real-time readings (Temperature, Humidity, Moisture, CO₂) from ESP32 sensor networks.
* **Edge-AI Spoilage Predictor**: Evaluates grain degradation risk and outputs remaining shelf life predictions.
* **Dynamic ventilation relay controls**: Trigger fan extractors or vent shutters if telemetry thresholds cross safety limits.
* **Computer Vision Sack Scanner**: Scans QR/RFID tags on sacks to trace grain lifecycles and check quality grades.

### 2. Food Industry Buyer Workspace
* **Real-time Regional Stock Matching**: Search regional silos and filter grain stocks by type, quality grade, and moisture limits.
* **Matchmaker Engine**: Matches seller stock availability against contract buyer requirements (e.g. moisture < 12%, Grade A).
* **Instant Orders**: Place grain reservation orders directly with Godown managers.

---

## 🛠️ Technology Stack
* **Framework**: React Native, Expo SDK 57, Expo Router Web/Mobile
* **Typography**: Google Fonts Inter System
* **Icons**: Lucide React Native Icons
* **Deployment**: GitHub Pages (Static Web preview), EAS Build (Native Cloud APK)

---

## 🚀 Running Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start Development Server**:
   ```bash
   npm run start
   ```
   * Press `w` to open in browser.
   * Press `a` or scan the Expo Go QR code to open on your phone.

3. **Compile Static Web Preview**:
   ```bash
   npm run build:web
   ```
4. **Deploy Web App**:
   ```bash
   npm run deploy
   ```
