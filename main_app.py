"""
KrushiAI - Unified Smart Farming Hub
Main Streamlit application that integrates all AI modules:
- Crop Recommendation
- Disease Detection
- Fertilizer Advice
- Soil Health Analysis
- Market Intelligence
- Yield Prediction
"""

import streamlit as st
import requests
import os
import sys
import logging
from streamlit_option_menu import option_menu

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Add submodule paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CROP_DIR = os.path.join(BASE_DIR, "KrushiAI-Crop-Recommendation")
FERT_DIR = os.path.join(BASE_DIR, "KrushiAI-Fertilizer-Recommendation")

for path in [CROP_DIR, FERT_DIR]:
    if path not in sys.path:
        sys.path.insert(0, path)

# Import sub-modules
from soil_analysis import show_soil_analysis
from market_intelligence import show_market_intelligence
from yield_prediction import show_yield_prediction
from disease_detection import show_disease_detection
from fertilizer_advice import show_fertilizer_advice

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000/api")

# ============================
# Page Configuration
# ============================
st.set_page_config(
    page_title="KrushiAI - Smart Farming Assistant",
    page_icon="🌾",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ============================
# Session State Initialization
# ============================
if "authenticated" not in st.session_state:
    st.session_state.authenticated = False
if "user" not in st.session_state:
    st.session_state.user = None


# ============================
# Authentication Functions
# ============================

def login_user(email: str, password: str) -> bool:
    """Authenticate user via backend API."""
    if not email or not password:
        st.warning("Please enter both email and password.")
        return False
    try:
        response = requests.post(
            f"{BACKEND_URL}/token",
            data={"username": email, "password": password},
            timeout=10,
        )
        if response.status_code == 200:
            data = response.json()
            st.session_state.authenticated = True
            st.session_state.user = {
                "name": data.get("full_name", "User"),
                "email": email,
            }
            logger.info(f"User logged in: {email}")
            return True
        else:
            st.error("Invalid credentials. Please check your email and password.")
            return False
    except requests.ConnectionError:
        st.error("Cannot connect to backend server. Please ensure it is running.")
        return False
    except requests.Timeout:
        st.error("Connection timed out. Please try again.")
        return False
    except Exception as e:
        logger.error(f"Login error: {e}")
        st.error(f"An unexpected error occurred: {e}")
        return False


def register_user(email: str, password: str, full_name: str, phone: str) -> bool:
    """Register a new user via backend API."""
    if not email:
        st.warning("Email is required for registration.")
        return False
    if not password or len(password) < 6:
        st.warning("Password must be at least 6 characters.")
        return False

    try:
        response = requests.post(
            f"{BACKEND_URL}/register",
            json={
                "email": email,
                "password": password,
                "full_name": full_name,
                "phone": phone,
            },
            timeout=10,
        )
        if response.status_code == 200:
            st.success("Registration successful! Please login.")
            return True
        else:
            detail = response.json().get("detail", "Registration failed")
            st.error(detail)
            return False
    except requests.ConnectionError:
        st.error("Cannot connect to backend server. Please ensure it is running.")
        return False
    except Exception as e:
        logger.error(f"Registration error: {e}")
        st.error(f"An unexpected error occurred: {e}")
        return False


def google_login_mock() -> bool:
    """Mock Google OAuth login for demo purposes."""
    try:
        response = requests.post(
            f"{BACKEND_URL}/auth/google",
            json={"email": "google_user@gmail.com", "full_name": "Google User"},
            timeout=10,
        )
        if response.status_code == 200:
            data = response.json()
            st.session_state.authenticated = True
            st.session_state.user = {
                "name": data.get("full_name", "Google User"),
                "email": "google_user@gmail.com",
            }
            return True
    except Exception as e:
        logger.error(f"Google login error: {e}")
        st.error("Failed to connect. Please try again.")
    return False


def phone_login_mock(phone: str) -> bool:
    """Mock phone OTP login for demo purposes."""
    if not phone:
        st.warning("Please enter a phone number.")
        return False
    try:
        response = requests.post(
            f"{BACKEND_URL}/auth/phone",
            json={"phone": phone, "full_name": f"User {phone[-4:]}"},
            timeout=10,
        )
        if response.status_code == 200:
            data = response.json()
            st.session_state.authenticated = True
            st.session_state.user = {
                "name": data.get("full_name", "User"),
                "phone": phone,
            }
            return True
    except Exception as e:
        logger.error(f"Phone login error: {e}")
        st.error("Failed to connect. Please try again.")
    return False


# ============================
# Login Page
# ============================

def login_page():
    """Render the authentication page with login/signup options."""
    st.markdown(
        """
        <div style='text-align: center; padding: 2rem 0;'>
            <h1>🌾 KrushiAI Gateway</h1>
            <p style='font-size: 1.2rem; color: gray;'>
                Your AI-Powered Agricultural Companion
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        tab1, tab2, tab3, tab4 = st.tabs(
            ["🔑 Login", "📝 Sign Up", "🌐 Google", "📱 Phone"]
        )

        with tab1:
            email = st.text_input("Email", key="login_email")
            password = st.text_input("Password", type="password", key="login_password")
            if st.button("Login", use_container_width=True, key="login_btn"):
                if login_user(email, password):
                    st.rerun()

        with tab2:
            reg_name = st.text_input("Full Name", key="reg_name")
            reg_email = st.text_input("Email", key="reg_email")
            reg_phone = st.text_input("Phone Number", key="reg_phone")
            reg_pass = st.text_input("Password", type="password", key="reg_pass")
            if st.button("Register", use_container_width=True, key="reg_btn"):
                register_user(reg_email, reg_pass, reg_name, reg_phone)

        with tab3:
            st.write("Login securely with your Google account.")
            if st.button("Continue with Google", use_container_width=True, key="google_btn"):
                if google_login_mock():
                    st.rerun()

        with tab4:
            phone_num = st.text_input("Enter Phone Number (+91...)", key="phone_num")
            otp = st.text_input("Enter OTP (Demo: 123456)", key="otp")
            if st.button("Verify & Login", use_container_width=True, key="phone_btn"):
                if otp == "123456" and phone_login_mock(phone_num):
                    st.rerun()
                elif otp != "123456":
                    st.error("Invalid OTP. For demo, use 123456.")


# ============================
# Main Application
# ============================

def main():
    """Main application entry point with navigation."""
    if not st.session_state.authenticated:
        login_page()
        return

    # Sidebar Navigation
    with st.sidebar:
        logo_path = os.path.join(BASE_DIR, "images", "logo.png")
        if os.path.exists(logo_path):
            st.image(logo_path, width=100)
        else:
            st.markdown("# 🌾 KrushiAI")

        user_name = st.session_state.user.get("name", "User")
        st.write(f"Welcome, **{user_name}**!")

        selected = option_menu(
            "Main Menu",
            [
                "Home",
                "Crop Recommendation",
                "Disease Detection",
                "Fertilizer Advice",
                "Soil Health",
                "Market Insights",
                "Yield Prediction",
            ],
            icons=[
                "house",
                "magic",
                "bug",
                "flask",
                "activity",
                "graph-up",
                "flower1",
            ],
            menu_icon="cast",
            default_index=0,
        )

        st.markdown("---")
        if st.button("🚪 Logout", use_container_width=True):
            st.session_state.authenticated = False
            st.session_state.user = None
            st.rerun()

    # Page Routing
    if selected == "Home":
        show_home()
    elif selected == "Crop Recommendation":
        import crop_app
        crop_app.show_crop_rec()
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


# ============================
# Home Page
# ============================

def show_home():
    """Display the home dashboard with feature overview."""
    st.title("🌾 Welcome to KrushiAI Unified Hub")
    st.write("Your All-in-One AI Powered Smart Farming Assistant.")

    # Feature cards
    col1, col2, col3 = st.columns(3)

    with col1:
        st.markdown(
            """
            ### 🔮 Crop Recommendation
            Get AI-powered crop suggestions based on soil nutrients,
            weather conditions, and regional data.
            """
        )
        st.markdown(
            """
            ### 🧪 Soil Diagnostics
            Detailed NPK analysis and pH-based recommendations
            for optimal soil health.
            """
        )

    with col2:
        st.markdown(
            """
            ### 🌿 Disease Detection
            Upload leaf images for CNN-powered plant health
            analysis with treatment recommendations.
            """
        )
        st.markdown(
            """
            ### 📈 Market Intelligence
            Track commodity prices and trends for
            informed selling decisions.
            """
        )

    with col3:
        st.markdown(
            """
            ### 💊 Fertilizer Advice
            Get tailored fertilizer recommendations based on
            soil quality and crop requirements.
            """
        )
        st.markdown(
            """
            ### 🌾 Yield Prediction
            Estimate crop production based on area,
            crop type, and regional conditions.
            """
        )

    st.markdown("---")

    # Quick stats
    st.subheader("📊 System Capabilities")
    stat_col1, stat_col2, stat_col3, stat_col4 = st.columns(4)
    with stat_col1:
        st.metric("Crop Models", "5", help="ML models for crop recommendation")
    with stat_col2:
        st.metric("Disease Classes", "38", help="Plant diseases detected")
    with stat_col3:
        st.metric("Plant Types", "15+", help="Supported plant species")
    with stat_col4:
        st.metric("Accuracy", "96.5%", help="Disease detection model accuracy")

    st.image(
        "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1000",
        caption="Smart Farming with AI",
        use_container_width=True,
    )


if __name__ == "__main__":
    main()
