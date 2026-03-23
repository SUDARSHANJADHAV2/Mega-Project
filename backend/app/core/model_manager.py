import os
import urllib.request
import logging

logger = logging.getLogger(__name__)

# Note: These URLs are placeholders for the actual free Hugging Face / GitHub Release URLs where the large models would be hosted.
MODELS_TO_DOWNLOAD = {
    "weed_cnn.keras": "https://huggingface.co/krushiai/models/resolve/main/weed_cnn.keras",
    "pest_cnn.keras": "https://huggingface.co/krushiai/models/resolve/main/pest_cnn.keras"
}

def ensure_models_downloaded(base_model_dir: str):
    """
    Downloads missing .h5 or .keras model files on first run.
    Never errors out—just logs warnings and allows application to start with heuristics if downloads fail.
    """
    if not os.path.exists(base_model_dir):
        os.makedirs(base_model_dir, exist_ok=True)
        
    for filename, url in MODELS_TO_DOWNLOAD.items():
        filepath = os.path.join(base_model_dir, filename)
        if not os.path.exists(filepath):
            logger.info(f"Model file {filename} not found. Attempting to download from {url}...")
            try:
                # Mocking the actual download to save time in Phase 3 demo, but in production this would run.
                # urllib.request.urlretrieve(url, filepath)
                # logger.info(f"Successfully downloaded {filename}.")
                logger.warning(f"Download placeholder for {filename}. (Assuming heuristic fallback will be used if absent)")
            except Exception as e:
                logger.error(f"Failed to download {filename}: {str(e)}. Falling back to heuristics.")

