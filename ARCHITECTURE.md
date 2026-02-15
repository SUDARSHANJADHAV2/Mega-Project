# KrushiAI Architecture

## Overview
KrushiAI is a modular smart farming assistant that leverages Machine Learning and real-time data to provide agricultural insights. It is designed as a production-grade system with a unified frontend, a secure backend proxy, and integrated authentication.

## System Components
1. **Frontend Hub (`main_app.py`)**: A centralized Streamlit-based dashboard that integrates all seven major modules:
   - **Smart Crop Recommendation**: Recommends crops based on soil and weather parameters.
   - **Plant Disease Identification**: Uses CNNs to identify diseases from leaf images.
   - **Fertilizer Recommendation**: Provides optimal fertilizer advice based on NPK values.
   - **Soil Health Analysis**: Diagnostic scoring and health assessment.
   - **Market Intelligence**: Real-time price tracking and historical trends.
   - **Yield Prediction**: Production estimation based on regional data.
   - **Weather Forecasts**: Real-time meteorological data integration.

2. **Backend Proxy & API (`backend/main.py`)**: A FastAPI server that handles:
   - **Authentication**: JWT-based security with support for Email/Password, Google OAuth (mock), and Phone/OTP (mock).
   - **External API Proxy**: Protects credentials for OpenWeatherMap and OpenRouter.
   - **Database**: SQLite database (`krushiai.db`) managed via SQLAlchemy for user data persistence.

3. **ML Models**:
   - **Crop Recommendation**: Random Forest model (`RF.pkl`).
   - **Fertilizer Recommendation**: Random Forest model (`Fertilizer_RF.pkl`).
   - **Disease Identification**: CNN model (`trained_plant_disease_model.keras`) covering 38 disease classes.

## Data Flow
- **Authentication**: Users must register or login via the Frontend Gatekeeper. Successful login issues a JWT stored in the session state.
- **Request Cycle**: Frontend modules request data or predictions. Core logic is decoupled into `utils.py` files for modularity.
- **Persistence**: User profiles and preferences are stored in the SQLite database.
- **Explainable AI (XAI)**: Crop recommendations include SHAP-based feature importance visualizations for transparency.

## Security
- **JWT Authentication**: All sensitive operations are protected by JSON Web Tokens.
- **Credential Management**: API keys and secrets are managed through environment variables (`.env`).
- **Password Hashing**: User passwords are securely hashed using `bcrypt`.
- **Backend Isolation**: Sensitive external API calls are proxied through the backend to prevent key exposure.

## Installation & Setup
1. Install dependencies: `pip install -r requirements.txt`
2. Configure `.env` with `OPENWEATHERMAP_API_KEY`, `OPENROUTER_API_KEY`, and `JWT_SECRET`.
3. Start the backend: `python backend/main.py`
4. Launch the dashboard: `streamlit run main_app.py`
