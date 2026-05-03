// src/services/api.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import {  ShortenUrlResponse, ApiResponse} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || '/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 429) {
          const data = error.response.data as { secondsRemaining?: number; message?: string };
          const secondsRemaining = data.secondsRemaining || 60;
          throw { secondsRemaining, message: data.message || 'Rate limit exceeded' };
        }
        throw error;
      }
    );
  }

  async shortenUrl(originalUrl: string): Promise<ShortenUrlResponse> {
    const response = await this.api.post<ApiResponse<ShortenUrlResponse>>('/shorten', {
      originalUrl,
    });
    if (response.data.success) {
      // If the response has data nested (expected format)
      if (response.data.data) {
        return response.data.data;
      }
      // If the response is flat (actual backend format)
      const flatData = response.data as any;
      if (flatData.shortCode) {
        return {
          shortCode: flatData.shortCode,
          shortUrl: flatData.shortUrl,
          originalUrl: flatData.originalUrl
        };
      }
    }
    
    throw new Error((response.data as any).message || 'Failed to shorten URL');
  }

  async getAllUrls(): Promise<any[]> {
    const response = await this.api.get<ApiResponse<any[]>>('/urls');
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch URLs');
    }
    return response.data.data || [];
  }

  async getAnalytics(alias: string): Promise<any> {
    const response = await this.api.get<ApiResponse<any>>(`/analytics/${alias}`);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch analytics');
    }
    return response.data.data;
  }

  async deleteUrl(alias: string): Promise<void> {
    const response = await this.api.delete<ApiResponse<void>>(`/url/${alias}`);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete URL');
    }
  }
}

export const apiService = new ApiService();