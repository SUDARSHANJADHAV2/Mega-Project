import streamlit as st
import requests
from datetime import datetime
from geopy.geocoders import Nominatim

# --- Constants ---
API_KEY = st.secrets.get("OPENWEATHERMAP_API_KEY", "YOUR_API_KEY") # Replace with your OpenWeatherMap API key or set it as a secret
BASE_URL = "https://api.openweathermap.org/data/2.5/onecall"
GEO_APP_NAME = "krushiai_weather_app"

# --- Helper Functions ---
@st.cache_data
def get_coordinates(city):
    """
    Converts city name to latitude and longitude.
    """
    try:
        geolocator = Nominatim(user_agent=GEO_APP_NAME)
        location = geolocator.geocode(city)
        if location:
            return location.latitude, location.longitude
    except Exception as e:
        st.error(f"Could not get coordinates for {city}. Please check the city name or your internet connection.")
        return None, None
    return None, None

@st.cache_data
def get_weather_data(lat, lon):
    """
    Fetches weather data from the OpenWeatherMap One Call API.
    """
    if not lat or not lon:
        return None
    url = f"{BASE_URL}?lat={lat}&lon={lon}&exclude=minutely,hourly,alerts&appid={API_KEY}&units=metric"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        st.error(f"Error fetching weather data: {response.json().get('message', 'Unknown error')}")
        return None

def display_current_weather(data):
    """
    Displays the current weather conditions.
    """
    st.subheader("Current Weather")
    current = data['current']
    col1, col2, col3 = st.columns(3)
    col1.metric("Temperature", f"{current['temp']} °C")
    col2.metric("Humidity", f"{current['humidity']}%")
    col3.metric("Wind Speed", f"{current['wind_speed']} m/s")
    st.write(f"**Description:** {current['weather'][0]['description'].title()}")
    st.write(f"**UV Index:** {current.get('uvi', 'N/A')}")


def display_forecast(data):
    """
    Displays the 7-day weather forecast.
    """
    st.subheader("7-Day Forecast")
    daily_forecasts = data['daily']

    for day in daily_forecasts[:7]:
        date = datetime.fromtimestamp(day["dt"]).strftime('%A, %b %d')
        icon = f"http://openweathermap.org/img/wn/{day['weather'][0]['icon']}.png"

        col1, col2, col3 = st.columns([1,2,2])
        with col1:
            st.image(icon, width=40)
        with col2:
            st.write(f"**{date}**")
        with col3:
            st.write(f"{day['temp']['day']:.1f}°C / {day['temp']['night']:.1f}°C - {day['weather'][0]['description'].title()}")


def display_crop_calendar(forecast_data):
    """
    Displays a dynamic crop calendar with planting and harvesting info based on weather.
    """
    st.subheader("Crop Calendar & Planting Advice")

    if not forecast_data or 'daily' not in forecast_data:
        st.info("Weather data not available for crop advice.")
        return

    # Simplified crop data for demonstration
    crop_data = {
        "Wheat": {"plant_months": [10, 11], "harvest_months": [3, 4], "temp_range": (10, 25)},
        "Rice": {"plant_months": [6, 7], "harvest_months": [10, 11], "temp_range": (20, 37)},
        "Maize": {"plant_months": [6, 7], "harvest_months": [9, 10], "temp_range": (21, 27)},
        "Cotton": {"plant_months": [4, 5], "harvest_months": [10, 11], "temp_range": (21, 30)},
    }

    current_month = datetime.now().month
    avg_temp_next_week = sum(day['temp']['day'] for day in forecast_data['daily']) / len(forecast_data['daily'])
    rain_chance_next_week = any(day.get('rain', 0) > 1 for day in forecast_data['daily'])

    st.write(f"#### Recommendations for {datetime.now().strftime('%B')}")
    st.write(f"Average temperature for the next 7 days: **{avg_temp_next_week:.1f}°C**")
    if rain_chance_next_week:
        st.write("There is a chance of rain in the next 7 days.")
    else:
        st.write("No significant rain expected in the next 7 days.")

    for crop, details in crop_data.items():
        advice = []
        # Planting advice
        if current_month in details["plant_months"]:
            if details["temp_range"][0] <= avg_temp_next_week <= details["temp_range"][1]:
                advice.append("Good time for planting. Favorable temperatures ahead.")
                if not rain_chance_next_week:
                    advice.append("Ensure adequate irrigation as no rain is forecasted.")
            else:
                advice.append("Planting season, but upcoming temperatures are not ideal.")

        # Harvesting advice
        if current_month in details["harvest_months"]:
            advice.append("It's harvesting season.")
            if rain_chance_next_week:
                advice.append("Be cautious of rain, plan harvesting accordingly.")

        if advice:
            st.success(f"**{crop}:** {' '.join(advice)}")
        else:
            st.info(f"**{crop}:** Not the ideal time for planting or harvesting.")


# --- Main Application ---
def main():
    """
    Main function to display the weather dashboard.
    """
    st.title("Weather Dashboard & Crop Calendar")
    st.write("Fetching real-time weather data and 7-day forecasts to help you plan your farming activities.")

    if API_KEY == "YOUR_API_KEY":
        st.warning("Please add your OpenWeatherMap API key to the script or as a Streamlit secret to use this feature.")

    city = st.text_input("Enter your city name:", "London")

    if st.button("Get Weather"):
        lat, lon = get_coordinates(city)
        if lat and lon:
            weather_data = get_weather_data(lat, lon)
            if weather_data:
                st.subheader(f"Weather for {city.title()}")
                display_current_weather(weather_data)
                st.markdown("---")
                display_forecast(weather_data)
                st.markdown("---")
                display_crop_calendar(weather_data)

if __name__ == "__main__":
    main()