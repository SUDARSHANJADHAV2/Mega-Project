## Importing necessary libraries for the web app
import streamlit as st
import numpy as np
import pandas as pd
import os
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
import requests
from utils import load_model, predict_crop, crop_info

warnings.filterwarnings('ignore')

# Set page configuration
st.set_page_config(
    page_title="KrushiAI - Crop Recommendation System",
    page_icon="🌱",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better UI
st.markdown("""
    <style>
    .main { padding: 2rem; }
    .stApp { background-color: #1a1a1a; color: #ffffff; }
    .stButton>button {
        background-color: #4CAF50; color: white; font-weight: bold;
        border-radius: 8px; padding: 0.5rem 1rem; width: 100%;
        border: none; box-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
        transition: all 0.3s ease;
    }
    .stButton>button:hover {
        background-color: #45a049; transform: translateY(-1px);
    }
    h1, h2, h3 { color: #66BB6A !important; font-weight: bold; }
    .stSidebar { background-color: #2d2d2d; padding: 1rem; border-right: 1px solid #444; }
    .stInfo { background-color: #2d4a2d; color: #ffffff; border: 1px solid #4CAF50; }
    .result-card {
        background-color:#2d5a2d; padding:20px; border-radius:10px;
        margin-bottom:20px; border: 2px solid #4CAF50;
        box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
    }
    </style>
""", unsafe_allow_html=True)

# Load the dataset for reference and display
@st.cache_data
def get_data():
    try:
        return pd.read_csv('Crop_recommendation.csv')
    except Exception as e:
        st.error(f"Error loading dataset: {e}")
        return pd.DataFrame()

# Load the model
model = load_model('RF.pkl')

def main():
    # Display header with logo
    col1, col2 = st.columns([1, 4])
    with col1:
        from PIL import Image
        if os.path.exists("crop.png"):
            st.image(Image.open("crop.png"), width=120)
        else:
            st.markdown("# 🌱")

    with col2:
        st.markdown("<h1 style='text-align: left;'>KrushiAI: Smart Crop Recommendation</h1>", unsafe_allow_html=True)
        st.markdown("### AI-Powered Precision Agriculture")

    # Create tabs for different sections
    tab1, tab2, tab3 = st.tabs(["🔮 Prediction", "📊 Dataset Insights", "ℹ️ About"])
    
    with tab1:
        st.markdown("### Get Your Crop Recommendation")
        st.write("Enter your soil and climate parameters to get a personalized crop recommendation.")
        
        col1, col2 = st.columns([1, 1])
        
        with col1:
            st.subheader("Soil & Climate Parameters")
            
            # Weather Integration Feature
            with st.expander("🌤️ Auto-fill climate from Weather Data"):
                city = st.text_input("Enter City Name", "")
                if st.button("Fetch Weather"):
                    if city:
                        try:
                            # Using the backend proxy we created
                            response = requests.get(f"http://localhost:8000/api/weather/{city}")
                            if response.status_code == 200:
                                w_data = response.json()
                                st.session_state.temp = float(w_data['main']['temp'])
                                st.session_state.hum = float(w_data['main']['humidity'])
                                st.success(f"Updated: {city} is {st.session_state.temp}°C with {st.session_state.hum}% humidity.")
                            else:
                                st.error("City not found or API error.")
                        except Exception as e:
                            st.error(f"Could not connect to weather service: {e}")
                    else:
                        st.warning("Please enter a city name.")

            n = st.number_input("🧪 Nitrogen (N)", 0.0, 140.0, 50.0)
            p = st.number_input("🧪 Phosphorus (P)", 0.0, 145.0, 50.0)
            k = st.number_input("🧪 Potassium (K)", 0.0, 205.0, 50.0)
            ph = st.number_input("🧪 pH Level", 0.0, 14.0, 6.5)
            
            # Use session state for weather-aware fields
            temp = st.number_input("🌡️ Temperature (°C)", 0.0, 50.0, st.session_state.get('temp', 25.0))
            hum = st.number_input("💧 Humidity (%)", 0.0, 100.0, st.session_state.get('hum', 60.0))
            rain = st.number_input("🌧️ Rainfall (mm)", 0.0, 500.0, 100.0)

            predict_button = st.button("🔮 Predict Best Crop")
        
        with col2:
            st.subheader("Recommendation Results")
            if predict_button:
                with st.spinner('Analyzing environmental factors...'):
                    result = predict_crop(model, [n, p, k, temp, hum, ph, rain])

                    if result and result != "Prediction error":
                        st.markdown(f"""
                        <div class="result-card">
                            <h3 style="color:#81C784; text-align:center;">🌱 Recommended Crop</h3>
                            <h2 style="color:#ffffff; text-align:center; text-transform:uppercase; font-size:2.5rem;">{result}</h2>
                        </div>
                        """, unsafe_allow_html=True)
                        
                        rec_lower = result.lower().replace(" ", "")
                        if rec_lower in crop_info:
                            st.info(crop_info[rec_lower])
                        
                        # Visualization
                        st.markdown("### 🧠 Explainable AI: Feature Contribution")
                        
                        try:
                            # Get feature importances from the model
                            importances = model.feature_importances_
                            feature_names = ['Nitrogen', 'Phosphorus', 'Potassium', 'Temperature', 'Humidity', 'pH', 'Rainfall']

                            feat_df = pd.DataFrame({
                                'Feature': feature_names,
                                'Importance': importances
                            }).sort_values(by='Importance', ascending=False)

                            fig_imp, ax_imp = plt.subplots(figsize=(10, 5), facecolor='#1a1a1a')
                            sns.barplot(x='Importance', y='Feature', data=feat_df, palette='magma', ax=ax_imp)
                            ax_imp.set_title('Global Model Feature Importance')
                            st.pyplot(fig_imp)
                            st.write(f"The model primarily relied on **{feat_df.iloc[0]['Feature']}** and **{feat_df.iloc[1]['Feature']}** to make this recommendation.")
                        except Exception as e:
                            st.write("Feature importance not available for this model type.")

                        st.markdown("### Parameter Profile")
                        params = ['N', 'P', 'K', 'Temp', 'Hum', 'pH', 'Rain']
                        vals = [n, p, k, temp, hum, ph, rain]
                        
                        plt.style.use('dark_background')
                        fig, ax = plt.subplots(figsize=(10, 4), facecolor='#1a1a1a')
                        sns.barplot(x=params, y=vals, palette='viridis', ax=ax)
                        ax.set_title('Your Input Parameters')
                        st.pyplot(fig)
                    else:
                        st.error("Prediction failed. Please check the model file and inputs.")
            else:
                st.info("Adjust the parameters on the left and click predict.")

    with tab2:
        df = get_data()
        if not df.empty:
            st.markdown("### Dataset Overview")
            st.write(f"Analyzing {len(df)} records of {df['label'].nunique()} different crops.")

            col_a, col_b = st.columns(2)
            with col_a:
                st.subheader("Data Sample")
                st.dataframe(df.head(10))

            with col_b:
                st.subheader("Crop Distribution")
                fig2, ax2 = plt.subplots(figsize=(10, 6))
                df['label'].value_counts().plot(kind='pie', autopct='%1.1f%%', ax=ax2)
                ax2.set_ylabel('')
                st.pyplot(fig2)
        else:
            st.warning("Dataset not found.")

    with tab3:
        st.markdown("""
        ### About the Model
        KrushiAI uses a **Random Forest Classifier** trained on high-quality agricultural data.
        The model evaluates multiple environmental variables to predict the crop with the highest success rate.
        
        #### Features used:
        - **N-P-K**: Primary nutrients for plant growth.
        - **pH**: Soil acidity/alkalinity affecting nutrient availability.
        - **Temperature & Humidity**: Key climate factors for plant metabolism.
        - **Rainfall**: Water availability for the crop.
        """)

if __name__ == '__main__':
    main()
