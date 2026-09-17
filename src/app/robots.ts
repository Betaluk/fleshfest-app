import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/'], // Protege suas áreas privadas de aparecerem no Google
    },
    sitemap: 'https://flashfest.com.br/sitemap.xml',
  };
}