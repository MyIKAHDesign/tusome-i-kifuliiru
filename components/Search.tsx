import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Search as SearchIcon, FileText, Loader2 } from 'lucide-react';

interface SearchResult {
  title: string;
  path: string;
}

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);

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

  return (
    <div ref={searchRef} className="relative min-w-[200px] sm:min-w-[280px]">
      <div className="flex items-center gap-3 px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-full bg-white dark:bg-gray-900 transition-all focus-within:border-gray-300 dark:focus-within:border-gray-700">
        <SearchIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Looza hano..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => {
            if (query.length >= 2 && results.length > 0) {
              setIsOpen(true);
            }
          }}
          className="flex-1 bg-transparent border-0 outline-0 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400"
        />
        {isLoading && (
          <Loader2 className="w-4 h-4 text-gray-600 dark:text-gray-400 animate-spin flex-shrink-0" />
        )}
      </div>

      {isOpen && (results.length > 0 || (query.length >= 2 && !isLoading)) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Tugweeti tugalooza...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => (
                <a
                  key={index}
                  href={result.path}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(result.path);
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <FileText className="w-4 h-4 flex-shrink-0 text-gray-400" />
                  <span>{result.title}</span>
                </a>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Ndabyo twaloonga
            </div>
          )}
        </div>
      )}
    </div>
  );
}
