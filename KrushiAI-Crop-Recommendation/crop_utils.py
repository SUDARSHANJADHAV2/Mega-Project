import pickle
import numpy as np
import os

# Get the directory of the current file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

import streamlit as st

@st.cache_resource
def load_model(model_name='RandomForest.pkl'):
    model_path = os.path.join(BASE_DIR, model_name)
    with open(model_path, 'rb') as f:
        return pickle.load(f)

def predict_crop(n, p, k, temp, humidity, ph, rainfall):
    model = load_model()
    data = np.array([[n, p, k, temp, humidity, ph, rainfall]])
    prediction = model.predict(data)
    return prediction[0]
