import streamlit as st
import requests
import os
from streamlit_option_menu import option_menu

# Import sub-modules (ensure they exist)
from soil_analysis import show_soil_analysis
from market_intelligence import show_market_intelligence
from yield_prediction import show_yield_prediction
from disease_detection import show_disease_detection
from fertilizer_advice import show_fertilizer_advice

# Import recommendation logic (mocking or calling existing webapps)
# For simplicity in this unified hub, we will wrap the logic from subfolders.
import sys
sys.path.append(os.path.join(os.getcwd(), 'KrushiAI-Crop-Recommendation'))
sys.path.append(os.path.join(os.getcwd(), 'KrushiAI-Fertilizer-Recommendation'))

BACKEND_URL = "http://localhost:8000/api"

st.set_page_config(page_title="KrushiAI - Smart Farming Assistant", layout="wide")

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
    st.markdown("""
        <div style='text-align: center;'>
            <h1>🌾 KrushiAI Gateway</h1>
            <p>Your AI-Powered Agricultural Companion</p>
        </div>
    """, unsafe_allow_html=True)

    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        tab1, tab2, tab3, tab4 = st.tabs(["🔑 Login", "📝 Sign Up", "🌐 Google", "📱 Phone"])

        with tab1:
            email = st.text_input("Email")
            password = st.text_input("Password", type="password")
            if st.button("Login", use_container_width=True):
                if login_user(email, password):
                    st.rerun()

        with tab2:
            reg_name = st.text_input("Full Name")
            reg_email = st.text_input("Email (Signup)")
            reg_phone = st.text_input("Phone Number")
            reg_pass = st.text_input("Password (Signup)", type="password")
            if st.button("Register", use_container_width=True):
                register_user(reg_email, reg_pass, reg_name, reg_phone)

        with tab3:
            st.write("Login securely with your Google account.")
            if st.button("Continue with Google", use_container_width=True):
                if google_login_mock():
                    st.rerun()

        with tab4:
            phone_num = st.text_input("Enter Phone Number (+91...)")
            otp = st.text_input("Enter OTP (Mock: 123456)")
            if st.button("Verify & Login", use_container_width=True):
                if otp == "123456" and phone_login_mock(phone_num):
                    st.rerun()

# --- Main App Logic ---

def main():
    if not st.session_state.authenticated:
        login_page()
        return

    # Sidebar Navigation
    with st.sidebar:
        st.image("images/logo.png", width=100) if os.path.exists("images/logo.png") else st.title("KrushiAI")
        st.write(f"Welcome, **{st.session_state.user['name']}**!")

        selected = option_menu(
            "Main Menu",
            ["Home", "Crop Recommendation", "Disease Detection", "Fertilizer Advice",
             "Soil Health", "Market Insights", "Yield Prediction"],
            icons=['house', 'magic', 'bug', 'flask', 'activity', 'graph-up', 'flower1'],
            menu_icon="cast", default_index=0,
        )

        if st.button("Logout"):
            st.session_state.authenticated = False
            st.session_state.user = None
            st.rerun()

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

def show_home():
    st.title("🌾 Welcome to KrushiAI Unified Hub")
    st.write("Your All-in-One AI Powered Smart Farming Assistant.")

    col1, col2 = st.columns(2)
    with col1:
        st.markdown("""
        ### Core Features
        - **Crop Recommendation**: Smart suggestions based on soil and weather.
        - **Disease Identification**: CNN-powered plant health check.
        - **Market Tracker**: Stay updated with commodity prices.
        - **Soil Diagnostics**: Detailed NPK and pH analysis.
        """)
    with col2:
        st.image("https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1000", caption="Smart Farming")

if __name__ == "__main__":
    main()
