# Swiss House Price Predictor

A full-stack ML application that predicts house prices using XGBoost — built as a portfolio project targeting the Swiss tech and fintech market.

**Live demo:** https://house-price-predictor-swiss.vercel.app

**API docs:** https://house-price-predictor-production-7bf9.up.railway.app/docs

**GitHub:** https://github.com/gpastoraltarriba/house-price-predictor

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| ML Model | XGBoost, Scikit-learn, Pandas, NumPy |
| Backend | FastAPI (Python 3.12), Joblib |
| Frontend | Next.js 14, TypeScript, Recharts, Tailwind CSS |
| Infrastructure | Docker |
| Deploy | Railway (backend), Vercel (frontend) |

---

## Features

- **Price prediction** — Interactive sliders to input property features and get an instant ML-powered estimate
- **Confidence interval** — Shows price range based on model MAE
- **Analytics dashboard** — Price distribution, model comparison, dataset statistics
- **Model comparison** — Linear Regression vs Random Forest vs XGBoost
- **REST API** — Fully documented with OpenAPI / Swagger UI
- **Production ready** — Dockerized backend deployed on Railway

---

## ML Model

The model was trained on the California Housing dataset (20,640 samples) with the following results:

| Model | R² Score | RMSE |
|-------|----------|------|
| Linear Regression | 0.5758 | CHF 74,558 |
| Random Forest | 0.8038 | CHF 50,710 |
| **XGBoost** | **0.8301** | **CHF 47,179** |

XGBoost was selected as the final model with an R² of **0.83** and MAE of **CHF 30,957**.

**Top features by importance:** MedInc, Latitude, Longitude, HouseAge, AveRooms

---

## Project Structure

```
house-price-predictor/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── predict.py      # POST /api/v1/predict
│   │   │   └── stats.py        # GET /api/v1/stats
│   │   ├── model/
│   │   │   ├── house_price_model.pkl
│   │   │   ├── scaler.pkl
│   │   │   └── model_stats.json
│   │   └── main.py
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── page.tsx            # Predictor with sliders
│   │   └── analytics/page.tsx  # Charts and model stats
│   └── lib/api.ts
└── notebooks/
    └── 01_EDA_and_training.ipynb
```

---

## Run locally

```bash
git clone https://github.com/gpastoraltarriba/house-price-predictor.git
cd house-price-predictor

# Backend
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000

# Frontend (new terminal)
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1" > .env.local
npm run dev
```

- Frontend: http://localhost:3000
- API docs: http://localhost:8000/docs

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info |
| GET | `/health` | Health check |
| POST | `/api/v1/predict` | Predict house price |
| GET | `/api/v1/stats` | Model and dataset statistics |

### Example prediction request

```json
POST /api/v1/predict
{
  "MedInc": 5.0,
  "HouseAge": 20,
  "AveRooms": 6,
  "AveBedrms": 1,
  "Population": 1000,
  "AveOccup": 3,
  "Latitude": 37.5,
  "Longitude": -122.0
}
```

### Example response

```json
{
  "predicted_price": 209560,
  "price_range_low": 178602,
  "price_range_high": 240517,
  "confidence": "85%",
  "model_r2": 0.8301
}
```

---

