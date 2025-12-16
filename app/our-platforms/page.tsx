import React from 'react';
import Link from 'next/link';
import SEO from '../../components/SEO';
import { ExternalLink, Info } from 'lucide-react';
import { platforms } from '../../lib/platforms-data';

export default function OurPlatformsPage() {
  return (
    <>
      <SEO
        title="Mikolwa yitu yindi - Our Other Platforms"
        description="Discover other Kifuliiru language platforms and resources"
      />
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4">
            Mikolwa yitu yindi
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            Our Other Platforms
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Tugweti mikolwa yindi yingi yitugwasa tumenye na tugendereze indeto yitu Kifuliiru. 
            Bino bikolwa byoshi bikolwa bya Kifuliiru Lab, bikugwasa tumenye bingi ku ndeto yitu na mu ndeto yitu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platforms.map((platform) => (
            <div
              key={platform.url}
              className="border border-gray-200 dark:border-white/10 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white dark:bg-white/5"
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                  {platform.nameKifuliiru}
                </h2>
                <ExternalLink className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2" />
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                {platform.descriptionKifuliiru}
              </p>
              
              <p className="text-gray-500 dark:text-gray-500 mb-4 text-sm italic">
                {platform.description}
              </p>
              
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
                <Link
                  href={`/our-platforms/${platform.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-400 dark:hover:border-gray-500 font-medium transition-colors"
                >
                  <Info className="w-4 h-4" />
                  <span>Learn More</span>
                </Link>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                >
                  <span>Visit Platform</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

