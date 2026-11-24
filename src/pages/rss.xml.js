import { getCollection } from 'astro:content';
export async function GET(ctx) {
  const posts = (await getCollection('blog', p => !p.data.draft)).sort((a, b) => b.data.date - a.data.date);
  const base = new URL(import.meta.env.BASE_URL, ctx.site);
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const items = posts.map(p => `<item><title>${esc(p.data.title)}</title><link>${new URL(`writing/${p.id}/`, base)}</link><pubDate>${p.data.date.toUTCString()}</pubDate><description>${esc(p.data.description)}</description></item>`).join('');
  return new Response(`<?xml version="1.0"?><rss version="2.0"><channel><title>Writing</title><link>${base}</link><description>Notes and guides</description>${items}</channel></rss>`, { headers: { 'Content-Type': 'application/rss+xml' } });
}
