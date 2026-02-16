"""
KrushiAI Crop Utilities (Legacy Module)
Backward-compatible wrapper around utils.py for modules that import from crop_utils.
"""

import pickle
import numpy as np
import os
import logging

logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def load_model(model_name='RandomForest.pkl'):
    """Load a trained ML model from pickle file."""
    model_path = os.path.join(BASE_DIR, model_name)
    try:
        with open(model_path, 'rb') as f:
            return pickle.load(f)
    except FileNotFoundError:
        logger.error(f"Model file not found: {model_path}")
        return None
    except Exception as e:
        logger.error(f"Error loading model: {e}")
        return None


def predict_crop(n, p, k, temp, humidity, ph, rainfall):
    """
    Predict the best crop for given parameters.
    
    Args:
        n: Nitrogen content (mg/kg)
        p: Phosphorus content (mg/kg)
        k: Potassium content (mg/kg)
        temp: Temperature (°C)
        humidity: Humidity (%)
        ph: Soil pH
        rainfall: Rainfall (mm)
    
    Returns:
        Predicted crop name string
    """
    try:
        model = load_model()
        if model is None:
            return "Prediction error: model not loaded"
        data = np.array([[n, p, k, temp, humidity, ph, rainfall]])
        prediction = model.predict(data)
        return prediction[0]
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return f"Prediction error: {e}"
