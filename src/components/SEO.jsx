import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({ title, description, imageUrl, url }) => {
  const defaultTitle = 'Clã WKZ Oficial - Comunidade Gamer';
  const defaultDescription = 'Portal oficial da comunidade gamer Clã WKZ Oficial. Focado em criar conexões reais entre jogadores de FPS para se divertirem sem cobranças ou competitividade extrema.';
  const defaultImageUrl = '/og-image.png'; 
  const siteUrl = window.location.origin;

  const seo = {
    title: title ? `${title} | WKZ Oficial` : defaultTitle,
    description: description || defaultDescription,
    image: `${siteUrl}${imageUrl || defaultImageUrl}`,
    url: `${siteUrl}${url || ''}`,
  };

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="robots" content="index, follow" />
      
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content="website" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
    </Helmet>
  );
};

export default SEO;