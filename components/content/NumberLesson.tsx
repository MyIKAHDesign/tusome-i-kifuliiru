import React from 'react';
import { NumberLessonContent } from '../../lib/content-schema';
import { Calculator, Hash } from 'lucide-react';

interface NumberLessonProps {
  content: NumberLessonContent;
}

export default function NumberLesson({ content }: NumberLessonProps) {
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

      {/* Sections */}
      {content.sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="space-y-4">
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

          {/* Numbers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      ))}
    </div>
  );
}

