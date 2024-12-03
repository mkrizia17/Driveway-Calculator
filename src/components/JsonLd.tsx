'use client';

import { WebSite, WithContext } from 'schema-dts'

export default function JsonLd() {
  const websiteSchema: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CalcMyDrive',
    url: 'https://www.calcmydrive.com',
    description: 'Calculate driveway costs and materials for asphalt, concrete, gravel, and paving projects',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.calcmydrive.com/search?q={search_term_string}'
    },
    sameAs: []
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
    />
  )
}