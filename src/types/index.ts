// src/types/index.ts
export interface UrlData {
  id: string;
  short_code: string;
  original_url: string;
  shortUrl: string;
  clicks: number;
  created_at: string;
}

export interface ClickData {
  date: string;
  count: number;
}

export interface RateLimitError {
  secondsRemaining: number;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ShortenUrlRequest {
  originalUrl: string;
}

export interface ShortenUrlResponse {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
}