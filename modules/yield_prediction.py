import streamlit as st
import os

def inject_custom_css():
    css_file = os.path.join(os.getcwd(), 'css', 'streamlit_style.css')
    if os.path.exists(css_file):
        with open(css_file) as f:
            st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

def show_yield_prediction():
    inject_custom_css()
    st.title("🌾 Yield Prediction")
    st.write("Estimate your crop production based on area and historical data.")

    crop = st.selectbox("Crop", ["Rice", "Wheat", "Maize", "Sugarcane"])
    area = st.number_input("Land Area (Acres)", 1.0, 1000.0, 5.0)
    region = st.selectbox("Region Type", ["Arid", "Semi-Arid", "Humid", "Coastal"])

    # Mock prediction logic
    yield_map = {"Rice": 2.5, "Wheat": 2.0, "Maize": 3.0, "Sugarcane": 30.0}
    multiplier = {"Arid": 0.7, "Semi-Arid": 0.9, "Humid": 1.1, "Coastal": 1.0}

    base_yield = yield_map.get(crop, 1.0)
    adj_yield = base_yield * multiplier.get(region, 1.0)
    total_yield = adj_yield * area

    if st.button("Predict Yield"):
        st.subheader(f"Estimated Production: {total_yield:.2f} Tons")
        st.info(f"Base yield for {crop} in {region} region is approx {adj_yield:.2f} tons/acre.")
        st.write("---")
        st.write("**Factors considered:** Area, Crop Type, Climatic Region.")
