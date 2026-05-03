// src/components/URLShortener.tsx
import React, { useState, useEffect } from 'react';
import { useUrlStore } from '../store/urlStore';
import { useShortenUrl } from '../hooks/useUrlQueries';

export const URLShortener: React.FC = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const { mutateAsync: shortenUrl, isPending: loading, error: mutationError } = useShortenUrl();
  const { error: storeError, clearError } = useUrlStore();

  const error = (mutationError as any)?.message || storeError;

  useEffect(() => {
    let timer: number;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCountdown(null);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!originalUrl.trim()) {
      return;
    }

    // Basic URL validation
    try {
      new URL(originalUrl);
    } catch {
      alert('Please enter a valid URL');
      return;
    }

    clearError();
    
    try {
      await shortenUrl(originalUrl);
      setOriginalUrl('');
    } catch (error: any) {
      if (error.secondsRemaining) {
        setCountdown(error.secondsRemaining);
      }
    }
  };

  return (
    <div className="card mb-8">
      <h2 className="text-2xl font-bold mb-4" style={{ color: '#348a91' }}>
        Shorten a URL
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="url"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="Enter your long URL here..."
            className="input-primary"
            disabled={loading || countdown !== null}
            required
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || countdown !== null || !originalUrl.trim()}
          >
            {loading ? 'Shortening...' : 'Shorten URL'}
          </button>
          
          {countdown !== null && (
            <div className="text-red-600 font-semibold">
              Rate limit: Try again in {countdown} seconds
            </div>
          )}
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </form>
      
      <div className="mt-4 text-sm text-gray-600">
        <span className="font-semibold">Note:</span> Maximum 5 URLs per minute from a single IP
      </div>
    </div>
  );
};