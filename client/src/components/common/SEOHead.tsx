import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export const SEOHead = ({
  title = 'BeeDab - Real Estate Platform',
  description = 'Find your perfect property with BeeDab. Browse FSBO listings, connect with agents, and discover your dream home in Botswana.',
  keywords = 'real estate, property, FSBO, homes for sale, Botswana, buy house, sell house',
  ogTitle,
  ogDescription,
  ogImage = '/logo.jpg'
}: SEOHeadProps) => {
  useEffect(() => {
    document.title = title;

    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updatePropertyTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    updatePropertyTag('og:title', ogTitle || title);
    updatePropertyTag('og:description', ogDescription || description);
    updatePropertyTag('og:image', ogImage);
    updatePropertyTag('og:type', 'website');
    updatePropertyTag('og:url', window.location.href);

    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', ogTitle || title);
    updateMetaTag('twitter:description', ogDescription || description);
    updateMetaTag('twitter:image', ogImage);
  }, [title, description, keywords, ogTitle, ogDescription, ogImage]);

  return null;
};