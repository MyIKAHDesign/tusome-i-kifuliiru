import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight, Search } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            <span>Learn Kifuliiru Language</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Tusome i Kifuliiru
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Discover and learn the Kifuliiru language. A comprehensive platform for learners, students, and teachers to explore this beautiful language spoken in the Eastern DRC.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Start Learning
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Search className="w-5 h-5" />
              Browse Documentation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
