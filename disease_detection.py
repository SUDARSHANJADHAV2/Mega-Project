"""
KrushiAI Disease Detection Module (Lightweight Wrapper)
Provides plant disease detection integration for the unified hub.
Uses TensorFlow/Keras CNN model for leaf image classification.
"""

import streamlit as st
import numpy as np
from PIL import Image
import os
import logging

logger = logging.getLogger(__name__)

# Path to model
MODEL_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "KrushiAI-Disease-Recognition",
    "trained_plant_disease_model.keras",
)

# Disease class labels (38 classes)
CLASS_NAMES = [
    "Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust",
    "Apple___healthy", "Blueberry___healthy",
    "Cherry_(including_sour)___Powdery_mildew", "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn_(maize)___Common_rust_", "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy", "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)", "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape___healthy", "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot", "Peach___healthy",
    "Pepper,_bell___Bacterial_spot", "Pepper,_bell___healthy",
    "Potato___Early_blight", "Potato___Late_blight", "Potato___healthy",
    "Raspberry___healthy", "Soybean___healthy", "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch", "Strawberry___healthy",
    "Tomato___Bacterial_spot", "Tomato___Early_blight", "Tomato___Late_blight",
    "Tomato___Leaf_Mold", "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot", "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus", "Tomato___healthy",
]


@st.cache_resource
def load_disease_model():
    """Load the disease detection CNN model with caching."""
    try:
        import tensorflow as tf
        if not os.path.exists(MODEL_PATH):
            logger.error(f"Model file not found: {MODEL_PATH}")
            return None
        model = tf.keras.models.load_model(MODEL_PATH)
        logger.info("Disease detection model loaded successfully")
        return model
    except Exception as e:
        logger.error(f"Error loading disease model: {e}")
        return None


def format_disease_name(disease_key: str) -> str:
    """Format raw disease key into a readable name."""
    formatted = disease_key.replace("___", " - ").replace("_", " ")
    return formatted.title()


def model_prediction(model, test_image) -> tuple:
    """
    Run disease prediction on an uploaded image.
    
    Returns:
        Tuple of (class_index, confidence_percentage, disease_name)
    """
    image = Image.open(test_image)
    if image.mode != "RGB":
        image = image.convert("RGB")
    image = image.resize((128, 128))
    
    import tensorflow as tf
    input_arr = tf.keras.preprocessing.image.img_to_array(image)
    input_arr = input_arr / 255.0  # Normalize pixel values
    input_arr = np.expand_dims(input_arr, axis=0)
    
    predictions = model.predict(input_arr, verbose=0)
    probabilities = np.exp(predictions[0]) / np.sum(np.exp(predictions[0]))  # Softmax
    
    result_index = np.argmax(probabilities)
    confidence = float(probabilities[result_index] * 100)
    disease_name = CLASS_NAMES[result_index] if result_index < len(CLASS_NAMES) else "Unknown"
    
    return result_index, confidence, disease_name


def show_disease_detection():
    """Display the disease detection interface."""
    st.title("🌿 Plant Disease Detection")
    st.write("Upload a leaf image to identify plant diseases using our AI model.")

    model = load_disease_model()
    if model is None:
        st.error(
            "⚠️ Disease detection model not available. "
            "Please ensure the model file exists at the expected location."
        )
        return

    test_image = st.file_uploader(
        "Choose a plant leaf image:",
        type=["jpg", "jpeg", "png"],
        help="Upload a clear photo of the affected plant leaf",
        key="disease_upload",
    )

    if test_image is not None:
        col1, col2 = st.columns(2)
        
        with col1:
            st.image(test_image, caption="Uploaded Image", use_container_width=True)

        with col2:
            if st.button("🔬 Analyze Disease", use_container_width=True, key="disease_predict_btn"):
                with st.spinner("Analyzing image..."):
                    try:
                        result_index, confidence, disease_name = model_prediction(model, test_image)
                        formatted_name = format_disease_name(disease_name)
                        
                        # Display result with confidence
                        if "healthy" in disease_name.lower():
                            st.success(f"### ✅ {formatted_name}")
                            st.balloons()
                        else:
                            st.warning(f"### ⚠️ {formatted_name}")
                        
                        st.metric("Confidence", f"{confidence:.1f}%")
                        
                        # Confidence interpretation
                        if confidence >= 90:
                            st.info("🎯 High confidence prediction")
                        elif confidence >= 70:
                            st.info("👍 Moderate confidence. Consider consulting an expert.")
                        else:
                            st.warning(
                                "⚠️ Low confidence. Try uploading a clearer image "
                                "or consult an agricultural expert."
                            )

                    except Exception as e:
                        logger.error(f"Disease prediction error: {e}")
                        st.error(f"Prediction error: {e}")
