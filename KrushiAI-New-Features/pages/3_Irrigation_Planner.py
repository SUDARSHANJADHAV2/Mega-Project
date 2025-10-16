import streamlit as st

# --- Data ---
CROP_WATER_NEEDS = {
    "Vegetables": {"base_mm_day": 4, "growth_factor": 1.2},
    "Fruits": {"base_mm_day": 5, "growth_factor": 1.1},
    "Grains": {"base_mm_day": 3, "growth_factor": 1.3},
}

SOIL_WATER_HOLDING = {
    "Sandy": {"capacity_mm": 100, "drainage_factor": 1.5},
    "Loamy": {"capacity_mm": 150, "drainage_factor": 1.0},
    "Clay": {"capacity_mm": 200, "drainage_factor": 0.7},
}

WEATHER_ET_FACTOR = {
    "Sunny": 1.2,
    "Cloudy": 0.8,
    "Rainy": 0.2,
    "Windy": 1.4,
}

# --- Helper Functions ---
def calculate_irrigation_schedule(crop_type, soil_type, weather, temp, growth_stage):
    """
    Calculates a more detailed irrigation schedule.
    """
    crop_data = CROP_WATER_NEEDS[crop_type]
    soil_data = SOIL_WATER_HOLDING[soil_type]
    weather_factor = WEATHER_ET_FACTOR[weather]

    # Calculate daily water need (Evapotranspiration)
    daily_water_need = crop_data["base_mm_day"] * crop_data["growth_factor"] * weather_factor * (1 + (temp - 25) / 100)

    # Adjust for soil type
    irrigation_amount_mm = daily_water_need * soil_data["drainage_factor"]

    # Recommendations
    if weather == "Rainy":
        return "No irrigation needed. Monitor for waterlogging.", "Monitor soil moisture.", "Check drainage systems."

    if irrigation_amount_mm < 2:
        schedule = "Water every 3-4 days."
    elif irrigation_amount_mm < 5:
        schedule = "Water every 2-3 days."
    else:
        schedule = "Daily watering recommended."

    tips = [
        f"Apply approximately {irrigation_amount_mm:.1f} mm of water per irrigation event.",
        "Water early in the morning or late in the evening to reduce evaporation.",
        "Consider using drip irrigation to maximize water efficiency."
    ]

    risk = "Low"
    if temp > 35 and weather == "Sunny":
        risk = "High risk of drought stress. Monitor crops closely."
    elif weather == "Windy":
        risk = "Increased evaporation. Check soil moisture frequently."

    return schedule, " ".join(tips), risk

# --- Main Application ---
def main():
    """
    Main function to display the irrigation planner.
    """
    st.title("Smart Irrigation Management System")
    st.write("Get optimized irrigation schedules based on weather data, crop type, and soil type.")

    st.subheader("Enter Farm Details")
    col1, col2 = st.columns(2)
    with col1:
        crop_type = st.selectbox("Select Crop Type:", list(CROP_WATER_NEEDS.keys()))
        soil_type = st.selectbox("Select Soil Type:", list(SOIL_WATER_HOLDING.keys()))
    with col2:
        weather = st.selectbox("Current Weather:", list(WEATHER_ET_FACTOR.keys()))
        temp = st.slider("Current Temperature (°C):", 10, 50, 25)

    growth_stage = st.select_slider("Select Crop Growth Stage:", options=['Seedling', 'Vegetative', 'Flowering', 'Fruiting'], value='Vegetative')

    if st.button("Get Irrigation Plan"):
        schedule, tips, risk = calculate_irrigation_schedule(crop_type, soil_type, weather, temp, growth_stage)

        st.subheader("Your Optimized Irrigation Plan")
        st.success(f"**Recommended Schedule:** {schedule}")

        st.subheader("Water Conservation Tips")
        st.info(tips)

        st.subheader("Drought Risk Assessment")
        st.warning(f"**Risk Level:** {risk}")

if __name__ == "__main__":
    main()