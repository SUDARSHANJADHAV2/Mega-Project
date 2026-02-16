"""
KrushiAI Fertilizer Recommendation Module (Lightweight Wrapper)
Provides fertilizer suggestions for the unified hub based on
soil quality, crop type, and environmental conditions.
"""

import streamlit as st
import pickle
import os
import numpy as np
import logging

logger = logging.getLogger(__name__)

BASE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "KrushiAI-Fertilizer-Recommendation")

# Fertilizer application guidelines
FERTILIZER_TIPS = {
    "Urea": "High nitrogen fertilizer (46% N). Apply in split doses for better efficiency.",
    "DAP": "Di-ammonium Phosphate (18% N, 46% P₂O₅). Best applied at planting time.",
    "14-35-14": "NPK complex — excellent for fruit crops and vegetables at planting.",
    "28-28": "Balanced N-P fertilizer for field crops and vegetables.",
    "17-17-17": "Complete balanced NPK — ideal as a general-purpose fertilizer.",
    "20-20": "Good N-P balance for cereals, pulses, and oilseeds.",
    "10-26-26": "High P-K fertilizer — promotes root development and disease resistance.",
}


@st.cache_resource
def load_fertilizer_assets():
    """Load all fertilizer model components with caching."""
    try:
        model_path = os.path.join(BASE_DIR, "Fertilizer_RF.pkl")
        crop_enc_path = os.path.join(BASE_DIR, "crop_encoder.pkl")
        fert_enc_path = os.path.join(BASE_DIR, "fertilizer_encoder.pkl")
        soil_enc_path = os.path.join(BASE_DIR, "soil_encoder.pkl")
        scaler_path = os.path.join(BASE_DIR, "feature_scaler.pkl")

        with open(model_path, "rb") as f:
            model = pickle.load(f)
        with open(crop_enc_path, "rb") as f:
            crop_enc = pickle.load(f)
        with open(fert_enc_path, "rb") as f:
            fert_enc = pickle.load(f)
        with open(soil_enc_path, "rb") as f:
            soil_enc = pickle.load(f)

        # Scaler is optional (may not exist in older versions)
        scaler = None
        if os.path.exists(scaler_path):
            with open(scaler_path, "rb") as f:
                scaler = pickle.load(f)

        logger.info("Fertilizer model and encoders loaded successfully")
        return model, crop_enc, fert_enc, soil_enc, scaler

    except FileNotFoundError as e:
        logger.error(f"Model file not found: {e}")
        return None, None, None, None, None
    except Exception as e:
        logger.error(f"Error loading fertilizer assets: {e}")
        return None, None, None, None, None


def show_fertilizer_advice():
    """Display the fertilizer recommendation interface."""
    st.title("🧪 Fertilizer Recommendation")
    st.write("Get tailored fertilizer suggestions based on soil quality and crop needs.")

    model, crop_enc, fert_enc, soil_enc, scaler = load_fertilizer_assets()

    if model is None:
        st.error(
            "⚠️ Fertilizer model not available. "
            "Please ensure all model files exist in the KrushiAI-Fertilizer-Recommendation folder."
        )
        return

    col1, col2 = st.columns(2)

    with col1:
        st.subheader("🌤️ Environment")
        temp = st.number_input(
            "Temperature (°C)", min_value=0, max_value=50, value=25,
            key="fert_temp",
        )
        hum = st.number_input(
            "Humidity (%)", min_value=10, max_value=100, value=60,
            key="fert_hum",
        )
        moist = st.number_input(
            "Soil Moisture (%)", min_value=10, max_value=100, value=50,
            key="fert_moist",
        )

    with col2:
        st.subheader("🌱 Soil & Crop")
        # Use actual encoder classes for dropdowns
        soil_options = list(soil_enc.classes_) if soil_enc is not None else [
            "Sandy", "Loamy", "Black", "Red", "Clayey"
        ]
        crop_options = list(crop_enc.classes_) if crop_enc is not None else [
            "Maize", "Sugarcane", "Cotton", "Tobacco", "Paddy",
            "Barley", "Wheat", "Millets", "Oil seeds", "Pulses", "Ground Nuts",
        ]

        soil = st.selectbox("Soil Type", soil_options, key="fert_soil")
        crop = st.selectbox("Crop Type", crop_options, key="fert_crop")

    st.subheader("🧪 Nutrient Levels (mg/kg)")
    ncol1, ncol2, ncol3 = st.columns(3)
    with ncol1:
        n = st.number_input("Nitrogen (N)", min_value=0, max_value=300, value=50, key="fert_n")
    with ncol2:
        k = st.number_input("Potassium (K)", min_value=0, max_value=300, value=50, key="fert_k")
    with ncol3:
        p = st.number_input("Phosphorus (P)", min_value=0, max_value=300, value=50, key="fert_p")

    st.markdown("---")

    if st.button("💊 Recommend Fertilizer", use_container_width=True, key="fert_predict_btn"):
        try:
            # Encode categorical inputs
            soil_encoded = soil_enc.transform([soil])[0]
            crop_encoded = crop_enc.transform([crop])[0]

            # Feature order: temp, humidity, moisture, soil, crop, N, K, P
            features = np.array(
                [[temp, hum, moist, soil_encoded, crop_encoded, n, k, p]]
            )

            # Apply scaling if scaler is available
            if scaler is not None:
                features = scaler.transform(features)

            prediction = model.predict(features)
            fert_name = fert_enc.inverse_transform(prediction)[0]

            # Get confidence if available
            confidence_text = ""
            if hasattr(model, "predict_proba"):
                probas = model.predict_proba(features)[0]
                confidence = np.max(probas) * 100
                confidence_text = f" (Confidence: {confidence:.1f}%)"

            st.success(f"### ✅ Recommended Fertilizer: **{fert_name}**{confidence_text}")

            # Show fertilizer info
            if fert_name in FERTILIZER_TIPS:
                st.info(f"💡 **Tip:** {FERTILIZER_TIPS[fert_name]}")

            # Show feature importance
            if hasattr(model, "feature_importances_"):
                st.markdown("#### 🧠 Feature Importance")
                import pandas as pd
                feature_names = ["Temp", "Humidity", "Moisture", "Soil", "Crop", "N", "K", "P"]
                feat_df = pd.DataFrame({
                    "Feature": feature_names,
                    "Importance": model.feature_importances_,
                }).sort_values("Importance", ascending=True)
                st.bar_chart(feat_df.set_index("Feature"))

        except ValueError as e:
            st.error(f"Input encoding error: {e}. Please check soil and crop types.")
        except Exception as e:
            logger.error(f"Fertilizer prediction error: {e}")
            st.error(f"Prediction error: {e}")
