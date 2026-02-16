"""
KrushiAI Crop Recommendation Utilities
Provides model loading, prediction, and crop information functions.
"""

import pickle
import numpy as np
import os
import logging

logger = logging.getLogger(__name__)

# Get the directory of the current file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def load_model(model_name='RF.pkl'):
    """
    Load a trained ML model from pickle file.
    
    Args:
        model_name: Name of the pickle file (default: RF.pkl)
    
    Returns:
        Loaded sklearn model
    """
    model_path = os.path.join(BASE_DIR, model_name)
    try:
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        logger.info(f"Model loaded: {model_name}")
        return model
    except FileNotFoundError:
        logger.error(f"Model file not found: {model_path}")
        return None
    except Exception as e:
        logger.error(f"Error loading model: {e}")
        return None


def predict_crop(model, features):
    """
    Predict the best crop for given environmental conditions.
    
    Args:
        model: Trained sklearn classifier
        features: List of [N, P, K, temperature, humidity, pH, rainfall]
    
    Returns:
        Predicted crop name string, or "Prediction error" on failure
    """
    try:
        if model is None:
            return "Prediction error"
        data = np.array([features])
        prediction = model.predict(data)
        return prediction[0]
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return "Prediction error"


# Crop information dictionary for explainability
crop_info = {
    "rice": "🌾 Rice thrives in warm, humid climates with high rainfall. Best grown in paddy fields with standing water. Ideal temperature: 20-35°C.",
    "maize": "🌽 Maize grows best in well-drained loamy soils with moderate rainfall and warm temperatures (21-30°C). Requires good sunlight.",
    "chickpea": "🫘 Chickpea prefers cool, dry climates with moderate rainfall. Best in well-drained soils with pH 6.0-8.0.",
    "kidneybeans": "🫘 Kidney beans need warm temperatures (18-24°C), moderate rainfall, and fertile loamy soil.",
    "pigeonpeas": "🫘 Pigeon peas are drought-tolerant and grow well in semi-arid tropical climates with deep soils.",
    "mothbeans": "🫘 Moth beans are highly drought-resistant, ideal for arid and semi-arid regions with sandy soil.",
    "mungbean": "🫘 Mung beans prefer warm, tropical climates (25-35°C) with moderate rainfall.",
    "blackgram": "🫘 Black gram thrives in warm, humid climates with well-drained loamy soil. Temperature: 25-35°C.",
    "lentil": "🫘 Lentils grow best in cool climates (15-25°C) with moderate rainfall and sandy loam soil.",
    "pomegranate": "🍎 Pomegranate thrives in semi-arid conditions with hot, dry summers. Very drought-tolerant once established.",
    "banana": "🍌 Banana needs tropical, humid climate, rich well-drained soil, and temperatures of 20-35°C.",
    "mango": "🥭 Mango prefers tropical and subtropical climates with a distinct dry season. Temperature: 24-30°C.",
    "grapes": "🍇 Grapes thrive in warm, dry climates with well-drained sandy loam soil. Temperature: 15-35°C.",
    "watermelon": "🍉 Watermelon needs warm temperatures (25-30°C), full sun, and sandy loam soil.",
    "muskmelon": "🍈 Muskmelon grows best in warm climates (24-30°C) with sandy, well-drained soil.",
    "apple": "🍎 Apples need cold winters (chilling hours) and moderate summers. Best in well-drained loamy soil.",
    "orange": "🍊 Oranges thrive in subtropical climates with well-drained, sandy loam soil. Temperature: 15-35°C.",
    "papaya": "🍈 Papaya loves tropical climates with rich, well-drained soil and warm temperatures year-round (22-33°C).",
    "coconut": "🥥 Coconut palms thrive in coastal tropical areas with high humidity and sandy soil.",
    "cotton": "🧵 Cotton grows best in warm climates (21-30°C) with black soil and moderate rainfall.",
    "jute": "🧶 Jute prefers hot, humid climates with heavy rainfall and alluvial soil. Temperature: 24-37°C.",
    "coffee": "☕ Coffee grows in tropical highlands (15-24°C) with rich soil and moderate shade.",
}
