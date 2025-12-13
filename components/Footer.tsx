import React from 'react';
import ThemeSwitch from './ThemeSwitch';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:backdrop-blur-xl mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Mobile Layout - Stacked Vertically */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-4">
          {/* Copyright Section */}
          <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="text-gray-600 dark:text-gray-400">{new Date().getFullYear()} ©</span>
            <a
              href="https://kifuliiru.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-gray-50 transition-colors px-2 py-1.5 -mx-2 -my-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-white/10"
            >
              Kifuliiru Lab
            </a>
          </div>
          
          {/* Divider - Only visible on mobile */}
          <div className="lg:hidden w-full h-px bg-gray-200 dark:bg-white/10" />
          
          {/* Right Section - Theme Switch */}
          <div className="flex items-center justify-center w-full sm:w-auto">
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </footer>
  );
}
