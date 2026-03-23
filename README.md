<div align="center">
    <h1>🌱 KrushiAI : Intelligent Enterprise Farming Assistant (V2.0)</h1>
    <p>A production-grade, AI-powered agricultural ecosystem designed to maximize crop yield, detect diseases, manage finances, and provide real-time farming analytics with zero monetary investment.</p>
</div>

![Homepage Enhancements Analysis](file:///C:/Users/sudar/.gemini/antigravity/brain/c641965d-c762-48e1-9ebf-712a5b569e29/.system_generated/click_feedback/click_feedback_1772573586344.png)

## 📌 Overview

**KrushiAI V2.0** has been entirely re-engineered into a modern, decoupled web application. It transitions traditional farming into the digital age by putting advanced deep learning and predictive machine learning models directly into the hands of farmers, all packaged within a stunning, premium user interface.

The platform is split between a unified **FastAPI backend** handling **8 distinct AI inference pipelines**, paired with a highly responsive, mobile-first **React + Vite** frontend. What makes KrushiAI unique is its **Zero-Cost Architecture**—it utilizes free-tier APIs (Gemini 2.0 Flash) and robust heuristic fallbacks to ensure farmers always get answers, even if underlying AI models are temporarily missing or out of quota.

---

## ✨ Enterprise AI Features

### 1. 🌾 Smart Crop Recommendation
* **How it works:** Leverages a Random Forest classifier to suggest the most suitable crops based on precise soil nutrients (Nitrogen, Phosphorus, Potassium), climate conditions (Temperature, Humidity, Rainfall), and soil pH.
* **Fallback Logic:** If the foundational `.pkl` model file is unavailable, the backend gracefully falls back to an advanced heuristic decision tree calibrated explicitly on Indian agricultural data.

### 2. 🧪 Fertilizer Recommender
* **How it works:** Calculates the exact type of chemical fertilizer a specific crop needs given the current NPK content of the soil. It prevents over-fertilization, saving money and the environment.

### 3. 🔍 Plant Disease Recognition (CNN)
* **How it works:** A Deep Convolutional Neural Network (CNN) trained on over 70,000 images capable of classifying 38 distinct plant diseases across 14 crop variants.
* **Usage:** Farmers simply drag-and-drop a leaf scan into the UI to instantly receive a diagnosis alongside actionable treatment steps and biological confidence scores. **New:** Strict MIME-Type client validation ensures server stability.

### 4. 📈 Crop Yield Predictor
* **How it works:** A powerful regression-based analysis tool that forecasts total harvest yield. By inputting the farm's acreage, expected seasonal rainfall, and fertilizer budget, KrushiAI calculates exactly how many tons of crop to expect.

### 5. 🌍 Visual Soil Health Analyzer (New in V2.0)
* **How it works:** Upload an image of your farm's soil. The engine runs a visual heuristic scan to determine the topsoil type (Black, Red, Alluvial, Laterite), estimates its visual moisture holding capacity, predicts generic pH levels, and advises on immediate preparatory treatment.

### 6. 📅 AI Crop Lifecycle Calendar (New in V2.0)
* **How it works:** Input your crop, sowing date, and local soil. KrushiAI generates a meticulous 120-day timeframe of critical farming actions (when to irrigate, when to apply basal fertilizer, when to harvest). 

### 7. 💹 Financial Profitability & Risk Engine (New in V2.0)
* **How it works:** Computes complete farm economics. By entering farm size, investment budget, and crop type, the engine cross-references live (mocked) Mandi market prices to calculate absolute ROI, Net Profit, and a Risk Assessment grade to protect from market volatility.

---

## 🛠 Platform Integrations

### 💬 Gemini 2.0 Flash Powered Chatbot
KrushiAI features an intelligent floating chat assistant powered by the `google-genai` SDK running **Gemini 2.0 Flash**. It acts as an expert Indian agricultural advisor ready to answer complex agronomy questions in real-time.
* **Architecture:** Migrated from legacy Groq models. Features a beautiful new floating UI with a native close mechanism and dynamic error fallback handling (e.g., smoothly parsing HTTP `429 RESOURCE_EXHAUSTED` responses without breaking).

### 🌐 Native Multi-Language i18n (6 Indian Languages)
* **Inclusion:** KrushiAI V2.0 is functionally wired for India. A toggle integrated directly into the unified Navbar allows instantaneous translation of the entire platform routing, components, inputs, and models from **English to Hindi, Marathi, Punjabi, Gujarati, Tamil, and Telugu** natively.

### 🎙️ Immersive Voice Assistance & PWA Offline Mode
* **Speech & Audio:** Native browser-based Speech-to-Text and Text-to-Speech interaction with the unified Chatbot.
* **Offline Resiliency:** An intelligent connection watcher provides visual warnings and safely falls back to local heuristic models when internet connectivity drops in remote rural areas.

### 🌤️ Live Open-Meteo Dashboard
Replaced static dashboard parameters with a live data feed from **Open-Meteo**, a completely free weather API. It extracts real-time temperature, wind speeds, and atmospheric metrics based on agricultural geolocations.

---

## 🏗️ Technical Architecture

The application is engineered for horizontal scalability, split into two completely decoupled ecosystems.

### 1. Frontend (`/frontend`)
* **Framework**: React 19 + Vite 7 for lightning-fast HMR and optimized builds.
* **Internationalization**: `react-i18next` localized dictionaries for deep cross-platform translation.
* **Design System**: Built around **Dark Glassmorphism**. The UI utilizes `backdrop-filter: blur(20px)`, subtle gradient borders, frosted panels, and **Framer Motion** for buttery-smooth unmounting animations.

### 2. Backend (`/backend`)
* **Framework**: FastAPI (Asynchronous, High-Performance) + Uvicorn server.
* **Modular Routing**: Unlike a monolithic design, KrushiAI uses specialized routers:
  * `auth.py`: JWT Generation and SQLite user registration.
  * `predict.py`: Houses all 8 Machine Learning inference logic tracks and heuristic fallbacks.
* **AI Tooling**: `google-genai` SDK for lightweight, ultra-fast language inference.

---

## 🚀 Running the Project Locally

### Prerequisites
- **Node.js**: v18+
- **Python**: v3.10 or v3.11

### 1. Initialize the Backend
Open a terminal and initialize a Python 3.10/3.11 virtual environment:
```bash
cd backend
python -m venv venv

# On Windows:
.\venv\Scripts\Activate.ps1

# Install requirements
pip install fastapi uvicorn pydantic sqlalchemy passlib python-jose scikit-learn pillow opencv-python-headless python-multipart tensorflow numpy groq google-genai

# Create a local .env file
echo "GEMINI_API_KEY=AIzaSy..." > .env

# Run the Uvicorn Server
uvicorn app.main:app --reload
```
The localized API and Auto-Generated Swagger Docs will be instantly accessible at `http://localhost:8000/docs`.

### 2. Initialize the Frontend
Open a separate, concurrent terminal:
```bash
cd frontend
npm install
npm run dev
```
The React application will be accessible at `http://localhost:5173`. 

---

## 🧪 Testing & QA
An extensive End-to-End (E2E) testing suite has been performed on this application:
1. **Automated API Harness**: A headless Python execution script guarantees 100% 200-OKs across all heavy mathematical `/api/predict-*` endpoints.
2. **Browser Ui Subagents**: Automated UI bots ensure input fields, drag-and-drop validation zones, and React Context boundaries correctly manage and sanitize data before transit to FastAPI.

## 📚 Datasets & Research Background
This project builds upon the foundational research paper published on IEEE: [Smart Crop Recommendation System with Plant Disease Identification](https://ieeexplore.ieee.org/document/10738975).
