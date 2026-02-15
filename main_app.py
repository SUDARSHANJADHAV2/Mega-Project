import streamlit as st
import requests
import os
from streamlit_option_menu import option_menu

# Import sub-modules from the modules directory
from modules.soil_analysis import show_soil_analysis
from modules.market_intelligence import show_market_intelligence
from modules.yield_prediction import show_yield_prediction
from modules.disease_detection import show_disease_detection
from modules.fertilizer_advice import show_fertilizer_advice
from modules.crop_app import show_crop_rec
from modules.weather_app import show_weather
from modules.chatbot import show_chatbot

import sys
# Ensure relevant subfolders are in path for internal module logic
sys.path.append(os.path.join(os.getcwd(), 'modules'))
sys.path.append(os.path.join(os.getcwd(), 'KrushiAI-Crop-Recommendation'))
sys.path.append(os.path.join(os.getcwd(), 'KrushiAI-Fertilizer-Recommendation'))

BACKEND_URL = "http://localhost:8000/api"

st.set_page_config(page_title="KrushiAI - Smart Farming Assistant", layout="wide")

def inject_custom_css():
    css_file = os.path.join(os.getcwd(), 'css', 'streamlit_style.css')
    if os.path.exists(css_file):
        with open(css_file) as f:
            st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

inject_custom_css()

# --- Session State ---
if 'authenticated' not in st.session_state:
    st.session_state.authenticated = False
if 'user' not in st.session_state:
    st.session_state.user = None

# --- Authentication UI ---

def login_user(email, password):
    try:
        response = requests.post(f"{BACKEND_URL}/token", data={"username": email, "password": password})
        if response.status_code == 200:
            data = response.json()
            st.session_state.authenticated = True
            st.session_state.user = {"name": data.get("full_name"), "email": email}
            return True
        else:
            st.error("Invalid credentials")
            return False
    except Exception as e:
        st.error(f"Error connecting to backend: {e}")
        return False

def register_user(email, password, full_name, phone):
    try:
        response = requests.post(f"{BACKEND_URL}/register", json={
            "email": email, "password": password, "full_name": full_name, "phone": phone
        })
        if response.status_code == 200:
            st.success("Registration successful! Please login.")
            return True
        else:
            st.error(response.json().get("detail", "Registration failed"))
            return False
    except Exception as e:
        st.error(f"Error connecting to backend: {e}")
        return False

def google_login_mock():
    # In a real app, this would use OAuth2 flow
    try:
        response = requests.post(f"{BACKEND_URL}/auth/google", json={
            "email": "google_user@gmail.com", "full_name": "Google User"
        })
        if response.status_code == 200:
            data = response.json()
            st.session_state.authenticated = True
            st.session_state.user = {"name": data.get("full_name"), "email": "google_user@gmail.com"}
            return True
    except: pass
    return False

def phone_login_mock(phone):
    try:
        response = requests.post(f"{BACKEND_URL}/auth/phone", json={
            "phone": phone, "full_name": f"User {phone[-4:]}"
        })
        if response.status_code == 200:
            data = response.json()
            st.session_state.authenticated = True
            st.session_state.user = {"name": data.get("full_name"), "phone": phone}
            return True
    except: pass
    return False

def login_page():
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        st.markdown("<div class='auth-container'>", unsafe_allow_html=True)
        st.markdown("<h1 class='logo-text'>🌾 KrushiAI</h1>", unsafe_allow_html=True)
        st.markdown("<p style='text-align: center; color: #64748b;'>The Future of Smart Farming</p>", unsafe_allow_html=True)

        tab1, tab2, tab3, tab4 = st.tabs(["🔑 Login", "📝 Sign Up", "🌐 Google", "📱 Phone"])

        with tab1:
            email = st.text_input("Email", placeholder="farmer@example.com")
            password = st.text_input("Password", type="password", placeholder="••••••••")
            if st.button("Sign In", use_container_width=True):
                if login_user(email, password):
                    st.rerun()

        with tab2:
            reg_name = st.text_input("Full Name", placeholder="John Doe")
            reg_email = st.text_input("Email (Signup)", placeholder="john@example.com")
            reg_phone = st.text_input("Phone Number", placeholder="+91...")
            reg_pass = st.text_input("Password (Signup)", type="password", placeholder="••••••••")
            if st.button("Create Account", use_container_width=True):
                register_user(reg_email, reg_pass, reg_name, reg_phone)

        with tab3:
            st.info("OAuth2 integration active (Simulator)")
            if st.button("Continue with Google", use_container_width=True):
                if google_login_mock():
                    st.rerun()

        with tab4:
            phone_num = st.text_input("Enter Phone Number", placeholder="+91...")
            otp = st.text_input("Enter OTP (Mock: 123456)", type="password")
            if st.button("Verify & Access", use_container_width=True):
                if otp == "123456" and phone_login_mock(phone_num):
                    st.rerun()

        st.markdown("</div>", unsafe_allow_html=True)

# --- Main App Logic ---

def main():
    if not st.session_state.authenticated:
        login_page()
        return

    # Sidebar Navigation
    with st.sidebar:
        st.markdown("<h1 style='color: #22c55e;'>🌾 KrushiAI</h1>", unsafe_allow_html=True)
        st.markdown(f"**Account:** {st.session_state.user['name']}")
        st.markdown(f"**Email:** {st.session_state.user.get('email', 'Phone User')}")
        st.markdown("---")

        selected = option_menu(
            "Main Menu",
            ["Home", "Crop Recommendation", "Disease Detection", "Fertilizer Advice",
             "Soil Health", "Market Insights", "Yield Prediction", "Weather Forecast", "AI Chatbot"],
            icons=['house', 'magic', 'bug', 'flask', 'activity', 'graph-up', 'flower1', 'cloud-sun', 'chat-quote'],
            menu_icon="cast", default_index=0,
        )

        if st.button("Logout"):
            st.session_state.authenticated = False
            st.session_state.user = None
            st.rerun()

    if selected == "Home":
        show_home()
    elif selected == "Crop Recommendation":
        show_crop_rec()
    elif selected == "Disease Detection":
        show_disease_detection()
    elif selected == "Fertilizer Advice":
        show_fertilizer_advice()
    elif selected == "Soil Health":
        show_soil_analysis()
    elif selected == "Market Insights":
        show_market_intelligence()
    elif selected == "Yield Prediction":
        show_yield_prediction()
    elif selected == "Weather Forecast":
        show_weather()
    elif selected == "AI Chatbot":
        show_chatbot()

def show_home():
    st.title("🚜 Agricultural Dashboard")
    st.write(f"Hello **{st.session_state.user['name']}**, welcome back to your smart farming assistant.")

    # High-level metrics
    m1, m2, m3 = st.columns(3)
    m1.metric("System Status", "Online", "Operational")
    m2.metric("Connected Farm", "Primary", "Active")
    m3.metric("AI Model", "V2.4.0", "Latest")

    st.markdown("---")

    col1, col2 = st.columns([2, 1])
    with col1:
        st.markdown("""
        ### 🌟 Platform Overview
        KrushiAI integrates advanced machine learning models to provide actionable insights for your farm:

        *   **Smart Recommendations**: Data-driven crop and fertilizer advice.
        *   **Plant Health**: Instant disease identification via image analysis.
        *   **Market Intelligence**: Real-time tracking of commodity prices.
        *   **Environment**: Hyper-local weather forecasting for planning.
        """)

    with col2:
        st.image("https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1000", caption="Sustainable Agriculture")

    st.markdown("### 📢 Agricultural News & Tips")
    st.info("💡 Tip: Always check the weather forecast before applying fertilizers to prevent runoff.")

if __name__ == "__main__":
    main()
