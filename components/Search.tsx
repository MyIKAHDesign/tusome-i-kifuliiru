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
  const searchRef = useRef<HTMLDivElement>(null);
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
      return;
    }

    // Simple client-side search - you can enhance this with an API route
    // For now, we'll do a basic search through page titles
    try {
      const response = await fetch('/api/search?q=' + encodeURIComponent(searchQuery));
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    }
  };

  return (
    <div ref={searchRef} style={{ position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          border: '1px solid #e5e7eb',
          borderRadius: '0.375rem',
          backgroundColor: '#ffffff',
          cursor: 'text',
          minWidth: '200px',
        }}
        onClick={() => setIsOpen(true)}
      >
        <span style={{ color: '#9ca3af' }}>🔍</span>
        <input
          type="text"
          placeholder="Looza hano..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          style={{
            border: 'none',
            outline: 'none',
            flex: 1,
            fontSize: '0.875rem',
            background: 'transparent',
          }}
        />
      </div>

      {isOpen && results.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '0.5rem',
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            maxHeight: '400px',
            overflowY: 'auto',
            zIndex: 1000,
          }}
        >
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
              style={{
                display: 'block',
                padding: '0.75rem 1rem',
                color: '#374151',
                textDecoration: 'none',
                borderBottom: index < results.length - 1 ? '1px solid #f3f4f6' : 'none',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              {result.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

