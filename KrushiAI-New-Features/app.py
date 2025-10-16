import streamlit as st

st.set_page_config(
    page_title="KrushiAI - New Features",
    page_icon="🌾",
    layout="wide",
)

st.title("Welcome to KrushiAI's New Features!")
st.sidebar.success("Select a feature above.")

st.markdown(
    """
    This application is a central hub for the latest features in the KrushiAI platform.

    ### How to get started

    Select a feature from the sidebar to the left. The available features are:
    - **Weather Dashboard**: Get real-time weather forecasts and crop-specific advice.
    - **Market Watch**: Analyze market prices and calculate potential profits.
    - **Irrigation Planner**: Optimize your irrigation schedule and conserve water.

    We hope you find these new tools valuable!
    """
)