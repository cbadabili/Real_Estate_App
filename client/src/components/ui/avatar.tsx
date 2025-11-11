// @ts-nocheck

import React from 'react';
import { Building2 } from 'lucide-react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
  children?: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  fallback,
  className = '',
  children
}) => {
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={`relative inline-flex items-center justify-center overflow-hidden bg-beedab-blue rounded-full ${className}`}>
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      ) : children ? (
        children
      ) : (
        <Building2 className="text-white h-1/2 w-1/2" />
      )}
    </div>
  );
};

export const AvatarImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => (
  <img {...props} />
);

export const AvatarFallback: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <span className={`text-sm font-medium text-gray-600 ${className}`} {...props}>
    {children}
  </span>
);

export default Avatar;
