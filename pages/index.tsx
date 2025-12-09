import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, ArrowRight, Search } from 'lucide-react';
import PageNavigation from '../components/PageNavigation';

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
          
          {/* Flag Image */}
          <div className="flex justify-center mb-6">
            <Image
              src="/.github/DRCongo.png"
              alt="DR Congo Flag"
              width={400}
              height={267}
              className="rounded-lg shadow-lg"
              priority
            />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Tusome i Kifuliiru
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Discover and learn the Kifuliiru language. A comprehensive platform for learners, students, and teachers to explore this beautiful language spoken in the Eastern DRC.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/docs"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm rounded-md shadow-sm hover:shadow transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Start Learning
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium text-sm rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm hover:shadow transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <Search className="w-4 h-4" />
              Browse Documentation
            </Link>
          </div>
        </div>
        
        {/* Page Navigation */}
        <div className="mt-12">
          <PageNavigation currentSlug="" />
        </div>
      </section>
    </>
  );
}
