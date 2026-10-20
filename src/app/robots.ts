import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://despearl.com';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/profile/', '/checkout', '/cart'],
      },
      {
        userAgent: [
          'GPTBot', 
          'Google-Extended', 
          'PerplexityBot', 
          'ClaudeBot', 
          'Applebot-Extended',
          'CCBot',
          'cohere-ai'
        ],
        allow: '/',
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
