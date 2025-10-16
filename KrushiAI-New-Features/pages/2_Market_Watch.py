import streamlit as st
import pandas as pd
import plotly.express as px

# --- Helper Functions ---
@st.cache_data
def load_data():
    """
    Loads market data from the CSV file. In a real application, this would be an API call.
    """
    df = pd.read_csv("market_data.csv")
    df["date"] = pd.to_datetime(df["date"])
    return df

def display_price_trends(df):
    """
    Displays an interactive chart of price trends.
    """
    st.subheader("Price Trends Over Time")
    crop = st.selectbox("Select a crop to view its price trend:", df["crop"].unique())

    fig = px.line(
        df[df["crop"] == crop],
        x="date",
        y="price",
        title=f"{crop} Price Trend",
        labels={"date": "Date", "price": "Price (INR per Quintal)"}
    )
    st.plotly_chart(fig, use_container_width=True)

def display_current_prices(df):
    """
    Displays the most recent market prices.
    """
    st.subheader("Current Market Prices")
    latest_date = df["date"].max()
    st.write(f"Prices as of {latest_date.strftime('%B %d, %Y')}")

    current_prices = df[df["date"] == latest_date].set_index("crop")
    st.dataframe(current_prices[['price']])

def calculate_profit_margin(df):
    """
    Adds a profit margin calculator.
    """
    st.subheader("Profit Margin Calculator")

    latest_prices = df[df["date"] == df["date"].max()].set_index("crop")

    crop = st.selectbox("Select a crop for profit calculation:", latest_prices.index)

    col1, col2 = st.columns(2)
    with col1:
        cost_of_production = st.number_input("Enter your cost of production per quintal (INR):", min_value=0.0, value=150.0, step=10.0)
    with col2:
        yield_per_acre = st.number_input("Enter your yield per acre (in quintals):", min_value=0.0, value=10.0, step=1.0)

    if st.button("Calculate Profit"):
        market_price = latest_prices.loc[crop, "price"]

        profit_per_quintal = market_price - cost_of_production
        total_profit = profit_per_quintal * yield_per_acre

        st.success(f"**Estimated Profit for {crop}:**")
        st.metric(label="Market Price per Quintal", value=f"₹{market_price:,.2f}")
        st.metric(label="Profit per Quintal", value=f"₹{profit_per_quintal:,.2f}")
        st.metric(label="Total Profit per Acre", value=f"₹{total_profit:,.2f}")


# --- Main Application ---
def main():
    """
    Main function to display the market watch page.
    """
    st.title("Market Price Intelligence")
    st.write("View current market prices for various crops and analyze price trends.")

    df = load_data()

    display_current_prices(df)
    st.markdown("---")
    display_price_trends(df)
    st.markdown("---")
    calculate_profit_margin(df)

if __name__ == "__main__":
    main()