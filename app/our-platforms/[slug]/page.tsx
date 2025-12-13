import React from 'react';
import Link from 'next/link';
import SEO from '../../../components/SEO';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import { getPlatformBySlug, platforms } from '../../../lib/platforms-data';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return platforms.map((platform) => ({
    slug: platform.id,
  }));
}

export default async function PlatformDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const platform = getPlatformBySlug(resolvedParams.slug);

  if (!platform) {
    return (
      <div className="w-full">
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>Platform not found</p>
          <Link href="/our-platforms" className="text-primary-600 dark:text-primary-400 hover:underline mt-4 inline-block">
            Back to Platforms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${platform.nameKifuliiru} - ${platform.name}`}
        description={platform.description}
      />
      <div className="w-full">
        {/* Back Button */}
        <Link
          href="/our-platforms"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Platforms</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-2">
            {platform.nameKifuliiru}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            {platform.name}
          </p>
        </div>

        {/* Description */}
        <div className="mb-8 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-3">
              Description
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              {platform.detailedDescriptionKifuliiru || platform.descriptionKifuliiru}
            </p>
            <p className="text-gray-600 dark:text-gray-400 italic leading-relaxed">
              {platform.detailedDescription || platform.description}
            </p>
          </div>

          {/* Features */}
          {platform.features && platform.features.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-4">
                Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
                    English
                  </h3>
                  <ul className="space-y-2">
                    {platform.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                        <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {platform.featuresKifuliiru && platform.featuresKifuliiru.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
                      Kifuliiru
                    </h3>
                    <ul className="space-y-2">
                      {platform.featuresKifuliiru.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                          <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Use Cases */}
          {platform.useCases && platform.useCases.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-4">
                Use Cases
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
                    English
                  </h3>
                  <ul className="space-y-2">
                    {platform.useCases.map((useCase, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                        <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
                        <span>{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {platform.useCasesKifuliiru && platform.useCasesKifuliiru.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
                      Kifuliiru
                    </h3>
                    <ul className="space-y-2">
                      {platform.useCasesKifuliiru.map((useCase, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                          <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
                          <span>{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Benefits */}
          {platform.benefits && platform.benefits.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-4">
                Benefits
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
                    English
                  </h3>
                  <ul className="space-y-2">
                    {platform.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                        <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {platform.benefitsKifuliiru && platform.benefitsKifuliiru.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
                      Kifuliiru
                    </h3>
                    <ul className="space-y-2">
                      {platform.benefitsKifuliiru.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                          <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Info */}
          {(platform.additionalInfo || platform.additionalInfoKifuliiru) && (
            <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-6 border border-gray-200 dark:border-white/10">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-4">
                Additional Information
              </h2>
              {platform.additionalInfoKifuliiru && (
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  {platform.additionalInfoKifuliiru}
                </p>
              )}
              {platform.additionalInfo && (
                <p className="text-gray-600 dark:text-gray-400 italic leading-relaxed">
                  {platform.additionalInfo}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Visit Platform Button */}
        <div className="border-t border-gray-200 dark:border-white/10 pt-6">
          <a
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            <span>Visit Platform</span>
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>
    </>
  );
}

