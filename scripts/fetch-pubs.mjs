// Pulls your papers and citation counts from SciX/ADS and writes
// src/data/publications.json. Needs an API token in the ADS_TOKEN
// environment variable (GitHub: Settings → Secrets → Actions → ADS_TOKEN).
import fs from 'node:fs';
import yaml from 'js-yaml';

const token = process.env.ADS_TOKEN;
const OUT = 'src/data/publications.json';
if (!token) { console.log('ADS_TOKEN not set: keeping the existing publication list.'); process.exit(0); }

const cfg = yaml.load(fs.readFileSync('src/data/ads.yaml', 'utf8'));
const fl = 'bibcode,title,author,year,pub,volume,page,citation_count,property,doctype,doi,pubdate';
const API = 'https://api.adsabs.harvard.edu/v1';
const H = { Authorization: `Bearer ${token}` };
async function get(u) {
  const r = await fetch(u, { headers: H });
  if (!r.ok) throw new Error(`ADS answered ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
}

try {
  // 1. Bibcodes in your SciX library (only these are shown)
  const bibs = [];
  for (let start = 0; ; start += 200) {
    const lib = await get(`${API}/biblib/libraries/${cfg.library}?rows=200&start=${start}`);
    bibs.push(...(lib.documents || []));
    if ((lib.documents || []).length < 200) break;
  }
  const wanted = bibs.filter(b => !(cfg.exclude || []).includes(b));
  if (!wanted.length) throw new Error('the library is empty or could not be read');
  // 2. Details and citation counts for those bibcodes
  const docs = [];
  for (let i = 0; i < wanted.length; i += 50) {
    const q = 'bibcode:(' + wanted.slice(i, i + 50).map(b => `"${b}"`).join(' OR ') + ')';
    const r = await get(`${API}/search/query?` + new URLSearchParams({ q, fl, rows: '100', sort: 'date desc' }));
    docs.push(...r.response.docs);
  }
  docs.sort((a, b) => (b.pubdate || '').localeCompare(a.pubdate || ''));

  const papers = docs.map(d => {
    const props = d.property || [];
    const authors = d.author || [];
    const me = i => /^Samantaray,\s*A/i.test(authors[i] || '');
    const shown = authors.length > 3
      ? `${authors[0]}${me(0) ? '' : authors.some((a, i) => me(i)) ? ', … incl. Samantaray, A.S.' : ''}, et al.`
      : authors.join('; ');
    const status = props.includes('REFEREED') ? 'published' : d.doctype === 'eprint' ? 'preprint' : 'other';
    return {
      title: (d.title || [''])[0],
      authors: shown,
      first: me(0),
      year: +d.year,
      pub: [d.pub, d.volume, d.page?.[0]].filter(Boolean).join(', '),
      status,
      bibcode: d.bibcode,
      url: `https://scixplorer.org/abs/${encodeURIComponent(d.bibcode)}/abstract`,
      citations: d.citation_count ?? 0,
    };
  });

  const cites = papers.map(p => p.citations).sort((a, b) => b - a);
  const h = cites.filter((c, i) => c >= i + 1).length;
  const out = {
    source: 'SciX / NASA ADS',
    updated: new Date().toISOString().slice(0, 10),
    citations: cites.reduce((a, b) => a + b, 0),
    h_index: h,
    refereed: papers.filter(p => p.status === 'published').length,
    papers,
  };
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  console.log(`Wrote ${papers.length} papers, ${out.citations} citations, h=${h}.`);
} catch (e) {
  console.warn('Could not update publications, keeping the previous list:', e.message);
}
