import Image from 'next/image';

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
};

