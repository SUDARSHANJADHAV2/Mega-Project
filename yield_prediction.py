"""
KrushiAI Yield Prediction Module
Estimates crop yield based on crop type, area, region, and farming conditions.
Uses agronomic reference data for realistic predictions.
"""

import streamlit as st
import plotly.graph_objects as go
import numpy as np
import logging

logger = logging.getLogger(__name__)

# Yield data per acre (tonnes) based on Indian agricultural statistics
YIELD_DATABASE = {
    "Rice": {
        "base_yield": 2.5,
        "range": (1.5, 4.5),
        "season": "Kharif (June-October)",
        "water_need": "High",
        "region_factor": {"Humid": 1.2, "Semi-Arid": 0.85, "Arid": 0.5, "Coastal": 1.1},
        "irrigation_boost": 1.25,
    },
    "Wheat": {
        "base_yield": 2.0,
        "range": (1.2, 3.5),
        "season": "Rabi (November-March)",
        "water_need": "Moderate",
        "region_factor": {"Humid": 0.9, "Semi-Arid": 1.1, "Arid": 0.7, "Coastal": 0.8},
        "irrigation_boost": 1.3,
    },
    "Maize": {
        "base_yield": 3.0,
        "range": (1.8, 5.0),
        "season": "Kharif / Rabi",
        "water_need": "Moderate",
        "region_factor": {"Humid": 1.1, "Semi-Arid": 1.0, "Arid": 0.65, "Coastal": 0.9},
        "irrigation_boost": 1.2,
    },
    "Sugarcane": {
        "base_yield": 30.0,
        "range": (20.0, 50.0),
        "season": "Annual (12 months)",
        "water_need": "Very High",
        "region_factor": {"Humid": 1.15, "Semi-Arid": 0.85, "Arid": 0.5, "Coastal": 1.0},
        "irrigation_boost": 1.35,
    },
    "Cotton": {
        "base_yield": 1.8,
        "range": (0.8, 3.5),
        "season": "Kharif (June-November)",
        "water_need": "Moderate",
        "region_factor": {"Humid": 0.85, "Semi-Arid": 1.1, "Arid": 0.7, "Coastal": 0.8},
        "irrigation_boost": 1.2,
    },
    "Soybean": {
        "base_yield": 1.5,
        "range": (0.8, 2.8),
        "season": "Kharif (June-October)",
        "water_need": "Low-Moderate",
        "region_factor": {"Humid": 1.0, "Semi-Arid": 1.1, "Arid": 0.6, "Coastal": 0.9},
        "irrigation_boost": 1.15,
    },
    "Groundnut": {
        "base_yield": 1.2,
        "range": (0.6, 2.5),
        "season": "Kharif / Rabi",
        "water_need": "Low",
        "region_factor": {"Humid": 0.9, "Semi-Arid": 1.1, "Arid": 0.75, "Coastal": 1.0},
        "irrigation_boost": 1.2,
    },
    "Mustard": {
        "base_yield": 1.0,
        "range": (0.5, 2.0),
        "season": "Rabi (October-March)",
        "water_need": "Low",
        "region_factor": {"Humid": 0.8, "Semi-Arid": 1.15, "Arid": 0.7, "Coastal": 0.75},
        "irrigation_boost": 1.2,
    },
}


def estimate_yield(crop: str, area: float, region: str,
                   irrigation: bool, soil_quality: str) -> dict:
    """
    Estimate crop yield with confidence intervals.
    
    Returns:
        Dictionary with estimated yield, revenue info, and confidence range.
    """
    info = YIELD_DATABASE[crop]
    base = info["base_yield"]
    
    # Apply region factor
    region_factor = info["region_factor"].get(region, 1.0)
    
    # Apply irrigation bonus
    irrig_factor = info["irrigation_boost"] if irrigation else 1.0
    
    # Soil quality factor
    soil_factors = {"Poor": 0.7, "Average": 0.9, "Good": 1.0, "Excellent": 1.15}
    soil_factor = soil_factors.get(soil_quality, 1.0)
    
    # Calculate estimated yield
    estimated_yield = base * region_factor * irrig_factor * soil_factor
    total_yield = estimated_yield * area
    
    # Confidence interval (±15%)
    low = total_yield * 0.85
    high = total_yield * 1.15
    
    return {
        "yield_per_acre": estimated_yield,
        "total_yield": total_yield,
        "low_estimate": low,
        "high_estimate": high,
        "unit": "tonnes",
        "season": info["season"],
        "water_need": info["water_need"],
        "factors": {
            "Base Yield": f"{base} t/acre",
            "Region Factor": f"{region_factor:.2f}x",
            "Irrigation Factor": f"{irrig_factor:.2f}x",
            "Soil Factor": f"{soil_factor:.2f}x",
        },
    }


def show_yield_prediction():
    """Display the yield prediction interface."""
    st.title("🌾 Crop Yield Prediction")
    st.write("Estimate your crop production based on area, climate, and farming conditions.")

    col1, col2 = st.columns(2)

    with col1:
        crop = st.selectbox(
            "Crop", list(YIELD_DATABASE.keys()),
            key="yield_crop",
        )
        area = st.number_input(
            "Land Area (Acres)",
            min_value=0.5, max_value=5000.0, value=5.0, step=0.5,
            key="yield_area",
        )
        region = st.selectbox(
            "Region Type",
            ["Humid", "Semi-Arid", "Arid", "Coastal"],
            key="yield_region",
        )

    with col2:
        irrigation = st.checkbox(
            "Irrigated Land",
            value=True,
            help="Check if the land has irrigation facilities",
            key="yield_irrigation",
        )
        soil_quality = st.select_slider(
            "Soil Quality",
            options=["Poor", "Average", "Good", "Excellent"],
            value="Good",
            key="yield_soil",
        )

    # Show crop info
    info = YIELD_DATABASE[crop]
    st.info(
        f"**{crop}** — Growing Season: {info['season']} | "
        f"Water Requirement: {info['water_need']} | "
        f"Typical Yield: {info['range'][0]}-{info['range'][1]} t/acre"
    )

    if st.button("🌾 Predict Yield", use_container_width=True, key="yield_predict_btn"):
        result = estimate_yield(crop, area, region, irrigation, soil_quality)
        
        st.markdown("---")
        st.markdown("## 📊 Yield Prediction Results")

        # Main metrics
        mcol1, mcol2, mcol3 = st.columns(3)
        with mcol1:
            st.metric(
                "Estimated Total Yield",
                f"{result['total_yield']:.1f} {result['unit']}",
            )
        with mcol2:
            st.metric(
                "Yield Per Acre",
                f"{result['yield_per_acre']:.2f} {result['unit']}/acre",
            )
        with mcol3:
            st.metric(
                "Confidence Range",
                f"{result['low_estimate']:.1f} - {result['high_estimate']:.1f} {result['unit']}",
            )

        # Factors breakdown
        st.markdown("### 🧮 Calculation Factors")
        for factor, value in result["factors"].items():
            st.markdown(f"- **{factor}:** {value}")

        # Visualization: Comparison with different scenarios
        st.markdown("### 📊 Scenario Comparison")
        scenarios = {
            "No Irrigation + Poor Soil": estimate_yield(crop, area, region, False, "Poor")["total_yield"],
            "No Irrigation + Good Soil": estimate_yield(crop, area, region, False, "Good")["total_yield"],
            "Irrigation + Average Soil": estimate_yield(crop, area, region, True, "Average")["total_yield"],
            "Irrigation + Good Soil": estimate_yield(crop, area, region, True, "Good")["total_yield"],
            "Irrigation + Excellent Soil": estimate_yield(crop, area, region, True, "Excellent")["total_yield"],
        }

        fig = go.Figure(go.Bar(
            x=list(scenarios.keys()),
            y=list(scenarios.values()),
            marker_color=["#FF6B6B", "#FCC419", "#74B9FF", "#51CF66", "#2d5a27"],
            text=[f"{v:.1f}t" for v in scenarios.values()],
            textposition="auto",
        ))
        fig.update_layout(
            yaxis_title=f"Total Yield ({result['unit']})",
            height=350,
            margin=dict(t=20, b=40),
        )
        st.plotly_chart(fig, use_container_width=True)

        # Revenue estimation
        st.markdown("### 💰 Revenue Estimation")
        price = st.number_input(
            f"Expected {crop} Price (₹/quintal)",
            min_value=500.0, max_value=50000.0, value=2500.0, step=100.0,
            key="yield_price",
        )
        # Convert tonnes to quintals (1 tonne = 10 quintals)
        total_quintals = result["total_yield"] * 10
        revenue = total_quintals * price
        st.metric("Estimated Revenue", f"₹{revenue:,.0f}")
        st.caption(f"Based on {total_quintals:.1f} quintals × ₹{price:,.0f}/quintal")
