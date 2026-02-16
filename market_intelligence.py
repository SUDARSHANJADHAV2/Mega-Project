"""
KrushiAI Market Intelligence Module  
Provides crop price tracking, market trends, and price analytics.
Uses simulated data (can be replaced with live API data in production).
"""

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import numpy as np
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

# Base prices per quintal (INR) - based on Indian MSP 2024-25
CROP_BASE_PRICES = {
    "Rice": {"msp": 2300, "market_avg": 2450, "volatility": 0.05},
    "Wheat": {"msp": 2275, "market_avg": 2400, "volatility": 0.04},
    "Maize": {"msp": 2090, "market_avg": 2200, "volatility": 0.07},
    "Cotton": {"msp": 7020, "market_avg": 7200, "volatility": 0.08},
    "Jute": {"msp": 5050, "market_avg": 5300, "volatility": 0.06},
    "Sugarcane": {"msp": 315, "market_avg": 340, "volatility": 0.03},
    "Soybean": {"msp": 4892, "market_avg": 5100, "volatility": 0.09},
    "Groundnut": {"msp": 6377, "market_avg": 6500, "volatility": 0.07},
    "Mustard": {"msp": 5650, "market_avg": 5800, "volatility": 0.06},
    "Chickpea": {"msp": 5440, "market_avg": 5600, "volatility": 0.05},
}


def generate_price_data(crop: str, days: int = 90) -> pd.DataFrame:
    """Generate realistic simulated price data for a crop."""
    np.random.seed(hash(crop) % (2**31))  # Deterministic per crop
    info = CROP_BASE_PRICES[crop]
    base = info["market_avg"]
    vol = info["volatility"]

    dates = [datetime.now() - timedelta(days=x) for x in range(days, 0, -1)]
    
    # Random walk with mean reversion
    prices = [base]
    for i in range(1, len(dates)):
        change = np.random.normal(0, base * vol * 0.1)
        mean_revert = (base - prices[-1]) * 0.05
        prices.append(max(base * 0.7, prices[-1] + change + mean_revert))

    df = pd.DataFrame({"Date": dates, "Price (₹/quintal)": prices})
    df["Date"] = pd.to_datetime(df["Date"])
    return df


def show_market_intelligence():
    """Display the market intelligence dashboard."""
    st.title("📈 Market Intelligence")
    st.write("Track commodity prices, analyze trends, and make informed selling decisions.")

    # Overview metrics
    st.markdown("### 🌾 Current MSP Overview (2024-25)")
    cols = st.columns(5)
    for i, (crop, info) in enumerate(list(CROP_BASE_PRICES.items())[:5]):
        with cols[i]:
            delta = info["market_avg"] - info["msp"]
            st.metric(
                crop,
                f"₹{info['market_avg']:,}",
                f"+₹{delta}" if delta >= 0 else f"₹{delta}",
                help=f"MSP: ₹{info['msp']:,}/quintal",
            )

    st.markdown("---")

    # Crop selection and price trends
    col1, col2 = st.columns([1, 3])
    with col1:
        selected_crop = st.selectbox(
            "Select Crop",
            list(CROP_BASE_PRICES.keys()),
            key="market_crop",
        )
        period = st.radio(
            "Time Period",
            ["30 Days", "60 Days", "90 Days"],
            index=0,
            key="market_period",
        )
        days = {"30 Days": 30, "60 Days": 60, "90 Days": 90}[period]

    # Generate price data
    df = generate_price_data(selected_crop, days)

    with col2:
        st.markdown(f"### {selected_crop} Price Trend ({period})")
        
        # Create candlestick-style chart
        fig = go.Figure()
        fig.add_trace(go.Scatter(
            x=df["Date"],
            y=df["Price (₹/quintal)"],
            mode="lines",
            name="Market Price",
            line=dict(color="#2d5a27", width=2),
            fill="tozeroy",
            fillcolor="rgba(45, 90, 39, 0.1)",
        ))

        # Add MSP line
        msp = CROP_BASE_PRICES[selected_crop]["msp"]
        fig.add_hline(
            y=msp, line_dash="dash", line_color="red",
            annotation_text=f"MSP: ₹{msp:,}",
            annotation_position="top right",
        )

        fig.update_layout(
            xaxis_title="Date",
            yaxis_title="Price (₹/quintal)",
            height=400,
            margin=dict(t=20, b=40),
            hovermode="x unified",
        )
        st.plotly_chart(fig, use_container_width=True)

    # Price analytics
    st.markdown("### 📊 Price Analytics")
    acol1, acol2, acol3, acol4 = st.columns(4)

    current_price = df["Price (₹/quintal)"].iloc[-1]
    avg_price = df["Price (₹/quintal)"].mean()
    min_price = df["Price (₹/quintal)"].min()
    max_price = df["Price (₹/quintal)"].max()

    with acol1:
        st.metric("Current Price", f"₹{current_price:,.0f}")
    with acol2:
        st.metric("Average", f"₹{avg_price:,.0f}")
    with acol3:
        st.metric("Low", f"₹{min_price:,.0f}")
    with acol4:
        st.metric("High", f"₹{max_price:,.0f}")

    # Selling recommendation
    st.markdown("---")
    st.markdown("### 💡 Selling Recommendation")
    if current_price > msp * 1.1:
        st.success(
            f"🟢 **Good time to sell!** Market price (₹{current_price:,.0f}) "
            f"is {((current_price/msp - 1)*100):.1f}% above MSP."
        )
    elif current_price > msp:
        st.info(
            f"🟡 **Hold if possible.** Market price (₹{current_price:,.0f}) "
            f"is slightly above MSP. Wait for better rates."
        )
    else:
        st.warning(
            f"🔴 **Sell at MSP.** Market price (₹{current_price:,.0f}) "
            f"is below MSP (₹{msp:,}). Consider government procurement."
        )

    # Revenue calculator
    st.markdown("### 🧮 Revenue Estimator")
    rcol1, rcol2 = st.columns(2)
    with rcol1:
        quantity = st.number_input(
            "Expected Yield (quintals)",
            min_value=1.0, max_value=10000.0, value=50.0, step=5.0,
            key="market_qty",
        )
    with rcol2:
        sell_price = st.number_input(
            "Expected Selling Price (₹/quintal)",
            min_value=float(min_price * 0.8),
            max_value=float(max_price * 1.5),
            value=float(current_price),
            step=50.0,
            key="market_sell_price",
        )

    est_revenue = quantity * sell_price
    msp_revenue = quantity * msp
    st.metric(
        "Estimated Revenue",
        f"₹{est_revenue:,.0f}",
        f"₹{est_revenue - msp_revenue:+,.0f} vs MSP Revenue",
    )
