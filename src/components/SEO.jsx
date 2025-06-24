import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = '',
  description = '',
  imageUrl = '',
  url = '',
  canonical = '',
  siteUrl = '',
}) => {
  const defaultTitle = 'Clã WKZ Oficial - Comunidade Gamer';
  const defaultDescription =
    'Portal oficial da comunidade gamer Clã WKZ Oficial. Focado em criar conexões reais entre jogadores de FPS para se divertirem sem cobranças ou competitividade extrema.';
  const defaultImageUrl = '/og-image.png';

  const origin = siteUrl || (typeof window !== 'undefined' ? window.location.origin : '');

  const fullTitle = title ? `${title} | WKZ Oficial` : defaultTitle;
  const fullDescription = description || defaultDescription;
  const fullImage = `${origin}${imageUrl || defaultImageUrl}`;
  const fullUrl = `${origin}${url || ''}`;
  const canonicalUrl = canonical ? `${origin}${canonical}` : fullUrl;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="robots" content="index, follow" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
};

export default SEO;
