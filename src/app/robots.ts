import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/', '/e/', '/g/'], // Protege áreas privadas, câmeras e galerias de clientes
    },
    sitemap: 'https://flashfest.com.br/sitemap.xml',
  };
}