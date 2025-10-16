import streamlit as st
from st_pages import Page, Section, show_pages, add_page_title

st.set_page_config(
    page_title="KrushiAI",
    page_icon="🌾",
    layout="wide",
    initial_sidebar_state="expanded"
)

show_pages(
    [
        Page("app.py", "Home", "🏠"),
        Section(name="Features", icon="✨"),
        Page("pages/crop_recommendation.py", "Crop Recommendation", "🌱"),
        Page("pages/disease_recognition.py", "Disease Recognition", "🔬"),
        Page("pages/fertilizer_recommendation.py", "Fertilizer Recommendation", "🧪"),
        Page("pages/weather_forecast.py", "Weather Forecast", "🌦️"),
    ]
)

add_page_title()

st.title("Welcome to KrushiAI!")
st.write("Your smart farming assistant.")