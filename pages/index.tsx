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
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/docs"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold text-base shadow-lg hover:shadow-2xl hover:bg-primary-700 active:bg-primary-800 transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 border border-primary-700 hover:border-primary-800 active:border-primary-900 leading-none"
            >
              <span className="relative z-10 flex items-center">Start Learning</span>
              <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1 flex-shrink-0" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </Link>
            <Link
              href="/docs"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-base shadow-md hover:shadow-lg hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-950 leading-none"
            >
              <Search className="w-5 h-5 transition-transform group-hover:scale-110 flex-shrink-0" />
              <span className="flex items-center">Browse Documentation</span>
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
