import Image from 'next/image';
import React from 'react';

function normalizeImageSrc(src: string | undefined): string {
  if (!src) return '/';
  
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  
  if (src.startsWith('/')) {
    return src;
  }
  
  let normalized = src.replace(/^(\.\.\/)+/, '').replace(/^\.\//, '');
  
  if (!normalized.startsWith('/')) {
    normalized = '/' + normalized;
  }
  
  return normalized;
}

// Generate ID from heading text
const generateHeadingId = (text: string): string => {
  if (typeof text !== 'string') {
    // If text is React node, try to extract string
    if (React.isValidElement(text)) {
      text = text.props?.children || '';
    } else {
      text = String(text);
    }
  }
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const mdxComponents = {
  img: (props: any) => {
    const normalizedSrc = normalizeImageSrc(props.src);
    
    if (normalizedSrc.startsWith('http://') || normalizedSrc.startsWith('https://')) {
      return (
        <img
          {...props}
          src={normalizedSrc}
          alt={props.alt || ''}
          className="max-w-full h-auto rounded-lg my-8 shadow-lg"
        />
      );
    }
    
    return (
      <Image
        {...props}
        src={normalizedSrc}
        alt={props.alt || ''}
        width={props.width || 800}
        height={props.height || 600}
        className="max-w-full h-auto rounded-lg my-8 shadow-lg"
      />
    );
  },
  h1: ({ children, ...props }: any) => {
    const text = typeof children === 'string' ? children : React.Children.toArray(children).join('');
    const id = generateHeadingId(text);
    return <h1 id={id} className="scroll-mt-24" {...props}>{children}</h1>;
  },
  h2: ({ children, ...props }: any) => {
    const text = typeof children === 'string' ? children : React.Children.toArray(children).join('');
    const id = generateHeadingId(text);
    return <h2 id={id} className="scroll-mt-24" {...props}>{children}</h2>;
  },
  h3: ({ children, ...props }: any) => {
    const text = typeof children === 'string' ? children : React.Children.toArray(children).join('');
    const id = generateHeadingId(text);
    return <h3 id={id} className="scroll-mt-24" {...props}>{children}</h3>;
  },
  h4: ({ children, ...props }: any) => {
    const text = typeof children === 'string' ? children : React.Children.toArray(children).join('');
    const id = generateHeadingId(text);
    return <h4 id={id} className="scroll-mt-24" {...props}>{children}</h4>;
  },
};
