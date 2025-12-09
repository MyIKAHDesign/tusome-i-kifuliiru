import React, { useState, useEffect } from 'react';
import { List, X } from 'lucide-react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (headings.length === 0) return;

    const observerOptions = {
      rootMargin: '-120px 0px -80% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      // Close on mobile after clicking
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      }
    }
  };

  return (
    <div className="fixed right-6 bottom-6 lg:right-8 lg:bottom-8 z-40">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:shadow-lg transition-all duration-200 hover:scale-105 group"
        aria-label="Toggle table of contents"
      >
        {isOpen ? (
          <X className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100" />
        ) : (
          <List className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100" />
        )}
      </button>

      {/* Floating TOC Panel */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Floating Card */}
          <div className="absolute bottom-16 right-0 w-72 max-w-[85vw] max-h-[60vh] bg-white dark:bg-gray-950 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                On this page
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                aria-label="Close table of contents"
              >
                <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Scrollable Content */}
            <nav className="overflow-y-auto flex-1 p-3">
              <ul className="space-y-1">
                {headings.map((heading) => {
                  const isActive = activeId === heading.id;
                  const indentLevel = heading.level - 2;
                  
                  return (
                    <li key={heading.id}>
                      <a
                        href={`#${heading.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToHeading(heading.id);
                          setIsOpen(false);
                        }}
                        className={`
                          relative block py-1.5 px-3 rounded-md text-xs transition-all duration-150
                          ${isActive
                            ? 'text-gray-900 dark:text-gray-100 font-medium bg-gray-100 dark:bg-gray-900 border-l-2 border-primary-500'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900/50'
                          }
                        `}
                        style={{
                          paddingLeft: indentLevel > 0 ? `${0.75 + indentLevel * 0.75}rem` : '0.75rem',
                        }}
                      >
                        <span className="relative z-10 line-clamp-2">{heading.text}</span>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary-500 rounded-r-full" />
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
