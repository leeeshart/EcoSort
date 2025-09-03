import { apiRequest } from "./queryClient";
import type { WasteClassification } from "@shared/schema";

export interface ClassificationRequest {
  description: string;
  imageUrl?: string;
}

export async function classifyWaste(data: ClassificationRequest): Promise<WasteClassification> {
  const response = await apiRequest("POST", "/api/classify", data);
  return response.json();
}

export async function getUserStats(userId: string) {
  const response = await apiRequest("GET", `/api/stats/${userId}`);
  return response.json();
}

export async function getClassificationHistory(userId?: string) {
  const url = userId ? `/api/classifications?userId=${userId}` : "/api/classifications";
  const response = await apiRequest("GET", url);
  return response.json();
}
