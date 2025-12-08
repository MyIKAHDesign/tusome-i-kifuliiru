import React from 'react';
import { ContentData } from '../../lib/content-schema';
import NumberLesson from './NumberLesson';
import Vocabulary from './Vocabulary';
import Lesson from './Lesson';

interface ContentRendererProps {
  content: ContentData;
}

export default function ContentRenderer({ content }: ContentRendererProps) {
  switch (content.type) {
    case 'number-lesson':
      return <NumberLesson content={content} />;
    
    case 'vocabulary':
      return <Vocabulary content={content} />;
    
    case 'lesson':
    case 'article':
      return <Lesson content={content} />;
    
    default:
      return (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <p>Content type not supported: {(content as any).type}</p>
        </div>
      );
  }
}

