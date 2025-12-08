import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';

function normalizeImageSrc(src: string | undefined): string {
  if (!src) return '/';
  
  // If it's already an absolute URL, return as is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  
  // If it starts with /, it's already absolute
  if (src.startsWith('/')) {
    return src;
  }
  
  // Handle relative paths
  // Remove all ../ and ./ prefixes
  let normalized = src.replace(/^(\.\.\/)+/, '').replace(/^\.\//, '');
  
  // Ensure it starts with / for absolute paths
  if (!normalized.startsWith('/')) {
    normalized = '/' + normalized;
  }
  
  return normalized;
}

export function useMDXComponents(components: Partial<MDXComponents>): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    img: (props) => {
      const normalizedSrc = normalizeImageSrc(props.src);
      
      // For external URLs, use regular img tag
      if (normalizedSrc.startsWith('http://') || normalizedSrc.startsWith('https://')) {
        return (
          <img
            {...props}
            src={normalizedSrc}
            alt={props.alt || ''}
            style={{ maxWidth: '100%', height: 'auto', ...props.style }}
          />
        );
      }
      
      // For local images, use Next.js Image
      return (
        <Image
          {...props}
          src={normalizedSrc}
          alt={props.alt || ''}
          width={props.width || 800}
          height={props.height || 600}
          style={{ maxWidth: '100%', height: 'auto', ...props.style }}
        />
      );
    },
    ...components,
  };
}

