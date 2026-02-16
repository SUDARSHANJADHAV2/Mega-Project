# 🌾 KrushiAI - AI-Powered Smart Farming Assistant

> A comprehensive, production-grade agricultural intelligence platform that leverages Machine Learning and Deep Learning to provide crop recommendations, plant disease detection, fertilizer advice, soil health analysis, yield prediction, and market intelligence.

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.28+-red.svg)](https://streamlit.io/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [ML Models](#ml-models)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🔭 Overview

**KrushiAI** is an end-to-end smart farming platform designed to help farmers, agronomists, and agricultural stakeholders make data-driven decisions. It combines multiple AI modules into a unified hub:

1. **Crop Recommendation** — Suggests the optimal crop based on soil nutrients (N, P, K), pH, temperature, humidity, and rainfall using Random Forest classification.
2. **Plant Disease Detection** — Identifies 38 plant diseases from leaf images using a CNN (Convolutional Neural Network) trained on 87K+ images.
3. **Fertilizer Recommendation** — Recommends the best fertilizer based on soil type, crop, and nutrient levels using Random Forest with grid-search hyperparameter tuning.
4. **Soil Health Analysis** — Provides detailed NPK diagnostics with gauge charts, overall health scoring, and actionable recommendations.
5. **Market Intelligence** — Tracks commodity prices (MSP-based), trend analysis, selling recommendations, and revenue estimation.
6. **Yield Prediction** — Estimates crop production based on area, region, irrigation, and soil quality with interactive scenario comparison.
7. **Weather Integration** — Fetches live weather data via OpenWeatherMap for climate-aware recommendations.
8. **AI Chatbot** — Agricultural Q&A via LLM (OpenRouter API proxy).

---

## ✨ Features

### Core AI Features
| Feature | Model/Method | Accuracy |
|---------|-------------|----------|
| Crop Recommendation | Random Forest Classifier | ~99.5% |
| Disease Detection | CNN (TensorFlow/Keras) | ~96.5% |
| Fertilizer Recommendation | Random Forest + Grid Search | ~97%+ |
| Soil Health Analysis | Rule-based expert system | N/A |
| Yield Prediction | Agronomic reference model | N/A |

### Platform Features
- 🔐 **Multi-provider Authentication** — Email/Password, Google OAuth, Phone OTP
- 📊 **Explainable AI** — Feature importance charts for every prediction
- 🌤️ **Weather-Aware** — Auto-fill climate parameters from live weather
- 📱 **Responsive Design** — Mobile-friendly landing page and Streamlit UI
- 📈 **Analytics Dashboard** — Prediction logging and usage statistics
- 🔍 **Confidence Scoring** — Every prediction includes confidence percentage
- 📝 **Prediction Logging** — All predictions stored for auditing and analytics

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Frontend Layer                       │
│  ┌──────────────┐  ┌──────────────────────────────┐  │
│  │ Landing Page  │  │  Streamlit Unified Hub       │  │
│  │ (HTML/CSS/JS) │  │  (main_app.py)               │  │
│  └──────────────┘  └──────────────────────────────┘  │
├─────────────────────────────────────────────────────┤
│                 Backend API (FastAPI)                  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────────┐  │
│  │  Auth  │ │Weather │ │  Chat  │ │  Prediction  │  │
│  │  API   │ │  API   │ │  API   │ │   Logging    │  │
│  └────────┘ └────────┘ └────────┘ └──────────────┘  │
├─────────────────────────────────────────────────────┤
│                    ML Engine                          │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────────┐   │
│  │  Crop  │ │Disease │ │  Fert  │ │Expert Rules│   │
│  │ RF.pkl │ │CNN.krs │ │ RF.pkl │ │  (Soil/Mkt)│   │
│  └────────┘ └────────┘ └────────┘ └────────────┘   │
├─────────────────────────────────────────────────────┤
│                 Data Layer                            │
│  ┌──────────────────┐  ┌────────────────────────┐   │
│  │ SQLite Database   │  │  CSV Datasets          │   │
│  │ (Users, Logs)     │  │  (Training Data)       │   │
│  └──────────────────┘  └────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend (Landing) | HTML5, CSS3, JavaScript, Font Awesome |
| Frontend (App) | Streamlit, Plotly, Matplotlib, Seaborn |
| Backend API | FastAPI, Uvicorn, Pydantic |
| Authentication | JWT (python-jose), bcrypt (passlib) |
| ML - Crop/Fertilizer | scikit-learn (Random Forest), XGBoost |
| ML - Disease | TensorFlow/Keras (CNN) |
| Database | SQLAlchemy, SQLite (dev) / PostgreSQL (prod) |
| External APIs | OpenWeatherMap, OpenRouter |
| HTTP Client | httpx (async), requests |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- pip

### 1. Clone & Setup

```bash
git clone https://github.com/your-username/Mega-Project.git
cd Mega-Project

# Create virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate

# Activate (macOS/Linux)
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your API keys
```

### 3. Start Backend API

```bash
cd backend
uvicorn main:app --reload --port 8000
```

### 4. Start Streamlit App

```bash
# From project root
streamlit run main_app.py
```

### 5. Open Landing Page
Open `index.html` in your browser, or serve it:
```bash
python -m http.server 5500
```

---

## 📁 Project Structure

```
Mega-Project/
├── index.html                         # Landing page
├── css/style.css                      # Landing page styles
├── js/main.js                         # Landing page JavaScript
├── main_app.py                        # 🏠 Unified Streamlit Hub
├── crop_app.py                        # Crop recommendation module
├── disease_detection.py               # Disease detection module
├── fertilizer_advice.py               # Fertilizer recommendation module
├── soil_analysis.py                   # Soil health analysis module
├── market_intelligence.py             # Market intelligence module
├── yield_prediction.py                # Yield prediction module
├── backend/
│   ├── main.py                        # FastAPI backend
│   └── database.py                    # SQLAlchemy models & DB setup
├── KrushiAI-Crop-Recommendation/
│   ├── webapp.py                      # Standalone crop app
│   ├── utils.py                       # Crop model utilities
│   ├── crop_utils.py                  # Legacy utilities
│   ├── RandomForest.pkl               # Trained RF model
│   ├── Crop_recommendation.csv        # Training dataset
│   └── KrushiAI_Crop_Recommendation.ipynb
├── KrushiAI-Fertilizer-Recommendation/
│   ├── fertilizer_app.py              # Standalone fertilizer app
│   ├── train_fertilizer.py            # Model training script
│   ├── Fertilizer_RF.pkl              # Trained RF model
│   ├── soil_encoder.pkl               # Soil type encoder
│   ├── crop_encoder.pkl               # Crop type encoder
│   ├── fertilizer_encoder.pkl         # Fertilizer label encoder
│   └── feature_scaler.pkl             # Feature scaler
├── KrushiAI-Disease-Recognition/
│   ├── main.py                        # Standalone disease app
│   ├── utils.py                       # Image processing utils
│   ├── disease_info.py                # Disease database
│   ├── health_check.py                # Deployment health check
│   └── trained_plant_disease_model.keras
├── KrushiAI-Weather-Forecast/
│   ├── index.html                     # Weather forecast UI
│   ├── script.js                      # Weather JavaScript
│   └── style.css                      # Weather styles
├── explore/                           # Explore page (guide)
├── guide/                             # User guide page
├── contact/                           # Contact page
├── tests/
│   └── test_api.py                    # Backend API tests
├── .env.example                       # Environment template
├── .gitignore                         # Git ignore rules
├── requirements.txt                   # Python dependencies
└── README.md                          # This file
```

---

## 🤖 ML Models

### 1. Crop Recommendation Model
- **Algorithm**: Random Forest Classifier (also XGBoost, KNN, Decision Tree, Naive Bayes evaluated)
- **Features**: N, P, K, Temperature, Humidity, pH, Rainfall
- **Dataset**: 2200 samples × 22 crops
- **Accuracy**: ~99.5% (Random Forest selected as best performer)
- **Training**: 80/20 split, cross-validated

### 2. Plant Disease Detection Model
- **Architecture**: CNN (Convolutional Neural Network)
- **Framework**: TensorFlow/Keras
- **Input Size**: 128×128 RGB images
- **Classes**: 38 (diseases + healthy states across 14 plant species)
- **Dataset**: 87,000+ leaf images
- **Preprocessing**: Normalization (0-1), contrast/sharpness enhancement
- **Accuracy**: ~96.5% validation accuracy

### 3. Fertilizer Recommendation Model
- **Algorithm**: Random Forest Classifier with GridSearchCV
- **Features**: Temperature, Humidity, Moisture, Soil Type, Crop Type, N, K, P
- **Preprocessing**: Label encoding (categorical) + StandardScaler (numerical)
- **Accuracy**: ~97%+ with cross-validation

### Model Assumptions & Limitations
- Crop model trained on Indian agricultural data — may not generalize globally
- Disease model requires clear leaf images (poor lighting reduces accuracy)
- Fertilizer model uses a small dataset (99 samples) — predictions may vary
- Weather-based recommendations assume current conditions persist through season

---

## 📡 API Documentation

### Base URL: `http://localhost:8000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/register` | User registration |
| POST | `/token` | Login (JWT) |
| POST | `/auth/google` | Google OAuth |
| POST | `/auth/phone` | Phone OTP |
| GET | `/weather/{city}` | Get weather by city |
| GET | `/weather/coords/{lat}/{lon}` | Weather by coordinates |
| GET | `/forecast/coords/{lat}/{lon}` | 5-day forecast |
| GET | `/geo/{city}` | Geocoding |
| POST | `/chat` | LLM chat proxy |
| POST | `/predictions/log` | Log a prediction |
| GET | `/predictions/stats` | Prediction analytics |

---

## 🚀 Deployment

### Docker (Disease Detection Module)
```bash
cd KrushiAI-Disease-Recognition
docker build -t krushiai-disease .
docker run -p 8501:8501 krushiai-disease
```

### Production Considerations
- Replace SQLite with PostgreSQL for multi-user production
- Set `JWT_SECRET` to a strong, unique value
- Configure CORS origins to your domain
- Use HTTPS in production
- Add rate limiting for API endpoints
- Consider model versioning for updates

---

## 🔮 Future Improvements

1. **Real-time Market Data** — Integrate with Indian agricultural commodity exchanges
2. **Satellite Imagery** — NDVI-based crop health monitoring
3. **Multi-language Support** — Hindi, Marathi, Tamil, Telugu
4. **Offline Mode** — TensorFlow Lite models for mobile
5. **IoT Integration** — Sensor-based automatic soil data collection
6. **Crop Calendar** — Region-specific planting/harvesting schedule
7. **Community Forum** — Farmer knowledge sharing platform
8. **Insurance Integration** — Crop insurance recommendations

---

## 📜 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 👥 Team

KrushiAI is developed as a capstone project demonstrating the practical application of AI/ML in agriculture.

---

*Built with ❤️ for Indian farmers*
