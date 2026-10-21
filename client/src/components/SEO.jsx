import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL, CLIENT_TAGLINE, BRAND_NAME } from '../theme/brand';

const SEO = ({ title, description, schema, url, image }) => {
  const siteName = BRAND_NAME;
  const defaultTitle = `${BRAND_NAME} | Modern Apparel & Elevated Essentials`;
  const defaultDescription = CLIENT_TAGLINE || 'Uncompromising modern apparel, premium denim, and elevated knitwear.';
  const defaultUrl = SITE_URL;
  const defaultImage = `${defaultUrl}/gomode.jpeg`;

  const metaTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const metaDescription = description || defaultDescription;
  const metaUrl = url ? `${defaultUrl}${url}` : defaultUrl;
  const metaImage = image || defaultImage;

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={metaUrl} />
      <meta property="twitter:title" content={metaTitle} />
      <meta property="twitter:description" content={metaDescription} />
      <meta property="twitter:image" content={metaImage} />

      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
};

export default SEO;
