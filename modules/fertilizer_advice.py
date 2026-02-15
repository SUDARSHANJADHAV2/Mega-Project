import streamlit as st
import pickle
import os
import numpy as np

BASE_DIR = os.path.join(os.getcwd(), 'KrushiAI-Fertilizer-Recommendation')

@st.cache_resource
def inject_custom_css():
    css_file = os.path.join(os.getcwd(), 'css', 'streamlit_style.css')
    if os.path.exists(css_file):
        with open(css_file) as f:
            st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

def load_fertilizer_assets():
    with open(os.path.join(BASE_DIR, 'Fertilizer_RF.pkl'), 'rb') as f:
        model = pickle.load(f)
    with open(os.path.join(BASE_DIR, 'crop_encoder.pkl'), 'rb') as f:
        crop_enc = pickle.load(f)
    with open(os.path.join(BASE_DIR, 'fertilizer_encoder.pkl'), 'rb') as f:
        fert_enc = pickle.load(f)
    return model, crop_enc, fert_enc

def show_fertilizer_advice():
    inject_custom_css()
    st.title("🧪 Fertilizer Recommendation")
    st.write("Get tailored fertilizer suggestions based on soil quality and crop needs.")

    col1, col2 = st.columns(2)
    with col1:
        n = st.number_input("Nitrogen", 0, 100, 50)
        p = st.number_input("Phosphorus", 0, 100, 50)
        k = st.number_input("Potassium", 0, 100, 50)
    with col2:
        temp = st.number_input("Temperature (°C)", 10, 50, 25)
        hum = st.number_input("Humidity (%)", 10, 100, 60)
        moist = st.number_input("Moisture", 10, 100, 50)
        crop = st.selectbox("Crop Type", ['Maize', 'Sugarcane', 'Cotton', 'Tobacco', 'Paddy', 'Barley', 'Wheat', 'Millets', 'Oil seeds', 'Pulses', 'Ground Nuts'])

    if st.button("Recommend Fertilizer"):
        model, crop_enc, fert_enc = load_fertilizer_assets()

        # In a real app, we'd need to encode the inputs correctly.
        # This is a simplified demonstration matching the project's logic.
        try:
            # We need to transform the crop name to encoded value
            crop_encoded = crop_enc.transform([crop])[0]
            # Dummy soil type for now as it's often a feature in these models
            soil_encoded = 0

            features = np.array([[temp, hum, moist, soil_encoded, crop_encoded, n, p, k]])
            prediction = model.predict(features)
            fert_name = fert_enc.inverse_transform(prediction)[0]

            st.success(f"Recommended Fertilizer: **{fert_name}**")
        except Exception as e:
            st.error(f"Error: {e}")
