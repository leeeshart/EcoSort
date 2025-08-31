import { apiRequest } from "./queryClient";
import { ClassificationResult } from "@shared/schema";

export const api = {
  classifyText: async (text: string): Promise<ClassificationResult> => {
    const response = await apiRequest('POST', '/api/classify-text', { text });
    return response.json();
  },

  classifyImage: async (file: File): Promise<ClassificationResult> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await apiRequest('POST', '/api/classify-image', formData);
    return response.json();
  },

  healthCheck: async () => {
    const response = await apiRequest('GET', '/api/health');
    return response.json();
  },
};
