import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { UrlData, ClickData } from '../types';

export const useUrls = () => {
  return useQuery<UrlData[]>({
    queryKey: ['urls'],
    queryFn: async () => {
      const urls = await apiService.getAllUrls();
      return urls.map((url: any) => ({
        id: url.id || url.short_code,
        short_code: url.short_code || url.alias,
        original_url: url.original_url || url.longUrl,
        shortUrl: url.shortUrl || `${window.location.origin}/${url.short_code || url.alias}`,
        clicks: url.clicks || 0,
        created_at: url.created_at || url.createdAt || new Date().toISOString(),
      }));
    },
  });
};

export const useShortenUrl = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (longUrl: string) => apiService.shortenUrl(longUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urls'] });
    },
  });
};

export const useDeleteUrl = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (alias: string) => apiService.deleteUrl(alias),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urls'] });
    },
  });
};

export const useAnalytics = (alias: string | null) => {
  return useQuery<ClickData[]>({
    queryKey: ['analytics', alias],
    queryFn: async () => {
      if (!alias) return [];
      const analytics = await apiService.getAnalytics(alias);
      
      let clicksOverTime: ClickData[] = [];
      if (Array.isArray(analytics)) {
        clicksOverTime = analytics;
      } else if (analytics && Array.isArray(analytics.clicksOverTime)) {
        clicksOverTime = analytics.clicksOverTime;
      } else if (analytics && Array.isArray(analytics.data)) {
        clicksOverTime = analytics.data;
      }
      return clicksOverTime;
    },
    enabled: !!alias,
  });
};
