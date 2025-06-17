import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  decoding?: 'async' | 'sync' | 'auto';
  sizes?: string;
}

/**
 * OptimizedImage component that:
 * 1. Automatically generates WebP version paths from original images
 * 2. Uses picture tag with srcset for responsive images
 * 3. Supports lazy loading and other performance attributes
 */
export const OptimizedImage = ({
  src,
  alt,
  className = '',
  width = 1200,
  height = 800,
  loading = 'lazy',
  fetchPriority = 'auto',
  decoding = 'async',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}: OptimizedImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [webpSrc, setWebpSrc] = useState('');
  const [srcSet, setSrcSet] = useState('');
  
  useEffect(() => {
    // For now, just use the original image since we haven't generated WebP versions yet
    // Later we can uncomment this code once the optimization script has been run
    
    /*
    // Generate WebP path from original image path
    const generateWebpPath = (originalPath: string) => {
      const pathParts = originalPath.split('.');
      const extension = pathParts.pop();
      const basePath = pathParts.join('.');
      
      // If already a WebP, use as is
      if (extension?.toLowerCase() === 'webp') return originalPath;
      
      // For local images, we'll assume WebP versions exist at /images/webp/
      const fileName = basePath.split('/').pop();
      return `/images/webp/${fileName}.webp`;
    };
    
    // Generate responsive srcset for different screen sizes
    const generateSrcSet = (imagePath: string) => {
      const pathParts = imagePath.split('.');
      const extension = pathParts.pop() || '';
      const basePath = pathParts.join('.');
      
      return `${basePath}-sm.${extension} 640w, ${basePath}-md.${extension} 768w, ${basePath}-lg.${extension} 1024w, ${imagePath} 1200w`;
    };
    
    setWebpSrc(generateWebpPath(src));
    setSrcSet(generateSrcSet(src));
    */
    
    // Just use the original image for now
    setWebpSrc(""); // No WebP version yet
    setSrcSet(""); // No responsive versions yet
  }, [src]);
  
  // Handle image load error - fallback to original source
  const handleError = () => {
    if (imgSrc !== src) {
      setImgSrc(src);
    }
  };
  

  
  return (
    <picture>
      {/* WebP format for browsers that support it */}
      <source
        srcSet={webpSrc}
        type="image/webp"
        sizes={sizes}
      />
      
      {/* Original format as fallback */}
      <img
        src={imgSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding={decoding}
        onError={handleError}
      />
    </picture>
  );
};

export default OptimizedImage;
