import streamlit as st
import tensorflow as tf
import numpy as np
from PIL import Image
import os

# Path to model
MODEL_PATH = os.path.join(os.getcwd(), 'KrushiAI-Disease-Recognition', 'trained_plant_disease_model.keras')

@st.cache_resource
def load_disease_model():
    return tf.keras.models.load_model(MODEL_PATH)

def inject_custom_css():
    css_file = os.path.join(os.getcwd(), 'css', 'streamlit_style.css')
    if os.path.exists(css_file):
        with open(css_file) as f:
            st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

def model_prediction(test_image):
    model = load_disease_model()
    image = Image.open(test_image)
    image = image.resize((128, 128))
    input_arr = tf.keras.preprocessing.image.img_to_array(image)
    input_arr = np.array([input_arr])  # convert single image to batch
    predictions = model.predict(input_arr)
    return np.argmax(predictions) # return index of max prediction

def show_disease_detection():
    inject_custom_css()
    st.title("🌿 Plant Disease Detection")
    st.write("Identify plant diseases from leaf images.")

    test_image = st.file_uploader("Choose an image:", type=["jpg", "jpeg", "png"])

    if test_image is not None:
        st.image(test_image, width=300, caption="Uploaded Image")
        if st.button("Predict"):
            st.snow()
            st.write("Our Prediction")
            result_index = model_prediction(test_image)

            # Reading Labels
            class_name = ['Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
                        'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew',
                        'Cherry_(including_sour)___healthy', 'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
                        'Corn_(maize)___Common_rust_', 'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy',
                        'Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
                        'Grape___healthy', 'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot',
                        'Peach___healthy', 'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy',
                        'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy',
                        'Raspberry___healthy', 'Soybean___healthy', 'Squash___Powdery_mildew',
                        'Strawberry___Leaf_scorch', 'Strawberry___healthy', 'Tomato___Bacterial_spot',
                        'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold',
                        'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite',
                        'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus',
                        'Tomato___healthy']
            st.success(f"Model is Predicting it's a **{class_name[result_index]}**")
