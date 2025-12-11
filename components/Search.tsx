'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search as SearchIcon, FileText, Loader2, X } from 'lucide-react';

interface SearchResult {
  title: string;
  path: string;
}

interface SearchProps {
  variant?: 'modal' | 'inline' | 'sticky';
  placeholder?: string;
  value?: string;
  onSearch?: (query: string) => void;
  onResultsChange?: (results: SearchResult[]) => void;
  localResults?: SearchResult[];
  className?: string;
  showResults?: boolean;
  searchEndpoint?: string;
  iconPosition?: 'fixed' | 'header';
}

export default function Search({
  variant = 'modal',
  placeholder = 'Looza hano...',
  value,
  onSearch,
  onResultsChange,
  localResults,
  className = '',
  showResults = true,
  searchEndpoint = '/api/search',
  iconPosition = 'fixed',
}: SearchProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFloatingOpen, setIsFloatingOpen] = useState(false);
  const [internalQuery, setInternalQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Use controlled value if provided, otherwise use internal state
  const query = value !== undefined ? value : internalQuery;
  
  // Scroll detection for inline and sticky variants
  useEffect(() => {
    if (variant !== 'inline' && variant !== 'sticky') return;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Show icon when scrolled up (scrolling upward) or near top (within 100px)
      const scrollingUp = currentScrollY < lastScrollY;
      setIsScrolledUp(currentScrollY < 100 || scrollingUp);
      setLastScrollY(currentScrollY);
    };
    
    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [variant, lastScrollY]);
  
  const handleQueryChange = (newQuery: string) => {
    if (value === undefined) {
      // Uncontrolled - update internal state
      setInternalQuery(newQuery);
    }
    // Always call onSearch callback
    if (onSearch) {
      onSearch(newQuery);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
        handleQueryChange('');
        setResults([]);
      }
      if (floatingRef.current && !floatingRef.current.contains(event.target as Node)) {
        setIsFloatingOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (variant === 'modal' && isModalOpen) {
          setIsModalOpen(false);
          handleQueryChange('');
          setResults([]);
        }
        if (isFloatingOpen) {
          setIsFloatingOpen(false);
        }
      }
    };

    if (isModalOpen && variant === 'modal') {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
    
    if (isFloatingOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isModalOpen, isFloatingOpen, variant]);

  useEffect(() => {
    if (localResults) {
      setResults(localResults);
      if (onResultsChange) {
        onResultsChange(localResults);
      }
    }
  }, [localResults, onResultsChange]);

  const handleSearch = async (searchQuery: string) => {
    handleQueryChange(searchQuery);
    
    // Call custom search handler if provided
    if (onSearch) {
      return;
    }

    // Default API search
    if (searchQuery.length < 2) {
      setResults([]);
      if (onResultsChange) {
        onResultsChange([]);
      }
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${searchEndpoint}?q=` + encodeURIComponent(searchQuery));
      if (response.ok) {
        const data = await response.json();
        const searchResults = data.results || [];
        setResults(searchResults);
        if (onResultsChange) {
          onResultsChange(searchResults);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      if (onResultsChange) {
        onResultsChange([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (path: string) => {
    router.push(path);
    if (variant === 'modal') {
      setIsModalOpen(false);
    }
    handleQueryChange('');
    setResults([]);
    if (onResultsChange) {
      onResultsChange([]);
    }
  };

  const handleClear = () => {
    handleQueryChange('');
    setResults([]);
    if (onResultsChange) {
      onResultsChange([]);
    }
  };

  // Modal variant - Button that opens modal
  if (variant === 'modal') {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-900 transition-colors"
          aria-label="Search"
          title="Search"
        >
          <SearchIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-start justify-center pt-24 px-4 pb-8">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            
            <div
              ref={modalRef}
              className="relative w-full max-w-2xl bg-white dark:bg-gray-950 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 animate-in fade-in slide-in-from-top-4 duration-200"
            >
              <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 dark:border-gray-800">
                <SearchIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={placeholder}
                  value={query}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (value === undefined) {
                      setInternalQuery(newValue);
                    }
                    handleSearch(newValue);
                  }}
                  className="flex-1 bg-transparent border-0 outline-0 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400"
                />
                {isLoading && (
                  <Loader2 className="w-4 h-4 text-gray-600 dark:text-gray-400 animate-spin flex-shrink-0" />
                )}
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    handleQueryChange('');
                    setResults([]);
                  }}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {showResults && (
                <>
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

                  {query.length < 2 && (
                    <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                      Tandika kwandika kugalooza...
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  // Floating search overlay component
  const FloatingSearchOverlay = () => (
    <>
      {isFloatingOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-end pt-24 pr-4 pb-8 pointer-events-none">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto" onClick={() => setIsFloatingOpen(false)} />
          <div
            ref={floatingRef}
            className="relative w-full max-w-md bg-white dark:bg-gray-950 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 animate-in fade-in slide-in-from-top-4 duration-200 pointer-events-auto"
          >
            <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 dark:border-gray-800">
              <SearchIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (value === undefined) {
                    setInternalQuery(newValue);
                  }
                  handleSearch(newValue);
                }}
                className="flex-1 bg-transparent border-0 outline-0 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400"
              />
              {isLoading && (
                <Loader2 className="w-4 h-4 text-gray-600 dark:text-gray-400 animate-spin flex-shrink-0" />
              )}
              <button
                onClick={() => setIsFloatingOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            {showResults && query.length >= 2 && (
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
          </div>
        </div>
      )}
    </>
  );

  // Icon button component
  const SearchIconButton = () => (
    <button
      onClick={() => setIsFloatingOpen(true)}
      className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${iconPosition === 'header' ? '' : 'fixed top-24 right-4 z-50 bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:scale-110'}`}
      aria-label="Open search"
      title="Search"
    >
      <SearchIcon className={`w-5 h-5 ${iconPosition === 'header' ? 'text-gray-700 dark:text-gray-300' : ''}`} />
    </button>
  );

  // Inline variant - Always visible search bar with scroll-based icon
  if (variant === 'inline') {
    // If hidden class and header position, only render icon button
    if (className.includes('hidden') && iconPosition === 'header') {
      return (
        <>
          {isScrolledUp && <SearchIconButton />}
          <FloatingSearchOverlay />
        </>
      );
    }
    
    return (
      <>
        {/* Icon button when scrolled up - render inline if header position */}
        {isScrolledUp && iconPosition === 'header' && <SearchIconButton />}
        {isScrolledUp && iconPosition !== 'header' && <SearchIconButton />}
        
        {/* Search bar - hidden when scrolled up */}
        <div className={`relative ${className} ${isScrolledUp ? 'opacity-0 pointer-events-none h-0 overflow-hidden' : 'opacity-100'}`}>
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              const newValue = e.target.value;
              if (value === undefined) {
                setInternalQuery(newValue);
              }
              handleSearch(newValue);
            }}
            className="w-full pl-12 pr-12 py-4 text-base bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-gray-100 placeholder-gray-400"
          />
          {isLoading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
            </div>
          )}
          {query && !isLoading && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
        
        <FloatingSearchOverlay />
      </>
    );
  }

  // Sticky variant - Sticky search bar with enhanced styling and scroll-based icon
  if (variant === 'sticky') {
    // If hidden class and header position, only render icon button
    if (className.includes('hidden') && iconPosition === 'header') {
      return (
        <>
          {isScrolledUp && <SearchIconButton />}
          <FloatingSearchOverlay />
        </>
      );
    }
    
    return (
      <>
        {/* Icon button when scrolled up */}
        {isScrolledUp && iconPosition === 'header' && <SearchIconButton />}
        {isScrolledUp && iconPosition !== 'header' && <SearchIconButton />}
        
        {/* Search bar - hidden when scrolled up */}
        <div className={`sticky top-24 z-40 mb-8 bg-white dark:bg-gray-950 ${className} ${isScrolledUp ? 'opacity-0 pointer-events-none h-0 overflow-hidden' : 'opacity-100'}`}>
          <div className="w-full">
            <div className="relative flex items-center">
              <div className="absolute left-4 pointer-events-none">
                <SearchIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (value === undefined) {
                    setInternalQuery(newValue);
                  }
                  handleSearch(newValue);
                }}
                className="w-full pl-12 pr-12 py-4 text-base bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-primary-500 dark:focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:focus:ring-primary-500/20 transition-all shadow-sm hover:shadow-md"
              />
              {query && (
                <button
                  onClick={handleClear}
                  className="absolute right-4 p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  aria-label="Clear search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
        
        <FloatingSearchOverlay />
      </>
    );
  }

  return null;
}
