import streamlit as st
import os
import sys
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Ensure the subfolder is in path
subfolder = os.path.join(os.getcwd(), 'KrushiAI-Crop-Recommendation')
if subfolder not in sys.path:
    sys.path.append(subfolder)

from crop_utils import predict_crop, load_model

def inject_custom_css():
    css_file = os.path.join(os.getcwd(), 'css', 'streamlit_style.css')
    if os.path.exists(css_file):
        with open(css_file) as f:
            st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

def show_crop_rec():
    inject_custom_css()
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

            # XAI Section
            st.markdown("---")
            st.subheader("🔍 Explainable AI (XAI) Insights")
            model = load_model()
            features = ['Nitrogen', 'Phosphorus', 'Potassium', 'Temperature', 'Humidity', 'pH', 'Rainfall']
            importances = model.feature_importances_

            df_importance = pd.DataFrame({'Feature': features, 'Importance': importances})
            df_importance = df_importance.sort_values(by='Importance', ascending=False)

            fig, ax = plt.subplots(figsize=(10, 6))
            sns.barplot(x='Importance', y='Feature', data=df_importance, ax=ax, palette='magma')
            ax.set_title("Which factors influenced this recommendation?")
            st.pyplot(fig)

            with st.expander("What does this mean?"):
                st.write(f"The model analyzed your input and found that **{df_importance.iloc[0]['Feature']}** was the most significant factor in recommending **{prediction}**.")

        except Exception as e:
            st.error(f"Prediction error: {e}")
