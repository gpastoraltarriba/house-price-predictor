import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export interface HouseFeatures {
  MedInc: number;
  HouseAge: number;
  AveRooms: number;
  AveBedrms: number;
  Population: number;
  AveOccup: number;
  Latitude: number;
  Longitude: number;
}

export interface PredictionResponse {
  predicted_price: number;
  price_range_low: number;
  price_range_high: number;
  confidence: string;
  model_r2: number;
}

export interface StatsResponse {
  model: {
    r2: number;
    rmse: number;
    mae: number;
    algorithm: string;
  };
  dataset: {
    price_min: number;
    price_max: number;
    price_mean: number;
    features: string[];
  };
  price_distribution: { range: string; count: number }[];
  model_comparison: { model: string; r2: number; rmse: number }[];
}

export const predictPrice = async (features: HouseFeatures): Promise<PredictionResponse> => {
  const { data } = await api.post("/predict", features);
  return data;
};

export const getStats = async (): Promise<StatsResponse> => {
  const { data } = await api.get("/stats");
  return data;
};

export default api;