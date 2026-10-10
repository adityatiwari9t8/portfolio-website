import { defineConfig, loadEnv, Plugin } from 'vite';
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

/**
 * `npm run dev` has no Vercel runtime, so this serves the /api functions through Vite's module loader,
 * with the same Web Request/Response signature Vercel uses. Variables from .env.local (GEMINI_API_KEY)
 * are made visible to them. Production is unaffected: Vercel runs /api itself.
 */
function devApi(): Plugin {
  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      for (const [key, value] of Object.entries(loadEnv(server.config.mode, process.cwd(), ''))) {
        process.env[key] ??= value;
      }
      server.middlewares.use('/api/chat', async (req, res) => {
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers)) {
          if (typeof value === 'string') headers.set(key, value);
        }
        const request = new Request(`http://localhost${req.originalUrl ?? '/api/chat'}`, {
          method: req.method,
          headers,
          body: req.method === 'GET' || req.method === 'HEAD' ? undefined : new Uint8Array(Buffer.concat(chunks))
        });
        const { default: handler } = await server.ssrLoadModule('/api/chat.ts');
        const response: Response = await handler.fetch(request);
        res.statusCode = response.status;
        response.headers.forEach((value, key) => res.setHeader(key, value));
        const reader = response.body?.getReader();
        for (let part = await reader?.read(); part && !part.done; part = await reader!.read()) res.write(part.value);
        res.end();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), seo(), devApi()],
  server: {
    port: 5173,
    open: true
  }
});
