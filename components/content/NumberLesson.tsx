import React, { useState, useMemo } from 'react';
import { NumberLessonContent } from '../../lib/content-schema';
import { Calculator, Hash, Search as SearchIcon } from 'lucide-react';

interface NumberLessonProps {
  content: NumberLessonContent;
}

export default function NumberLesson({ content }: NumberLessonProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter numbers based on search term
  const filteredSections = useMemo(() => {
    if (!searchTerm.trim()) {
      return content.sections;
    }

    const lowerSearch = searchTerm.toLowerCase();
    return content.sections.map(section => ({
      ...section,
      numbers: section.numbers.filter(number => {
        const valueStr = number.value.toString();
        const kifuliiruLower = number.kifuliiru.toLowerCase();
        return valueStr.includes(lowerSearch) || kifuliiruLower.includes(lowerSearch);
      }),
    })).filter(section => section.numbers.length > 0);
  }, [content.sections, searchTerm]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <Calculator className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              {content.title}
            </h1>
            {content.range && (
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                {content.range}
              </p>
            )}
          </div>
        </div>
        {content.description && (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {content.description}
          </p>
        )}
      </div>

      {/* Search Bar */}
      <div className="sticky top-20 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 pb-4 -mx-6 px-6">
        <div className="flex items-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
          <SearchIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Looza hano... (Search by number or Kifuliiru text)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-0 outline-0 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {filteredSections.reduce((total, section) => total + section.numbers.length, 0)} result(s) found
          </p>
        )}
      </div>

      {/* Sections */}
      {filteredSections.length > 0 ? (
        filteredSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="space-y-4">
          {section.title && section.title.toLowerCase() !== 'numbers' && (
            <div className="flex items-center gap-2 mb-4">
              <Hash className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {section.title}
              </h2>
              {section.range && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({section.range})
                </span>
              )}
            </div>
          )}

          {/* Numbers Grid - Wider display with more cards per row for ukuharura pages */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {section.numbers.map((number, index) => (
              <div
                key={index}
                className="group p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {number.value.toLocaleString()}
                  </span>
                  {number.pronunciation && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                      {number.pronunciation}
                    </span>
                  )}
                </div>
                <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {number.kifuliiru}
                </div>
                {number.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
                    {number.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>No results found for "{searchTerm}"</p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-4 text-primary-600 dark:text-primary-400 hover:underline"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}

