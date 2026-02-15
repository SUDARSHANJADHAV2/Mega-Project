import streamlit as st
import pandas as pd
import os

def inject_custom_css():
    css_file = os.path.join(os.getcwd(), 'css', 'streamlit_style.css')
    if os.path.exists(css_file):
        with open(css_file) as f:
            st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

def show_soil_analysis():
    inject_custom_css()
    st.title("🧪 Soil Health Analysis")
    st.write("Get a detailed diagnostic of your soil health based on nutrient levels.")

    col1, col2, col3 = st.columns(3)
    with col1:
        n = st.number_input("Nitrogen (N)", 0, 150, 50)
    with col2:
        p = st.number_input("Phosphorus (P)", 0, 150, 50)
    with col3:
        k = st.number_input("Potassium (K)", 0, 150, 50)

    ph = st.slider("pH Level", 0.0, 14.0, 6.5)

    if st.button("Analyze Soil"):
        score = 0
        recommendations = []

        # Simple heuristic for demonstration
        if 40 <= n <= 80: score += 25
        else: recommendations.append("Consider Nitrogen supplements like Urea if N is low.")

        if 30 <= p <= 70: score += 25
        else: recommendations.append("Apply Phosphorus-rich fertilizers like DAP if P is low.")

        if 30 <= k <= 70: score += 25
        else: recommendations.append("Use Potash to improve Potassium levels.")

        if 6.0 <= ph <= 7.5: score += 25
        else: recommendations.append("Adjust pH using Lime (for acidic) or Sulfur (for alkaline) soil.")

        st.subheader(f"Soil Health Score: {score}/100")
        if score >= 75:
            st.success("Your soil is in excellent condition!")
        elif score >= 50:
            st.warning("Your soil is in fair condition. See recommendations.")
        else:
            st.error("Your soil needs urgent attention.")

        if recommendations:
            st.write("### Recommendations:")
            for rec in recommendations:
                st.write(f"- {rec}")
