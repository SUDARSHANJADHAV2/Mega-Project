import streamlit as st
import os

st.set_page_config(layout="wide")

st.markdown("""
<style>
    iframe {
        width: 100%;
        height: 100vh;
        border: none;
    }
</style>
""", unsafe_allow_html=True)

st.title("Weather Forecast")

# Path to the weather forecast HTML file
weather_app_path = os.path.join("..", "KrushiAI-Weather-Forecast", "index.html")

# Check if the file exists
if os.path.exists(weather_app_path):
    st.components.v1.iframe(weather_app_path, height=1200, scrolling=True)
else:
    st.error("Weather forecast application not found.")