import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChevronDown, ExternalLink, Home, BookOpen, Info, Languages } from 'lucide-react';

interface NavItem {
  title?: string;
  type?: 'page' | 'menu' | 'link';
  href?: string;
  newWindow?: boolean;
  items?: Record<string, NavItem | string>;
}

interface HeaderNavigationProps {
  items: Record<string, NavItem | string>;
}

export default function HeaderNavigation({ items }: HeaderNavigationProps) {
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && !ref.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      });
    };

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openDropdown]);

  // Build the new navigation structure
  const buildNavigation = () => {
    const kifuliiruItems: Record<string, NavItem | string> = {};
    
    // Add Kifuliiru, Imigani, Imigeeza
    if (items.kifuliiru) {
      kifuliiruItems.kifuliiru = items.kifuliiru;
    }
    if (items.imigani) {
      kifuliiruItems.imigani = items.imigani;
    }
    if (items.imigeeza) {
      kifuliiruItems.imigeeza = items.imigeeza;
    }
    
    // Add all Bingi ku Kifuliiru items
    if (typeof items['bingi-ku-kifuliiru'] === 'object' && items['bingi-ku-kifuliiru'] !== null) {
      const bingi = items['bingi-ku-kifuliiru'] as NavItem;
      if (bingi.items) {
        Object.assign(kifuliiruItems, bingi.items);
      }
    }
    
    // Build Imwitu items (Ibufuliiru and others)
    const imwituItems: Record<string, NavItem | string> = {};
    if (typeof items.imwitu === 'object' && items.imwitu !== null) {
      const imwitu = items.imwitu as NavItem;
      if (imwitu.items) {
        Object.assign(imwituItems, imwitu.items);
      }
    }
    
    // Build Twehe items (include Tuyandikire)
    const tweheItems: Record<string, NavItem | string> = {};
    if (typeof items.twehe === 'object' && items.twehe !== null) {
      const twehe = items.twehe as NavItem;
      if (twehe.items) {
        Object.assign(tweheItems, twehe.items);
      }
    }
    // Add Tuyandikire to Twehe
    if (items.contact) {
      tweheItems.contact = items.contact;
    }
    
    return {
      home: { title: 'Home', type: 'page' as const, href: '/' },
      kifuliiru: {
        title: 'Kifuliiru',
        type: 'menu' as const,
        items: kifuliiruItems,
      },
      imwitu: {
        title: 'Imwitu',
        type: 'menu' as const,
        items: imwituItems,
      },
      twehe: {
        title: 'Twehe',
        type: 'menu' as const,
        items: tweheItems,
      },
    };
  };

  const navItems = buildNavigation();

  const getIcon = (key: string) => {
    switch (key) {
      case 'home':
        return <Home className="w-4 h-4" />;
      case 'kifuliiru':
        return <BookOpen className="w-4 h-4" />;
      case 'imwitu':
        return <BookOpen className="w-4 h-4" />;
      case 'twehe':
        return <Info className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const renderDropdown = (key: string, item: NavItem | string) => {
    if (typeof item === 'string' || !item.items) return null;

    const isOpen = openDropdown === key;
    const itemEntries = Object.entries(item.items);
    const isMegaMenu = key === 'kifuliiru';

    // For mega menu, split items into two columns
    const splitItems = (items: [string, NavItem | string][]) => {
      if (!isMegaMenu) return { left: items, right: [] };
      
      // Column 1: Kifuliiru, Imigani, Imigeeza
      const leftItems: [string, NavItem | string][] = [];
      const rightItems: [string, NavItem | string][] = [];
      
      const mainItems = ['kifuliiru', 'imigani', 'imigeeza'];
      
      items.forEach(([subKey, subItem]) => {
        if (mainItems.includes(subKey)) {
          leftItems.push([subKey, subItem]);
        } else {
          rightItems.push([subKey, subItem]);
        }
      });
      
      return { left: leftItems, right: rightItems };
    };

    const { left, right } = splitItems(itemEntries);

    return (
      <div
        key={key}
        className="relative"
        ref={(el) => {
          dropdownRefs.current[key] = el;
        }}
      >
        <button
          onClick={() => setOpenDropdown(isOpen ? null : key)}
          className={`
            flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all
            ${
              router.asPath.startsWith(`/${key}`)
                ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }
          `}
        >
          {getIcon(key)}
          <span>{item.title}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className={`
            absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 animate-in fade-in slide-in-from-top-2 duration-200
            ${isMegaMenu ? 'w-[600px] p-6' : 'w-64 py-2 max-h-96 overflow-y-auto'}
          `}>
            {isMegaMenu ? (
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-2">
                    Kifuliiru
                  </h3>
                  <div className="space-y-1">
                    {left.map(([subKey, subItem]) => {
                      const subTitle = typeof subItem === 'string' ? subItem : subItem.title || subKey;
                      const subHref = typeof subItem === 'object' && subItem.href
                        ? subItem.href
                        : `/${subKey}`;
                      const isExternal = typeof subItem === 'object' && subItem.newWindow || subHref.startsWith('http');

                      return (
                        <a
                          key={subKey}
                          href={subHref}
                          target={isExternal ? '_blank' : undefined}
                          rel={isExternal ? 'noopener noreferrer' : undefined}
                          onClick={(e) => {
                            if (!isExternal) {
                              e.preventDefault();
                              router.push(subHref).then(() => setOpenDropdown(null));
                            } else {
                              setOpenDropdown(null);
                            }
                          }}
                          className={`
                            flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors
                            ${
                              router.asPath === subHref || router.asPath.startsWith(`/${subKey}`)
                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400'
                            }
                          `}
                        >
                          <span className="flex-1">{subTitle}</span>
                          {isExternal && <ExternalLink className="w-4 h-4 opacity-50" />}
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-2">
                    Bingi ku Kifuliiru
                  </h3>
                  <div className="space-y-1">
                    {right.map(([subKey, subItem]) => {
                      const subTitle = typeof subItem === 'string' ? subItem : subItem.title || subKey;
                      const subHref = typeof subItem === 'object' && subItem.href
                        ? subItem.href
                        : `/${subKey}`;
                      const isExternal = typeof subItem === 'object' && subItem.newWindow || subHref.startsWith('http');

                      return (
                        <a
                          key={subKey}
                          href={subHref}
                          target={isExternal ? '_blank' : undefined}
                          rel={isExternal ? 'noopener noreferrer' : undefined}
                          onClick={(e) => {
                            if (!isExternal) {
                              e.preventDefault();
                              router.push(subHref).then(() => setOpenDropdown(null));
                            } else {
                              setOpenDropdown(null);
                            }
                          }}
                          className={`
                            flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors
                            ${
                              router.asPath === subHref || router.asPath.startsWith(`/${subKey}`)
                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400'
                            }
                          `}
                        >
                          <span className="flex-1">{subTitle}</span>
                          {isExternal && <ExternalLink className="w-4 h-4 opacity-50" />}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {itemEntries.map(([subKey, subItem]) => {
                  const subTitle = typeof subItem === 'string' ? subItem : subItem.title || subKey;
                  const subHref = typeof subItem === 'object' && subItem.href
                    ? subItem.href
                    : `/${subKey}`;
                  const isExternal = typeof subItem === 'object' && subItem.newWindow || subHref.startsWith('http');

                  return (
                    <a
                      key={subKey}
                      href={subHref}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      onClick={(e) => {
                        if (!isExternal) {
                          e.preventDefault();
                          router.push(subHref).then(() => setOpenDropdown(null));
                        } else {
                          setOpenDropdown(null);
                        }
                      }}
                      className={`
                        flex items-center gap-3 px-4 py-3 text-sm transition-colors
                        ${
                          router.asPath === subHref || router.asPath.startsWith(`/${subKey}`)
                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400'
                        }
                      `}
                    >
                      <span className="flex-1">{subTitle}</span>
                      {isExternal && <ExternalLink className="w-4 h-4 opacity-50" />}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderNavItem = (key: string, item: NavItem | string) => {
    if (typeof item === 'string') {
      const href = `/${key}`;
      const isActive = router.asPath === href || router.asPath.startsWith(`/${key}/`);
      
      return (
        <a
          key={key}
          href={href}
          onClick={(e) => {
            e.preventDefault();
            router.push(href);
          }}
          className={`
            flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all
            ${
              isActive
                ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }
          `}
        >
          {getIcon(key)}
          <span>{item}</span>
        </a>
      );
    }

    if (item.type === 'menu' && item.items) {
      return renderDropdown(key, item);
    }

    const href = item.href || `/${key}`;
    const isActive = router.asPath === href || router.asPath.startsWith(`/${key}/`);
    const isExternal = item.newWindow || href.startsWith('http');

    return (
      <a
        key={key}
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        onClick={(e) => {
          if (!isExternal) {
            e.preventDefault();
            router.push(href);
          }
        }}
        className={`
          flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all
          ${
            isActive
              ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
              : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }
        `}
      >
        {getIcon(key)}
        <span>{item.title}</span>
        {isExternal && <ExternalLink className="w-3 h-3 ml-1" />}
      </a>
    );
  };

  return (
    <nav className="flex items-center gap-2">
      {Object.entries(navItems).map(([key, item]) => renderNavItem(key, item))}
    </nav>
  );
}
