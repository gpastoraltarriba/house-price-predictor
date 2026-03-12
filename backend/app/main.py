from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import predict, stats

app = FastAPI(
    title="Swiss House Price Predictor",
    description="ML-powered house price prediction API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router, prefix="/api/v1", tags=["Prediction"])
app.include_router(stats.router, prefix="/api/v1", tags=["Stats"])

@app.get("/")
def root():
    return {"message": "Swiss House Price Predictor API", "docs": "/docs"}

@app.get("/health")
def health():
    return {"status": "ok"}