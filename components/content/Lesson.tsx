import React from 'react';
import { LessonContent } from '../../lib/content-schema';
import Image from 'next/image';
import { FileText, Quote } from 'lucide-react';

interface LessonProps {
  content: LessonContent;
}

export default function Lesson({ content }: LessonProps) {
  const renderBlock = (block: any, index: number) => {
    switch (block.type) {
      case 'heading':
        const level = block.level || 2;
        const headingProps = {
          key: index,
          className: `font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8 ${
            level === 1 ? 'text-4xl' :
            level === 2 ? 'text-3xl border-b border-gray-200 dark:border-gray-700 pb-2' :
            level === 3 ? 'text-2xl' :
            'text-xl'
          }`,
          children: block.content,
        };
        
        if (level === 1) return <h1 {...headingProps} />;
        if (level === 2) return <h2 {...headingProps} />;
        if (level === 3) return <h3 {...headingProps} />;
        if (level === 4) return <h4 {...headingProps} />;
        return <h2 {...headingProps} />;

      case 'paragraph':
        return (
          <p
            key={index}
            className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6"
          >
            {block.content}
          </p>
        );

      case 'list':
        return (
          <ul
            key={index}
            className="list-disc list-inside space-y-2 mb-6 text-gray-700 dark:text-gray-300"
          >
            {block.items?.map((item: string, i: number) => (
              <li key={i} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        );

      case 'quote':
        return (
          <blockquote
            key={index}
            className="border-l-4 border-primary-600 pl-6 py-4 my-6 bg-gray-50 dark:bg-gray-800 rounded-r-lg italic text-gray-700 dark:text-gray-300"
          >
            <Quote className="w-5 h-5 text-primary-600 dark:text-primary-400 mb-2" />
            {block.content}
          </blockquote>
        );

      case 'image':
        return (
          <div key={index} className="my-8">
            <Image
              src={block.src || ''}
              alt={block.alt || ''}
              width={800}
              height={600}
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            {content.title}
          </h1>
        </div>
        {content.description && (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {content.description}
          </p>
        )}
      </div>

      {/* Content Blocks */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        {content.blocks.map((block, index) => renderBlock(block, index))}
      </div>
    </div>
  );
}

