import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/settings', '/notifications', '/api/', '/auth/'],
      },
    ],
    sitemap: 'https://cfbsocial.com/sitemap.xml',
  };
}
