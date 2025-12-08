import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span>Tusome i Kifuliiru {new Date().getFullYear()} ©</span>
            <a
              href="https://kifuliiru.net/"
              className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors border-b border-transparent hover:border-primary-600"
            >
              Tumenye Ibufuliiru
            </a>
          </div>
          <div>
            <a
              href="https://ayivugwekabemba.me"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors border-b border-transparent hover:border-primary-600"
            >
              By Ayivugwe Kabemba Mukome
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
