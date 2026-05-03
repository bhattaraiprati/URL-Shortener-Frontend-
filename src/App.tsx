import { URLShortener } from './components/URLShortener';
import { URLList } from './components/URLList';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useUrlStore } from './store/urlStore';
import { useUrls } from './hooks/useUrlQueries';

function App() {
  const { data: urls = [], isLoading, error: queryError } = useUrls();
  const { selectedUrl, setSelectedUrl, error: storeError, clearError } = useUrlStore();

  const error = queryError ? (queryError as Error).message : storeError;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="shadow-sm" style={{ backgroundColor: '#348a91' }}>
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">
            URL Shortener
          </h1>
          <p className="text-white text-opacity-90 mt-1">
            Shorten, track, and analyze your links with ease
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <URLShortener />
          
          {isLoading && urls.length === 0 ? (
            <LoadingSpinner />
          ) : (
            <>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                  <span className="block sm:inline">{error}</span>
                  <button 
                    className="absolute top-0 bottom-0 right-0 px-4 py-3"
                    onClick={clearError}
                  >
                    <span className="sr-only">Dismiss</span>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
              )}
              <URLList
                urls={urls}
                onSelect={setSelectedUrl}
                selectedAlias={selectedUrl?.short_code || null}
              />
              
              <AnalyticsDashboard selectedUrl={selectedUrl} />
            </>
          )}
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>Rate Limited URL Shortener with Analytics</p>
          <p className="text-sm text-gray-400 mt-2">
            Maximum 5 URLs per minute from a single IP
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;