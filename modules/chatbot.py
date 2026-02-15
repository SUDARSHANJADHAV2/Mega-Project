import streamlit as st
import requests
import json

BACKEND_URL = "http://localhost:8000/api/chat"

def inject_custom_css():
    css_file = os.path.join(os.getcwd(), 'css', 'streamlit_style.css')
    if os.path.exists(css_file):
        with open(css_file) as f:
            st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

def show_chatbot():
    inject_custom_css()
    st.title("🤖 KrushiAI Chatbot")
    st.write("Ask me anything about farming, crops, or diseases!")

    if "messages" not in st.session_state:
        st.session_state.messages = []

    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    if prompt := st.chat_input("How can I help you today?"):
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        with st.chat_message("assistant"):
            message_placeholder = st.empty()
            full_response = ""

            try:
                # Prepare payload for backend
                payload = {
                    "model": "meta-llama/llama-3.2-3b-instruct:free",
                    "messages": [
                        {"role": "system", "content": "You are KrushiAI, a helpful agricultural assistant. Provide expert advice on farming, crop management, and pest control."}
                    ] + [
                        {"role": m["role"], "content": m["content"]}
                        for m in st.session_state.messages
                    ]
                }

                response = requests.post(BACKEND_URL, json=payload)

                if response.status_code == 200:
                    data = response.json()
                    # OpenRouter response structure
                    if "choices" in data and len(data["choices"]) > 0:
                        full_response = data["choices"][0]["message"]["content"]
                    else:
                        full_response = "I'm sorry, I received an empty response from the AI."
                else:
                    full_response = f"Error: Received status code {response.status_code} from backend."

            except Exception as e:
                full_response = f"Error connecting to chatbot service: {e}"

            message_placeholder.markdown(full_response)

        st.session_state.messages.append({"role": "assistant", "content": full_response})

if __name__ == "__main__":
    show_chatbot()
