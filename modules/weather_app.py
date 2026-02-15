import streamlit as st
import requests
import pandas as pd
import plotly.express as px
from datetime import datetime
import os

BACKEND_URL = "http://localhost:8000/api"

def fetch_weather_by_city(city):
    try:
        response = requests.get(f"{BACKEND_URL}/weather/{city}")
        if response.status_code == 200:
            return response.json()
        return None
    except:
        return None

def fetch_forecast_by_coords(lat, lon):
    try:
        response = requests.get(f"{BACKEND_URL}/forecast/coords/{lat}/{lon}")
        if response.status_code == 200:
            return response.json()
        return None
    except:
        return None

def inject_custom_css():
    css_file = os.path.join(os.getcwd(), 'css', 'streamlit_style.css')
    if os.path.exists(css_file):
        with open(css_file) as f:
            st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

def show_weather():
    inject_custom_css()
    st.title("🌦️ Real-time Weather Forecast")
    st.write("Get precise weather insights for better farm management.")

    city = st.text_input("Enter City Name", "New Delhi")

    if city:
        data = fetch_weather_by_city(city)
        if data:
            col1, col2, col3 = st.columns(3)

            with col1:
                st.metric("Temperature", f"{data['main']['temp']}°C", f"Feels like {data['main']['feels_like']}°C")
                st.write(f"**Condition:** {data['weather'][0]['description'].capitalize()}")

            with col2:
                st.metric("Humidity", f"{data['main']['humidity']}%")
                st.metric("Pressure", f"{data['main']['pressure']} hPa")

            with col3:
                st.metric("Wind Speed", f"{data['wind']['speed']} m/s")
                st.metric("Visibility", f"{data['visibility']/1000} km")

            # Forecast
            lat, lon = data['coord']['lat'], data['coord']['lon']
            forecast_data = fetch_forecast_by_coords(lat, lon)

            if forecast_data:
                st.subheader("5-Day Forecast")
                forecast_list = forecast_data['list']

                # Extract daily data (every 8th record approx)
                daily_data = []
                for i in range(0, len(forecast_list), 8):
                    item = forecast_list[i]
                    daily_data.append({
                        "Date": datetime.fromtimestamp(item['dt']).strftime('%b %d'),
                        "Temp (°C)": item['main']['temp'],
                        "Humidity (%)": item['main']['humidity'],
                        "Condition": item['weather'][0]['main']
                    })

                df = pd.DataFrame(daily_data)

                fig = px.bar(df, x="Date", y="Temp (°C)", color="Condition",
                             title="Temperature Outlook", text_auto=True)
                st.plotly_chart(fig, use_container_width=True)

                st.write("### Agricultural Tips based on Weather:")
                temp = data['main']['temp']
                hum = data['main']['humidity']

                if temp > 35:
                    st.warning("⚠️ High Temperature: Increase irrigation frequency and monitor for heat stress.")
                elif temp < 10:
                    st.info("❄️ Low Temperature: Protect sensitive crops from potential frost.")

                if hum > 80:
                    st.warning("💧 High Humidity: Increased risk of fungal diseases. Ensure proper ventilation.")

                if data['wind']['speed'] > 10:
                    st.warning("💨 High Wind: Avoid spraying pesticides or fertilizers.")
                else:
                    st.success("✅ Ideal conditions for field operations.")
        else:
            st.error("Could not fetch weather data. Please check the city name or backend connection.")

if __name__ == "__main__":
    show_weather()
