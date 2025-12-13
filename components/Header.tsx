'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Search as SearchIcon, Menu, X, Mail } from 'lucide-react';
import Search from './Search';
import HeaderNavigation from './HeaderNavigation';
import MobileNavigation from './MobileNavigation';
import ThemeSwitch from './ThemeSwitch';

interface MetaItem {
  title?: string;
  type?: 'page' | 'menu';
  href?: string;
  newWindow?: boolean;
  items?: Record<string, MetaItem>;
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [navMeta, setNavMeta] = useState<Record<string, MetaItem | string>>({});

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const response = await fetch('/api/meta');
        if (response.ok) {
          const parsed = await response.json();
          setNavMeta(parsed);
        }
      } catch (error) {
        console.error('Error loading meta.json:', error);
      }
    };
    loadMeta();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-gray-50/95 dark:bg-white/5 dark:backdrop-blur-xl border-b border-gray-200 dark:border-white/10 shadow-sm dark:shadow-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left Section: Brand */}
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center transition-all duration-300">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-50">
                  Tusome i Kifuliiru
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">
                  Learn Kifuliiru Language
                </p>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4">
            <HeaderNavigation items={navMeta} />
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />
            <Search />
            <ThemeSwitch />
            {/* Contact Us Button */}
            <a
              href="https://www.kifuliiru.com/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Us</span>
            </a>
          </nav>

          {/* Mobile Right Section */}
          <div className="flex items-center gap-2 lg:hidden">
            <Search />
            <ThemeSwitch />
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 dark:backdrop-blur-sm transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-white/10">
            <div className="flex flex-col gap-4">
              <MobileNavigation items={navMeta} />
              <div className="h-px bg-gray-200 dark:bg-white/10 my-2" />
              {/* Contact Us Button - Mobile */}
              <a
                href="https://www.kifuliiru.com/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Mail className="w-4 h-4" />
                <span>Contact Us</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
