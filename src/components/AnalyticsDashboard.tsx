// src/components/AnalyticsDashboard.tsx
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { ClickData, UrlData } from '../types';
import { useAnalytics } from '../hooks/useUrlQueries';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnalyticsDashboardProps {
  selectedUrl: UrlData | null;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ selectedUrl }) => {
  const alias = selectedUrl?.short_code || null;
  const { data: analyticsData = [], isLoading: analyticsLoading, refetch: fetchAnalytics } = useAnalytics(alias);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!alias) return;
    setRefreshing(true);
    await fetchAnalytics();
    setTimeout(() => setRefreshing(false), 500);
  };

  if (!selectedUrl) {
    return (
      <div className="card">
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Select a URL from the list to view analytics</p>
          <p className="text-sm mt-2">Click on any URL in the table to see click statistics</p>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: analyticsData.map((data: ClickData) => data.date),
    datasets: [
      {
        label: 'Clicks',
        data: analyticsData.map((data: ClickData) => data.count),
        borderColor: '#348a91',
        backgroundColor: 'rgba(52, 138, 145, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#348a91',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 6,
        },
      },
      title: {
        display: true,
        text: `Click Analytics for ${alias}`,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `Clicks: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: 'Number of Clicks',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

  const totalClicks = analyticsData.reduce((sum: number, data: ClickData) => sum + data.count, 0);
  const averageClicks = analyticsData.length > 0 ? (totalClicks / analyticsData.length).toFixed(1) : 0;

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#348a91' }}>
            Analytics Dashboard
          </h2>
          <p className="text-gray-600 mt-1">
            URL: <span className="font-mono text-sm">{import.meta.env.VITE_API_URL}/{alias}</span>
          </p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={analyticsLoading || refreshing}
          className="btn-primary flex items-center space-x-2"
        >
          <svg
            className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total Clicks</p>
          <p className="text-3xl font-bold" style={{ color: '#348a91' }}>
            {totalClicks}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Average Daily Clicks</p>
          <p className="text-3xl font-bold" style={{ color: '#348a91' }}>
            {averageClicks}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Days Tracked</p>
          <p className="text-3xl font-bold" style={{ color: '#348a91' }}>
            {analyticsData.length}
          </p>
        </div>
      </div>

      {analyticsLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading analytics...</p>
          </div>
        </div>
      ) : analyticsData.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No click data available for the last 7 days</p>
        </div>
      ) : (
        <div className="h-96">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500 text-center">
        Showing click statistics for the last 7 days
      </div>
    </div>
  );
};