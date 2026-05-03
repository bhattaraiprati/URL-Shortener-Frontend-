// src/components/URLList.tsx
import React from 'react';
import { UrlData } from '../types';
import { useQueryClient } from '@tanstack/react-query';

interface URLListProps {
  urls: UrlData[];
  onSelect: (url: UrlData) => void;
  selectedAlias: string | null;
}

export const URLList: React.FC<URLListProps> = ({ urls, onSelect, selectedAlias }) => {
  const queryClient = useQueryClient();

  const redirecturl = (url: string) => {

    let newurl = getFullShortUrl(url);
    window.open(newurl, "_blank");
  };

  const handleShortUrlClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['urls'] });
    }, 1000);
  };

  const getFullShortUrl = (alias: string) => {
    const apiUrl = "http://localhost:5000/api";
    return `${apiUrl}/${alias}`;
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4" style={{ color: '#348a91' }}>
        Your Shortened URLs
      </h2>
      
      {urls.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No URLs shortened yet. Create your first one above!
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Short URL</th>
                <th className="px-4 py-2 text-left">Original URL</th>
                <th className="px-4 py-2 text-center">Clicks</th>
                <th className="px-4 py-2 text-center">Created</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {urls.map((url) => (
                <tr
                onClick={() => redirecturl(url.short_code)}
                  key={url.id}
                  className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedAlias === url.short_code ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="border-t px-4 py-2">
                    <a
                      href={getFullShortUrl(url.short_code)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                      style={{ color: '#348a91' }}
                      onClick={handleShortUrlClick}
                    >
                      {getFullShortUrl(url.short_code)}
                    </a>
                  </td>
                  <td className="border-t px-4 py-2">
                    <div className="truncate max-w-xs" title={url.original_url}>
                      {url.original_url}
                    </div>
                  </td>
                  <td className="border-t px-4 py-2 text-center font-semibold">
                    {url.clicks}
                  </td>
                  <td className="border-t px-4 py-2 text-center text-sm">
                    {new Date(url.created_at).toLocaleDateString()}
                  </td>
                  <td className="border-t pl-4 py-2 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(url);
                      }}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <span>View Analytics</span>
                      
                    </button>
                    {/* <button
                      onClick={(e) => handleDelete(url.short_code, e)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      Delete
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};