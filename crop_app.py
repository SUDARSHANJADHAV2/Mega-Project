"""
KrushiAI Crop Recommendation Module
Provides smart crop suggestions based on soil nutrients and climate parameters
using a trained Random Forest classifier.
"""

import streamlit as st
import os
import sys
import numpy as np
import pickle
import logging

logger = logging.getLogger(__name__)

# Ensure the subfolder is in path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CROP_DIR = os.path.join(BASE_DIR, "KrushiAI-Crop-Recommendation")
if CROP_DIR not in sys.path:
    sys.path.insert(0, CROP_DIR)

# Crop information for explanation
CROP_INFO = {
    "rice": "🌾 Rice thrives in warm, humid climates with high rainfall. Ideal for paddy fields with standing water.",
    "maize": "🌽 Maize grows best in well-drained loamy soil with moderate rainfall and warm temperatures.",
    "chickpea": "🫘 Chickpea prefers cool, dry climates with moderate rainfall and well-drained soils.",
    "kidneybeans": "🫘 Kidney beans need warm temperatures, moderate rainfall, and fertile loamy soil.",
    "pigeonpeas": "🫘 Pigeon peas are drought-tolerant and grow well in semi-arid tropical climates.",
    "mothbeans": "🫘 Moth beans are highly drought-resistant, suited for arid and semi-arid regions.",
    "mungbean": "🫘 Mung beans prefer warm, tropical climates with moderate rainfall.",
    "blackgram": "🫘 Black gram thrives in warm, humid climates with well-drained loamy soil.",
    "lentil": "🫘 Lentils grow best in cool climates with moderate rainfall and sandy loam soil.",
    "pomegranate": "🍎 Pomegranate thrives in semi-arid conditions with hot, dry summers.",
    "banana": "🍌 Banana grows best in tropical, humid climates with rich, well-drained soil.",
    "mango": "🥭 Mango prefers tropical and subtropical climates with a distinct dry season.",
    "grapes": "🍇 Grapes thrive in warm, dry climates with well-drained sandy loam soil.",
    "watermelon": "🍉 Watermelon needs warm temperatures, full sun, and sandy loam soil.",
    "muskmelon": "🍈 Muskmelon grows best in warm climates with sandy, well-drained soil.",
    "apple": "🍎 Apples need cold winters and moderate summers with well-drained soil.",
    "orange": "🍊 Oranges thrive in subtropical climates with well-drained, sandy loam soil.",
    "papaya": "🍈 Papaya loves tropical climates with rich, well-drained soil and warm temperatures year-round.",
    "coconut": "🥥 Coconut palms thrive in coastal tropical areas with high humidity.",
    "cotton": "🧵 Cotton grows best in warm climates with black soil and moderate rainfall.",
    "jute": "🧶 Jute prefers hot, humid climates with heavy rainfall and alluvial soil.",
    "coffee": "☕ Coffee grows in tropical highlands with rich soil and moderate shade.",
}


@st.cache_resource
def load_model():
    """Load the trained Random Forest model with caching."""
    try:
        model_path = os.path.join(CROP_DIR, "RandomForest.pkl")
        with open(model_path, "rb") as f:
            model = pickle.load(f)
        logger.info("Crop recommendation model loaded successfully")
        return model
    except FileNotFoundError:
        st.error("Model file not found. Please ensure RandomForest.pkl exists.")
        return None
    except Exception as e:
        logger.error(f"Error loading model: {e}")
        st.error(f"Error loading model: {e}")
        return None


def predict_crop(model, features: list) -> str:
    """Make crop prediction using the loaded model."""
    data = np.array([features])
    prediction = model.predict(data)
    return prediction[0]


def show_crop_rec():
    """Display the crop recommendation interface."""
    st.title("🔮 Smart Crop Recommendation")
    st.write("Find the most suitable crop for your farm using Machine Learning.")

    model = load_model()
    if model is None:
        return

    col1, col2 = st.columns(2)

    with col1:
        st.subheader("🧪 Soil Nutrients")
        n = st.number_input(
            "Nitrogen (N) - mg/kg",
            min_value=0, max_value=140, value=90,
            help="Nitrogen content in soil (0-140 mg/kg)",
            key="crop_n",
        )
        p = st.number_input(
            "Phosphorus (P) - mg/kg",
            min_value=0, max_value=145, value=42,
            help="Phosphorus content in soil (0-145 mg/kg)",
            key="crop_p",
        )
        k = st.number_input(
            "Potassium (K) - mg/kg",
            min_value=0, max_value=205, value=43,
            help="Potassium content in soil (0-205 mg/kg)",
            key="crop_k",
        )
        ph = st.number_input(
            "pH Level",
            min_value=3.5, max_value=10.0, value=6.5, step=0.1,
            help="Soil pH level (3.5-10.0). 7.0 is neutral.",
            key="crop_ph",
        )

    with col2:
        st.subheader("🌤️ Climate Parameters")
        temp = st.number_input(
            "Temperature (°C)",
            min_value=8.0, max_value=45.0, value=20.0, step=0.5,
            help="Average temperature during growing season",
            key="crop_temp",
        )
        humidity = st.number_input(
            "Humidity (%)",
            min_value=14.0, max_value=100.0, value=82.0, step=1.0,
            help="Average relative humidity percentage",
            key="crop_hum",
        )
        rainfall = st.number_input(
            "Rainfall (mm)",
            min_value=20.0, max_value=300.0, value=202.0, step=1.0,
            help="Average annual rainfall in millimeters",
            key="crop_rain",
        )

    st.markdown("---")

    if st.button("🔮 Predict Optimal Crop", use_container_width=True, key="crop_predict_btn"):
        try:
            features = [n, p, k, temp, humidity, ph, rainfall]
            prediction = predict_crop(model, features)
            crop_lower = prediction.lower().strip()

            st.success(f"### ✅ The most suitable crop for your land is: **{prediction.upper()}**")

            # Show crop info if available
            if crop_lower in CROP_INFO:
                st.info(CROP_INFO[crop_lower])

            # Show feature importance
            if hasattr(model, "feature_importances_"):
                st.markdown("#### 🧠 Feature Importance (Model Explanation)")
                feature_names = ["Nitrogen", "Phosphorus", "Potassium", "Temperature", "Humidity", "pH", "Rainfall"]
                importances = model.feature_importances_
                import pandas as pd
                feat_df = pd.DataFrame({
                    "Feature": feature_names,
                    "Importance": importances,
                }).sort_values("Importance", ascending=True)

                st.bar_chart(feat_df.set_index("Feature"))

                top_feature = feat_df.iloc[-1]["Feature"]
                st.caption(
                    f"The model relies most heavily on **{top_feature}** "
                    f"for making crop recommendations."
                )

        except Exception as e:
            logger.error(f"Prediction error: {e}")
            st.error(f"Prediction error: {e}")
