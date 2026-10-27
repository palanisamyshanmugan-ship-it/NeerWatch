# NeerWatch 🌊

> **AI-Powered Northeast India Water Quality & Epidemic Risk Monitoring Platform**  
> Engineered with an Apple-inspired Liquid Glass user interface, XGBoost verification prioritization, and SHAP explainability.

---

## 🌟 Overview

**NeerWatch** is an environmental intelligence and public health surveillance platform designed specifically for Northeast India (*Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, and Tripura*). 

It combines real-time geographic monitoring, historical water quality testing, disease outbreak trend analysis, and machine learning models to identify high-risk contamination zones and recommend field verification actions before epidemics spread.

---

## ✨ Features

- **Apple-Inspired Liquid Glass UI**:
  - Precision VisionOS / macOS Sonoma frosted glass aesthetics (`backdrop-filter`).
  - SF Pro / Inter typography, clean metrics grid, and smooth interactive micro-animations.
  - High-performance, hardware-accelerated rendering tuned for silky smooth 60/120fps scrolling.
- **Interactive Geospatial Intelligence**:
  - Dynamic Leaflet mapping displaying all 44 regional monitoring stations across the 8 Northeastern states.
  - Color-coded risk markers (Low, Medium, High, Critical) with automatic map centering and live inspection drawers.
- **Explainable Machine Learning (XGBoost + SHAP)**:
  - Automated risk scoring and verification priority ranking (`ml-artifacts/xgb_v2_verification_priority.csv`).
  - Key positive and negative contributor breakdowns powered by SHAP explanations (`ml-artifacts/shap_v2_test_explanations.csv`).
- **Epidemic & Water Quality Surveillance**:
  - Time-series tracking for key waterborne disease vectors (Diarrhea, Cholera, Typhoid, Hepatitis).
  - Historical physical and chemical parameter monitoring (pH, Turbidity, DO, BOD, Total Coliform).
- **Field Verification Workflow**:
  - Dedicated verification submission drawer allowing field teams to log on-site water samples and field test outcomes.
- **Zero-Dependency Native Backend**:
  - Lightweight, high-throughput Node.js HTTP server utilizing native modules (`node:http`, `node:crypto`, `node:fs`). No external npm installations needed.

---

## 📁 Repository Structure

```
NeerWatch/
├── backend/
│   ├── data/
│   │   ├── history_v2.json         # Historical water observations & disease records
│   │   ├── locations.json          # 44 Northeastern India monitoring stations
│   │   └── verification.json       # Field verification log records
│   ├── README.md                   # Backend API specification & endpoints
│   └── server.mjs                  # Native Node.js REST API & static file server
├── ml-artifacts/
│   ├── shap_v2_test_explanations.csv      # SHAP feature impact explanations
│   └── xgb_v2_verification_priority.csv   # XGBoost priority scores & predictions
├── outputs/
│   └── waterguard-dashboard/
│       └── index.html              # Apple Liquid Glass UI dashboard
├── .gitignore                      # Git exclusion rules for clean repository
├── package.json                    # Project metadata & npm execution scripts
└── README.md                       # Main project documentation
```

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher recommended)

### Running the App

1. Clone or extract the project to your local machine:
   ```bash
   cd NeerWatch
   ```

2. Start the server (no `npm install` required!):
   ```bash
   npm start
   ```
   *(or run directly via Node: `node backend/server.mjs`)*

3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

---

## 📡 API Endpoints

The backend server exposes the following RESTful endpoints:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Serves the NeerWatch Liquid Glass Dashboard |
| `GET` | `/health` | Server health check and uptime status |
| `GET` | `/api/v1/locations` | Location catalog (optional filter: `?state=Assam`) |
| `GET` | `/api/v1/risk` | Geospatial risk shapes for all stations |
| `GET` | `/api/v1/risk/:location_id` | Detailed parameters, SHAP drivers, and predictions |
| `GET` | `/api/v1/locations/:id/history` | Historical water-quality observation records |
| `POST`| `/api/v1/locations/:id/verification` | Submits a field-verification report |
| `POST`| `/api/v1/analyze` | On-the-fly CSV dataset risk analysis |

---

## 📤 Uploading to GitHub / Git

Follow these steps to push this package to your own Git repository:

```bash
# 1. Initialize git in the project root
git init

# 2. Stage all files
git add .

# 3. Create your initial commit
git commit -m "Initial commit: NeerWatch platform with Apple Liquid Glass UI"

# 4. Set the main branch
git branch -M main

# 5. Link your remote repository (replace with your repo URL)
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# 6. Push to GitHub
git push -u origin main
```

---

## 📄 License

This project is licensed under the MIT License.
