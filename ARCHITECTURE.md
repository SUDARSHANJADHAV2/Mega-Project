# KrushiAI Architecture

## Overview
KrushiAI is a modular smart farming assistant that leverages Machine Learning and real-time data to provide agricultural insights.

## System Components
1. **Frontend**: Streamlit-based dashboards for Crop and Fertilizer recommendations, and HTML/JS modules for Weather and Chatbot.
2. **Backend Proxy**: A FastAPI server (`backend/main.py`) that handles external API requests (OpenWeatherMap, OpenRouter) to protect API keys and centralize data flow.
3. **ML Models**:
   - **Crop Recommendation**: Random Forest model (`RF.pkl`).
   - **Fertilizer Recommendation**: Random Forest model (`Fertilizer_RF.pkl`).
   - **Disease Identification**: CNN model (`trained_plant_disease_model.keras`).

## Data Flow
- User inputs data via Streamlit or HTML forms.
- The frontend requests real-time weather data or chatbot responses via the Backend Proxy.
- ML models process the data and return actionable recommendations.
- Explainable AI (XAI) components visualize feature importance to provide transparency.

## Security
- API keys are managed through environment variables (`.env`).
- Backend proxy ensures that sensitive credentials are never exposed to the client-side code.
