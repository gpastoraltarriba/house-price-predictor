from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import numpy as np
import joblib
import json
from pathlib import Path

router = APIRouter()

MODEL_DIR = Path(__file__).parent.parent / "model"

# Load model and scaler on startup
try:
    model = joblib.load(MODEL_DIR / "house_price_model.pkl")
    scaler = joblib.load(MODEL_DIR / "scaler.pkl")
    with open(MODEL_DIR / "model_stats.json") as f:
        model_stats = json.load(f)
    print("✅ Model loaded successfully")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None
    scaler = None
    model_stats = {}


class HouseFeatures(BaseModel):
    MedInc: float = 5.0        # Median income
    HouseAge: float = 20.0     # House age in years
    AveRooms: float = 6.0      # Average rooms
    AveBedrms: float = 1.0     # Average bedrooms
    Population: float = 1000.0 # Block population
    AveOccup: float = 3.0      # Average occupants
    Latitude: float = 37.5     # Latitude
    Longitude: float = -122.0  # Longitude


class PredictionResponse(BaseModel):
    predicted_price: float
    price_range_low: float
    price_range_high: float
    confidence: str
    model_r2: float


@router.post("/predict", response_model=PredictionResponse)
def predict_price(features: HouseFeatures):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    input_data = np.array([[
        features.MedInc, features.HouseAge, features.AveRooms,
        features.AveBedrms, features.Population, features.AveOccup,
        features.Latitude, features.Longitude
    ]])

    predicted_price = float(model.predict(input_data)[0])
    mae = model_stats.get("model_mae", 30000)

    return PredictionResponse(
        predicted_price=round(predicted_price, 2),
        price_range_low=round(predicted_price - mae, 2),
        price_range_high=round(predicted_price + mae, 2),
        confidence="85%",
        model_r2=model_stats.get("model_r2", 0.83)
    )