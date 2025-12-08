import React, { useState } from 'react';
import { VocabularyContent } from '../../lib/content-schema';
import { BookOpen, Search, Globe } from 'lucide-react';

interface VocabularyProps {
  content: VocabularyContent;
}

export default function Vocabulary({ content }: VocabularyProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = Array.from(
    new Set(content.words.map(w => w.category).filter(Boolean))
  ) as string[];

  const filteredWords = content.words.filter(word => {
    const matchesSearch = 
      word.kifuliiru.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.english?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.french?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.swahili?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || word.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              {content.title}
            </h1>
          </div>
        </div>
        {content.description && (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {content.description}
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Looza amagambo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        {categories.length > 0 && (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        )}
      </div>

      {/* Words Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWords.map((word, index) => (
          <div
            key={index}
            className="group p-5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-primary-600 dark:text-primary-400">
                {word.kifuliiru}
              </h3>
              {word.category && (
                <span className="text-xs px-2 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400">
                  {word.category}
                </span>
              )}
            </div>
            
            <div className="space-y-2">
              {word.english && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>EN:</strong> {word.english}
                  </span>
                </div>
              )}
              {word.french && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>FR:</strong> {word.french}
                  </span>
                </div>
              )}
              {word.swahili && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>SW:</strong> {word.swahili}
                  </span>
                </div>
              )}
              {word.pronunciation && (
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                  [{word.pronunciation}]
                </p>
              )}
              {word.example && (
                <p className="text-sm text-gray-600 dark:text-gray-400 italic mt-2 border-l-2 border-primary-200 dark:border-primary-800 pl-3">
                  "{word.example}"
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredWords.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>Ndabyo twaloonga</p>
        </div>
      )}
    </div>
  );
}

