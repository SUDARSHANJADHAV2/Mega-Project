import streamlit as st
import os
import sys

# Ensure the subfolder is in path
subfolder = os.path.join(os.getcwd(), 'KrushiAI-Crop-Recommendation')
if subfolder not in sys.path:
    sys.path.append(subfolder)

from crop_utils import predict_crop

def show_crop_rec():
    st.title("🔮 Smart Crop Recommendation")
    st.write("Find the most suitable crop for your farm using ML.")

    col1, col2 = st.columns(2)
    with col1:
        n = st.number_input("Nitrogen", 0, 140, 90)
        p = st.number_input("Phosphorus", 0, 145, 42)
        k = st.number_input("Potassium", 0, 205, 43)
        temp = st.number_input("Temperature (°C)", 8.0, 45.0, 20.0)
    with col2:
        humidity = st.number_input("Humidity (%)", 14.0, 100.0, 82.0)
        ph = st.number_input("pH level", 3.5, 10.0, 6.5)
        rainfall = st.number_input("Rainfall (mm)", 20.0, 300.0, 202.0)

    if st.button("Predict Optimal Crop"):
        try:
            prediction = predict_crop(n, p, k, temp, humidity, ph, rainfall)
            st.success(f"The most suitable crop for your land is: **{prediction.upper()}**")
        except Exception as e:
            st.error(f"Prediction error: {e}")
