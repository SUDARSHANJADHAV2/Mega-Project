import streamlit as st
import pandas as pd
import os
import plotly.express as px
import numpy as np
from datetime import datetime, timedelta

def inject_custom_css():
    css_file = os.path.join(os.getcwd(), 'css', 'streamlit_style.css')
    if os.path.exists(css_file):
        with open(css_file) as f:
            st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

def show_market_intelligence():
    inject_custom_css()
    st.title("📈 Market Intelligence")
    st.write("Real-time (simulated) commodity price tracking and trends.")

    crops = ["Rice", "Wheat", "Maize", "Cotton", "Jute"]
    selected_crop = st.selectbox("Select Crop", crops)

    # Generate mock data
    dates = [datetime.now() - timedelta(days=x) for x in range(30)]
    prices = np.random.randint(2000, 3000, size=30) + np.sin(np.linspace(0, 10, 30)) * 100
    df = pd.DataFrame({"Date": dates, "Price (per Quintal)": prices})

    fig = px.line(df, x="Date", y="Price (per Quintal)", title=f"Price Trend for {selected_crop}")
    st.plotly_chart(fig, use_container_width=True)

    col1, col2 = st.columns(2)
    with col1:
        st.metric("Current Price", f"₹{int(prices[0])}", "+2.3%")
    with col2:
        st.metric("Monthly Avg", f"₹{int(np.mean(prices))}", "-0.5%")
