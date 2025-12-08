// Content type definitions for JSON-based content system

export type ContentType = 
  | 'number-lesson' 
  | 'vocabulary' 
  | 'lesson' 
  | 'article'
  | 'exercise';

export interface NumberEntry {
  value: number;
  kifuliiru: string;
  pronunciation?: string;
  notes?: string;
}

export interface NumberSection {
  title: string;
  range: string;
  numbers: NumberEntry[];
}

export interface NumberLessonContent {
  type: 'number-lesson';
  title: string;
  description?: string;
  range: string;
  sections: NumberSection[];
}

export interface VocabularyEntry {
  kifuliiru: string;
  english?: string;
  french?: string;
  swahili?: string;
  pronunciation?: string;
  category?: string;
  example?: string;
}

export interface VocabularyContent {
  type: 'vocabulary';
  title: string;
  description?: string;
  words: VocabularyEntry[];
}

export interface TextBlock {
  type: 'heading' | 'paragraph' | 'list' | 'quote' | 'image';
  content: string | string[];
  level?: number; // for headings
  items?: string[]; // for lists
  src?: string; // for images
  alt?: string; // for images
}

export interface LessonContent {
  type: 'lesson' | 'article';
  title: string;
  description?: string;
  blocks: TextBlock[];
}

export interface ExerciseContent {
  type: 'exercise';
  title: string;
  description?: string;
  questions: Array<{
    question: string;
    type: 'multiple-choice' | 'fill-blank' | 'translation';
    options?: string[];
    correctAnswer: string | number;
    explanation?: string;
  }>;
}

export type ContentData = 
  | NumberLessonContent 
  | VocabularyContent 
  | LessonContent 
  | ExerciseContent;

export interface ContentItem {
  id: string;
  slug: string;
  title: string;
  contentType: ContentType;
  data: ContentData;
  metadata?: {
    author?: string;
    createdAt?: string;
    updatedAt?: string;
    tags?: string[];
  };
}

