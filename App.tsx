
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import ResultView from './components/ResultView';
import { getAcharyaAnalysis } from './services/geminiService';
import { AcharyaResponse, HistoryItem } from './types';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeResult, setActiveResult] = useState<AcharyaResponse | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const targetQuery = customQuery || query;
    if (!targetQuery.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getAcharyaAnalysis(targetQuery);
      setActiveResult(result);
      
      const newHistoryItem: HistoryItem = {
        query: targetQuery,
        response: result,
        timestamp: Date.now()
      };
      
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 10));
      setQuery('');
      
      // Smooth scroll to result
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'An error occurred while consulting the Acharya.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setActiveResult(null);
  };

  const loadFromHistory = (item: HistoryItem) => {
    setActiveResult(item.response);
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 pt-12">
        {/* Search Section */}
        <section className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6 leading-tight">
            Ask the <span className="text-orange-600 italic">Acharya</span>
          </h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Get grammatical tables, etymologies, and linguistic analysis for any Sanskrit word or phrase.
          </p>

          <form onSubmit={handleSearch} className="relative group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Conjugate the root 'bhū' in Lat Lakara"
              className="w-full px-8 py-5 text-lg rounded-2xl border-2 border-orange-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none shadow-xl transition-all font-medium pr-32"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-3 top-3 bottom-3 px-6 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 active:scale-95 transition-all flex items-center gap-2 disabled:bg-gray-400"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <>
                  <span className="hidden sm:inline">Search</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </>
              )}
            </button>
          </form>

          {/* Quick Suggestions */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {['रामः (Rama Declensions)', 'गच्छति (Root analysis)', 'Sandhi rules', 'Karma yoga'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSearch(undefined, suggestion)}
                className="px-3 py-1 text-xs font-semibold text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-full transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </section>

        {error && (
          <div className="max-w-2xl mx-auto mb-12 p-6 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-4 animate-bounce">
            <div className="text-rose-500">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
            </div>
            <div>
              <h3 className="font-bold text-rose-800">Acharya's Apology</h3>
              <p className="text-rose-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div ref={scrollRef}>
          {activeResult ? (
            <ResultView data={activeResult} />
          ) : !loading && (
            <div className="text-center py-20 opacity-20">
              <div className="text-9xl mb-4 font-sanskrit text-orange-900 select-none">विद्या</div>
              <p className="text-xl font-medium text-orange-900 italic">"Knowledge is power"</p>
            </div>
          )}
        </div>

        {/* Loading State Skeleton */}
        {loading && (
          <div className="space-y-8 animate-pulse">
            <div className="h-64 bg-gray-100 rounded-3xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 h-96 bg-gray-100 rounded-3xl"></div>
              <div className="h-96 bg-gray-100 rounded-3xl"></div>
            </div>
          </div>
        )}
      </main>

      {/* Floating History / Sidebar Toggle (Simulated) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl border border-white/50 z-50">
        <button 
          onClick={clearHistory}
          title="Clear session"
          className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
        <div className="w-px h-6 bg-gray-300"></div>
        {history.length > 0 ? (
          <div className="flex gap-2 max-w-[60vw] overflow-x-auto scrollbar-hide">
            {history.map((item, idx) => (
              <button
                key={item.timestamp}
                onClick={() => loadFromHistory(item)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeResult === item.response 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                }`}
              >
                {item.query.length > 15 ? item.query.substring(0, 15) + '...' : item.query}
              </button>
            ))}
          </div>
        ) : (
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">No recent inquiries</span>
        )}
      </div>
    </div>
  );
};

export default App;
