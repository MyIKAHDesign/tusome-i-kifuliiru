import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    img: (props) => (
      <Image
        {...props}
        alt={props.alt || ''}
        width={800}
        height={600}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    ),
    ...components,
  };
}

