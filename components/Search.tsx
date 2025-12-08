import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Search as SearchIcon, FileText, Loader2, X } from 'lucide-react';

interface SearchResult {
  title: string;
  path: string;
}

export default function Search() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
        setQuery('');
        setResults([]);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
        setQuery('');
        setResults([]);
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      // Focus input when modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isModalOpen]);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/search?q=' + encodeURIComponent(searchQuery));
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (path: string) => {
    router.push(path);
    setIsModalOpen(false);
    setQuery('');
    setResults([]);
  };

  return (
    <>
      {/* Search Icon Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-900 transition-colors"
        aria-label="Search"
        title="Search"
      >
        <SearchIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </button>

      {/* Search Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          
          {/* Modal Content */}
          <div
            ref={modalRef}
            className="relative w-full max-w-2xl bg-white dark:bg-gray-950 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 animate-in fade-in slide-in-from-top-4 duration-200"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 dark:border-gray-800">
        <SearchIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Looza hano..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 bg-transparent border-0 outline-0 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400"
        />
        {isLoading && (
                <Loader2 className="w-4 h-4 text-gray-600 dark:text-gray-400 animate-spin flex-shrink-0" />
        )}
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setQuery('');
                  setResults([]);
                }}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
      </div>

            {/* Search Results */}
            {query.length >= 2 && (
              <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Tugweeti tugalooza...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => (
                      <button
                  key={index}
                        onClick={() => handleResultClick(result.path)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0 text-left"
                >
                  <FileText className="w-4 h-4 flex-shrink-0 text-gray-400" />
                  <span>{result.title}</span>
                      </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Ndabyo twaloonga
            </div>
          )}
        </div>
      )}

            {/* Empty State */}
            {query.length < 2 && (
              <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Tandika kwandika kugalooza...
              </div>
            )}
          </div>
    </div>
      )}
    </>
  );
}
