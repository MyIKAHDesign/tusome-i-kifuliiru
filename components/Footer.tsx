import React from 'react';
import ThemeSwitch from './ThemeSwitch';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span>{new Date().getFullYear()} ©</span>
            <a
              href="https://kifuliiru.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-gray-50 transition-colors border-b border-transparent hover:border-gray-400 dark:hover:border-gray-600"
            >
              Kifuliiru Lab
            </a>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitch />
            <a
              href="https://ayivugwekabemba.me"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-gray-50 transition-colors border-b border-transparent hover:border-gray-400 dark:hover:border-gray-600"
            >
              By Ayivugwe Kabemba Mukome
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
