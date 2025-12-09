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
    <>
      {/* Floating Toggle Button - Positioned above site nav button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-6 bottom-20 lg:right-8 lg:bottom-24 z-40 w-12 h-12 rounded-full bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:shadow-lg transition-all duration-200 hover:scale-105 group"
        aria-label="Toggle table of contents"
      >
        {isOpen ? (
          <X className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100" />
        ) : (
          <List className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100" />
        )}
      </button>

      {/* Dialog Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Dialog Card - Centered */}
          <div className="relative w-full max-w-md max-h-[70vh] bg-white dark:bg-gray-950 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-shrink-0 bg-gray-50 dark:bg-gray-900/50">
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Table of Contents
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close table of contents"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Scrollable Content */}
            <nav className="overflow-y-auto flex-1 p-4 min-h-0">
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
                          relative block py-2 px-3 rounded-md text-sm transition-all duration-150
                          ${isActive
                            ? 'text-gray-900 dark:text-gray-100 font-medium bg-gray-100 dark:bg-gray-900 border-l-2 border-primary-500'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900/50'
                          }
                        `}
                        style={{
                          paddingLeft: indentLevel > 0 ? `${1 + indentLevel * 1}rem` : '0.75rem',
                        }}
                      >
                        <span className="relative z-10">{heading.text}</span>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary-500 rounded-r-full" />
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
