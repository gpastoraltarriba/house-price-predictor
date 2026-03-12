from fastapi import APIRouter
from pathlib import Path
import json

router = APIRouter()

MODEL_DIR = Path(__file__).parent.parent / "model"

with open(MODEL_DIR / "model_stats.json") as f:
    model_stats = json.load(f)


@router.get("/stats")
def get_stats():
    return {
        "model": {
            "r2": round(model_stats["model_r2"], 4),
            "rmse": round(model_stats["model_rmse"], 2),
            "mae": round(model_stats["model_mae"], 2),
            "algorithm": "XGBoost",
        },
        "dataset": {
            "price_min": model_stats["price_min"],
            "price_max": model_stats["price_max"],
            "price_mean": round(model_stats["price_mean"], 2),
            "features": model_stats["features"],
        },
        "price_distribution": [
            {"range": "< CHF 100k", "count": 1200},
            {"range": "100k - 200k", "count": 3800},
            {"range": "200k - 300k", "count": 4200},
            {"range": "300k - 400k", "count": 2800},
            {"range": "400k - 500k", "count": 1600},
            {"range": "> CHF 500k", "count": 820},
        ],
        "model_comparison": [
            {"model": "Linear Regression", "r2": 0.5758, "rmse": 74558},
            {"model": "Random Forest", "r2": 0.8038, "rmse": 50710},
            {"model": "XGBoost", "r2": 0.8301, "rmse": 47179},
        ]
    }