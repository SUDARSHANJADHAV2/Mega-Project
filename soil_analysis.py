"""
KrushiAI Soil Health Analysis Module
Provides detailed soil diagnostics based on NPK levels, pH, and organic carbon.
Gives actionable recommendations for soil improvement.
"""

import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import logging

logger = logging.getLogger(__name__)

# Optimal ranges for soil nutrients (Indian agricultural standards)
OPTIMAL_RANGES = {
    "Nitrogen (N)": {"low": 30, "optimal_min": 50, "optimal_max": 100, "high": 140, "unit": "mg/kg"},
    "Phosphorus (P)": {"low": 10, "optimal_min": 25, "optimal_max": 75, "high": 145, "unit": "mg/kg"},
    "Potassium (K)": {"low": 20, "optimal_min": 40, "optimal_max": 100, "high": 205, "unit": "mg/kg"},
    "pH": {"low": 5.5, "optimal_min": 6.0, "optimal_max": 7.5, "high": 8.5, "unit": ""},
    "Organic Carbon": {"low": 0.3, "optimal_min": 0.5, "optimal_max": 1.5, "high": 3.0, "unit": "%"},
}

# Recommendations based on nutrient levels
RECOMMENDATIONS = {
    "Nitrogen (N)": {
        "low": [
            "Apply nitrogen-rich fertilizers like Urea or Ammonium Sulphate",
            "Grow nitrogen-fixing cover crops (legumes, clover, alfalfa)",
            "Add well-decomposed farmyard manure or compost",
            "Consider green manuring with Dhaincha or Sesbania",
        ],
        "optimal": [
            "Maintain current nitrogen management practices",
            "Use split application for better nutrient use efficiency",
            "Monitor crop-specific nitrogen requirements",
        ],
        "high": [
            "Reduce nitrogen fertilizer application immediately",
            "Excess nitrogen can cause lodging in cereals and environmental pollution",
            "Grow high nitrogen-demanding crops to utilize excess nitrogen",
            "Avoid waterlogging to prevent nitrogen leaching",
        ],
    },
    "Phosphorus (P)": {
        "low": [
            "Apply DAP (Di-Ammonium Phosphate) or Single Super Phosphate",
            "Add bone meal or rock phosphate as organic alternatives",
            "Ensure soil pH is between 6.0-7.0 for optimal phosphorus availability",
            "Inoculate seeds with Phosphate Solubilizing Bacteria (PSB)",
        ],
        "optimal": [
            "Maintain with moderate phosphorus application",
            "Use phosphorus-efficient crop varieties",
        ],
        "high": [
            "Reduce phosphorus fertilizer application",
            "Excess phosphorus can block micronutrient uptake (zinc, iron)",
            "Use only nitrogen and potassium-based fertilizers",
        ],
    },
    "Potassium (K)": {
        "low": [
            "Apply Muriate of Potash (MOP) or Sulphate of Potash (SOP)",
            "Add wood ash as an organic potassium source",
            "Potassium deficiency causes weak stalks and poor disease resistance",
            "Apply potassium in 2 split doses for better results",
        ],
        "optimal": [
            "Maintain current potassium management",
            "Balance K application with N and P for nutrient synergy",
        ],
        "high": [
            "No additional potassium fertilizer needed",
            "Excess K can interfere with calcium and magnesium uptake",
            "Monitor for secondary nutrient deficiencies",
        ],
    },
    "pH": {
        "low": [
            "Soil is acidic — apply agricultural lime (calcium carbonate) at 2-5 tonnes/hectare",
            "Use dolomite lime if magnesium is also deficient",
            "Avoid ammonium-based fertilizers which increase acidity",
            "Grow acid-tolerant crops: rice, tea, potato, blueberry",
        ],
        "optimal": [
            "Soil pH is in optimal range for most crops",
            "Continue regular monitoring — pH can shift seasonally",
        ],
        "high": [
            "Soil is alkaline — apply gypsum (calcium sulphate) at 2-5 tonnes/hectare",
            "Use sulphur or elemental sulphur to reduce pH",
            "Grow alkali-tolerant crops: barley, sugarbeet, cotton",
            "Add organic matter to help buffer pH",
        ],
    },
    "Organic Carbon": {
        "low": [
            "Add compost, farmyard manure, or vermicompost (5-10 tonnes/hectare)",
            "Practice green manuring and crop residue incorporation",
            "Reduce tillage — adopt minimum or zero tillage practices",
            "Low organic carbon means poor water retention and microbial activity",
        ],
        "optimal": [
            "Good organic matter content — maintain with regular organic inputs",
            "Practice crop rotation to sustain soil biology",
        ],
        "high": [
            "Excellent organic matter content — no intervention needed",
            "This soil has great water retention and microbial activity",
        ],
    },
}


def classify_level(value: float, ranges: dict) -> str:
    """Classify a nutrient value as Low, Optimal, or High."""
    if value < ranges["optimal_min"]:
        return "low"
    elif value <= ranges["optimal_max"]:
        return "optimal"
    else:
        return "high"


def create_gauge_chart(value: float, name: str, ranges: dict) -> go.Figure:
    """Create a simple gauge chart for a nutrient value."""
    level = classify_level(value, ranges)
    color_map = {"low": "#FF6B6B", "optimal": "#51CF66", "high": "#FCC419"}
    
    fig = go.Figure(go.Indicator(
        mode="gauge+number",
        value=value,
        title={"text": name, "font": {"size": 16}},
        gauge={
            "axis": {"range": [0, ranges["high"] * 1.2]},
            "bar": {"color": color_map[level]},
            "steps": [
                {"range": [0, ranges["optimal_min"]], "color": "#FFF3BF"},
                {"range": [ranges["optimal_min"], ranges["optimal_max"]], "color": "#D3F9D8"},
                {"range": [ranges["optimal_max"], ranges["high"] * 1.2], "color": "#FFE0E0"},
            ],
            "threshold": {
                "line": {"color": "black", "width": 2},
                "thickness": 0.75,
                "value": value,
            },
        },
    ))
    fig.update_layout(height=250, margin=dict(t=50, b=10, l=20, r=20))
    return fig


def show_soil_analysis():
    """Display the soil health analysis interface."""
    st.title("🧪 Soil Health Analysis")
    st.write("Get a detailed diagnostic of your soil health with actionable recommendations.")

    col1, col2, col3 = st.columns(3)
    with col1:
        n = st.number_input(
            "Nitrogen (N) - mg/kg", min_value=0, max_value=200, value=50,
            key="soil_n",
        )
    with col2:
        p = st.number_input(
            "Phosphorus (P) - mg/kg", min_value=0, max_value=200, value=50,
            key="soil_p",
        )
    with col3:
        k = st.number_input(
            "Potassium (K) - mg/kg", min_value=0, max_value=250, value=50,
            key="soil_k",
        )

    col4, col5 = st.columns(2)
    with col4:
        ph = st.slider("pH Level", 3.0, 10.0, 6.5, 0.1, key="soil_ph")
    with col5:
        oc = st.slider("Organic Carbon (%)", 0.0, 4.0, 0.8, 0.1, key="soil_oc")

    if st.button("🔬 Analyze Soil Health", use_container_width=True, key="soil_analyze_btn"):
        st.markdown("---")
        st.markdown("## 📊 Soil Health Report")

        # Collect values
        inputs = {
            "Nitrogen (N)": n,
            "Phosphorus (P)": p,
            "Potassium (K)": k,
            "pH": ph,
            "Organic Carbon": oc,
        }

        # Summary table
        summary_data = []
        for name, value in inputs.items():
            ranges = OPTIMAL_RANGES[name]
            level = classify_level(value, ranges)
            emoji = {"low": "🔴", "optimal": "🟢", "high": "🟡"}[level]
            summary_data.append({
                "Parameter": name,
                "Value": f"{value} {ranges['unit']}",
                "Status": f"{emoji} {level.upper()}",
                "Optimal Range": f"{ranges['optimal_min']}–{ranges['optimal_max']} {ranges['unit']}",
            })

        df = pd.DataFrame(summary_data)
        st.dataframe(df, hide_index=True, use_container_width=True)

        # Overall soil health score (simple weighted average)
        scores = []
        for name, value in inputs.items():
            ranges = OPTIMAL_RANGES[name]
            level = classify_level(value, ranges)
            if level == "optimal":
                scores.append(1.0)
            elif level == "low":
                score = max(0, value / ranges["optimal_min"])
                scores.append(score)
            else:
                score = max(0, 1 - (value - ranges["optimal_max"]) / (ranges["high"] - ranges["optimal_max"]))
                scores.append(score)

        overall_score = int(sum(scores) / len(scores) * 100)

        # Score display
        st.markdown(f"### Overall Soil Health Score: **{overall_score}/100**")
        if overall_score >= 75:
            st.success("🟢 **Excellent** — Your soil is in great condition for farming!")
        elif overall_score >= 50:
            st.info("🟡 **Moderate** — Some improvements recommended for optimal yield.")
        else:
            st.warning("🔴 **Needs Attention** — Significant soil amendments needed.")

        # Gauge charts
        st.markdown("### 📈 Nutrient Levels Visualization")
        gauge_cols = st.columns(3)
        for i, (name, value) in enumerate(list(inputs.items())[:3]):
            with gauge_cols[i]:
                fig = create_gauge_chart(value, name, OPTIMAL_RANGES[name])
                st.plotly_chart(fig, use_container_width=True)

        ph_col, oc_col = st.columns(2)
        with ph_col:
            fig = create_gauge_chart(ph, "pH", OPTIMAL_RANGES["pH"])
            st.plotly_chart(fig, use_container_width=True)
        with oc_col:
            fig = create_gauge_chart(oc, "Organic Carbon", OPTIMAL_RANGES["Organic Carbon"])
            st.plotly_chart(fig, use_container_width=True)

        # Detailed recommendations
        st.markdown("### 💡 Recommendations")
        for name, value in inputs.items():
            ranges = OPTIMAL_RANGES[name]
            level = classify_level(value, ranges)
            recs = RECOMMENDATIONS[name][level]

            with st.expander(f"{name}: {level.upper()}", expanded=(level != "optimal")):
                for rec in recs:
                    st.markdown(f"- {rec}")
