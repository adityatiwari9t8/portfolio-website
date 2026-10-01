import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * The public address of the site. On Vercel it is picked up automatically; anywhere else,
 * set SITE_URL (for example https://aditya.dev) before building. When it is unknown the
 * page still works, it just skips the canonical link, sitemap and absolute preview-image URLs.
 */
const siteUrl = (
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
).replace(/\/$/, '');

function seo(): Plugin {
  return {
    name: 'site-seo',
    transformIndexHtml(html) {
      if (siteUrl) return html.replaceAll('__SITE_URL__', siteUrl);
      return html
        .replace(/\s*<link rel="canonical"[^>]*>/, '')
        .replace(/\s*<meta property="og:url"[^>]*>/, '')
        .replace(/\s*"url": "__SITE_URL__\/",/, '')
        .replaceAll('__SITE_URL__', '');
    },
    generateBundle() {
      const robots = ['User-agent: *', 'Allow: /', siteUrl ? `Sitemap: ${siteUrl}/sitemap.xml` : ''].filter(Boolean).join('\n') + '\n';
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots });
      if (siteUrl) {
        const xml =
          '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          `  <url><loc>${siteUrl}/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>\n</urlset>\n`;
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: xml });
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), seo()],
  server: {
    port: 5173,
    open: true
  }
});
