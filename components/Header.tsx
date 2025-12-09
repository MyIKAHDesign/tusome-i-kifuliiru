'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Home, Search as SearchIcon, Menu, X, List } from 'lucide-react';
import Search from './Search';
import HeaderNavigation from './HeaderNavigation';
import ThemeSwitch from './ThemeSwitch';
import { useSidebar } from './SidebarContext';

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
  const { isOpen: isSiteNavOpen, setIsOpen: setSiteNavOpen } = useSidebar();

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
    <header className="sticky top-0 z-50 bg-gray-50/95 dark:bg-gray-950/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left Section: Site Navigation Button + Brand */}
          <div className="flex items-center gap-16">
            {/* Site Navigation Toggle Button */}
            <button
              onClick={() => setSiteNavOpen(!isSiteNavOpen)}
              className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-900 transition-colors"
              aria-label="Toggle site navigation"
            >
              <List className="w-5 h-5" />
            </button>
            
            {/* Brand Section */}
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
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col gap-4">
              <HeaderNavigation items={navMeta} />
              <div className="h-px bg-gray-200 dark:bg-gray-800" />
              <div className="flex items-center justify-between">
                <Search />
                <ThemeSwitch />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
