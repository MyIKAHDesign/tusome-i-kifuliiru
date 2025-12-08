import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';

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
    <div ref={searchRef} className="search-container">
      <div className="search-input-wrapper">
        <svg
          className="search-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
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
          className="search-input"
        />
        {isLoading && (
          <div className="search-loading">
            <div className="spinner"></div>
          </div>
        )}
      </div>

      {isOpen && (results.length > 0 || (query.length >= 2 && !isLoading)) && (
        <div className="search-results">
          {isLoading ? (
            <div className="search-loading-state">Tugweeti tugalooza...</div>
          ) : results.length > 0 ? (
            <>
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
                  className="search-result-item"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="result-icon"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  <span>{result.title}</span>
                </a>
              ))}
            </>
          ) : (
            <div className="search-empty-state">Ndabyo twaloonga</div>
          )}
        </div>
      )}

      <style jsx>{`
        .search-container {
          position: relative;
          min-width: 280px;
        }

        .search-input-wrapper {
          display: flex;
          align-items: center;
          gap: var(--spacing-3);
          padding: var(--spacing-2) var(--spacing-4);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          background-color: var(--color-bg);
          transition: all var(--transition-base);
          cursor: text;
        }

        .search-input-wrapper:focus-within {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px var(--color-primary-bg);
          outline: none;
        }

        .search-icon {
          color: var(--color-text-muted);
          flex-shrink: 0;
        }

        .search-input {
          border: none;
          outline: none;
          flex: 1;
          font-size: var(--font-size-sm);
          background: transparent;
          color: var(--color-text);
          min-width: 0;
        }

        .search-input::placeholder {
          color: var(--color-text-muted);
        }

        .search-loading {
          display: flex;
          align-items: center;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid var(--color-border);
          border-top-color: var(--color-primary);
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .search-results {
          position: absolute;
          top: calc(100% + var(--spacing-2));
          left: 0;
          right: 0;
          background-color: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
          max-height: 400px;
          overflow-y: auto;
          z-index: 1000;
          margin-top: var(--spacing-2);
        }

        .search-result-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-3);
          padding: var(--spacing-3) var(--spacing-4);
          color: var(--color-text);
          text-decoration: none;
          transition: all var(--transition-base);
          border-bottom: 1px solid var(--color-border-light);
        }

        .search-result-item:last-child {
          border-bottom: none;
        }

        .search-result-item:hover {
          background-color: var(--color-bg-secondary);
          color: var(--color-primary);
        }

        .result-icon {
          flex-shrink: 0;
          color: var(--color-text-muted);
        }

        .search-result-item:hover .result-icon {
          color: var(--color-primary);
        }

        .search-loading-state,
        .search-empty-state {
          padding: var(--spacing-6);
          text-align: center;
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
        }

        @media (max-width: 768px) {
          .search-container {
            min-width: 200px;
          }
        }
      `}</style>
    </div>
  );
}
