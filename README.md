<div align="center">
    <h1>🌱 KrushiAI : Intelligent Enterprise Farming Assistant</h1>
    <p>A production-grade, AI-powered agricultural ecosystem designed to maximize crop yield, detect diseases, and provide real-time farming analytics with zero monetary investment.</p>
</div>

![Homepage Enhancements Analysis](file:///C:/Users/sudar/.gemini/antigravity/brain/c641965d-c762-48e1-9ebf-712a5b569e29/.system_generated/click_feedback/click_feedback_1772573586344.png)

## 📌 Overview

**KrushiAI** has been entirely re-engineered into a modern, decoupled web application. It transitions traditional farming into the digital age by putting advanced deep learning and predictive machine learning models directly into the hands of farmers, all packaged within a stunning, premium user interface.

The platform is split between a unified **FastAPI backend** handling five distinct AI inference pipelines, paired with a highly responsive, mobile-first **React + Vite** frontend. What makes KrushiAI unique is its **Zero-Cost Architecture**—it utilizes free-tier APIs and robust heuristic fallbacks to ensure farmers always get answers, even if underlying AI models are temporarily missing.

---

## ✨ Enterprise AI Features

### 1. 🌾 Smart Crop Recommendation
* **How it works:** Leverages a Random Forest classifier to suggest the most suitable crops based on precise soil nutrients (Nitrogen, Phosphorus, Potassium), climate conditions (Temperature, Humidity, Rainfall), and soil pH.
* **Fallback Logic:** If the foundational `.pkl` model file is unavailable, the backend gracefully falls back to an advanced heuristic decision tree calibrated explicitly on Indian agricultural data, ensuring the farmer always receives a recommendation.

![Crop Recommender Form](file:///C:/Users/sudar/.gemini/antigravity/brain/c641965d-c762-48e1-9ebf-712a5b569e29/.system_generated/click_feedback/click_feedback_1772577476495.png)

### 2. 🧪 Fertilizer Recommender
* **How it works:** Calculates the exact type of chemical fertilizer a specific crop needs given the current NPK content of the soil. It prevents over-fertilization, saving money and the environment.

### 3. 🔍 Plant Disease Recognition (CNN)
* **How it works:** A Deep Convolutional Neural Network (CNN) trained on over 70,000 images capable of classifying 38 distinct plant diseases across 14 crop variants.
* **Usage:** Farmers simply snap a photo or drag-and-drop a leaf scan into the UI to instantly receive a diagnosis alongside actionable treatment steps and biological confidence scores.

### 4. 📈 Crop Yield Predictor
* **How it works:** A powerful regression-based analysis tool that forecasts total harvest yield. By inputting the farm's acreage, expected seasonal rainfall, and fertilizer budget, KrushiAI calculates exactly how many tons of crop to expect.

![Yield Prediction Result](file:///C:/Users/sudar/.gemini/antigravity/brain/c641965d-c762-48e1-9ebf-712a5b569e29/yield_prediction_result_1772576781492.png)

### 5. 🌿 Invasive Weed Detection
* **How it works:** Similar to the disease recognition module, this tool specifically targets weed identification. It classifies broadleaf vs. grass weeds and recommends highly specific, crop-safe herbicides.

---

## 🛠 Platform Integrations

### 💬 LLaMA-Powered Chatbot
KrushiAI features an intelligent floating chat assistant powered by the `Groq` API running Llama-3. It acts as an expert Indian agricultural advisor ready to answer complex agronomy questions in real-time.
* **Graceful Degradation:** If the API key is missing, the Chatbot dynamically renders a beautiful instructional alert card showing the developer exactly how to acquire a free key, rather than breaking the UI.

![Disease Recognition & Chatbot Interactivity](file:///C:/Users/sudar/.gemini/antigravity/brain/c641965d-c762-48e1-9ebf-712a5b569e29/.system_generated/click_feedback/click_feedback_1772573684022.png)

### 🌤️ Live Open-Meteo Dashboard
Replaced static dashboard parameters with a live data feed from **Open-Meteo**, a completely free weather API. It extracts real-time temperature, wind speeds, and atmospheric metrics based on agricultural geolocations to fuel the farmer's daily operations.

---

## 🏗️ Technical Architecture

The application is engineered for horizontal scalability, split into two completely decoupled ecosystems.

### 1. Frontend (`/frontend`)
- **Framework**: React 19 + Vite for lightning-fast HMR and optimized builds.
- **State & Context**: Built-in React Context (`AuthContext.jsx`) manages the global user state and JWT tokens invisibly.
- **Design System**: Built around **Dark Glassmorphism**. The UI utilizes `backdrop-filter: blur(20px)`, subtle gradient borders, frosted panels, and **Framer Motion** for buttery-smooth unmounting animations.
- **Responsiveness**: The Navigation (`Navbar.jsx`) features a custom hamburger sliding menu, ensuring the Enterprise AI tools are perfectly accessible on mobile devices.

### 2. Backend (`/backend`)
- **Framework**: FastAPI (Asynchronous, High-Performance) + Uvicorn server.
- **Modular Routing**: Unlike a monolithic design, KrushiAI uses specialized routers:
  - `auth.py`: JWT Generation and SQLite user registration.
  - `predict.py`: Houses all Machine Learning inference logic and heuristic fallbacks.
  - `market.py`: B2B connections and API integrations.
- **Data ORM**: SQLAlchemy handles all database transactions safely.
- **ML Engine**: TensorFlow/Keras (Disease CNN), Scikit-Learn (Crop/Fertilizer ML).

---

## 🚀 Running the Project Locally

### Prerequisites
- **Node.js**: v18+
- **Python**: v3.10 or v3.11 (Note: TensorFlow deep learning requires specific Python versions).

### 1. Initialize the Backend
Open a terminal and initialize a Python 3.10/3.11 virtual environment:
```bash
cd backend
python -m venv venv

# On Windows:
.\venv\Scripts\Activate.ps1
# On MacOS/Linux:
# source venv/bin/activate

# Install requirements
pip install fastapi uvicorn pydantic sqlalchemy passlib python-jose scikit-learn pillow opencv-python-headless python-multipart tensorflow numpy groq

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
*Note: Ensure the backend is running first so the UI can establish its data fetches.*

---

## 🧪 Testing & QA
An extensive End-to-End (E2E) testing suite has been performed on this application:
1. **Automated Subagents**: Ran Playwright bot integrations simulating human clicks to verify JWT token generation, routing limits, and form payloads.
2. **Fallback Verification**: Deliberately deleted ML Models to verify the backend's ability to seamlessly switch to heuristic mathematics without throwing a Server 500 error. Check `test_fastapi.py` for API endpoint integrity tests.

## 📚 Datasets & Research Background
This project builds upon the foundational research paper published on IEEE: [Smart Crop Recommendation System with Plant Disease Identification](https://ieeexplore.ieee.org/document/10738975).

The underlying datasets include:
- **Crop Recommendation Dataset**: 2,200 unique rows analyzing ecological variables.
- **Plant Disease Dataset**: 70,295 highly resolute training images covering 38 diseases (e.g., Apple Scab, Tomato Blight). 
- **Fertilizer Mapping**: Complex algorithmic classifications mapping soil properties to NPK chemical structures.
