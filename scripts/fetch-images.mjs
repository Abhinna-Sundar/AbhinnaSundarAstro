// Downloads the pictures listed in src/data/images.yaml into public/images/remote/.
// Runs on GitHub during every build; files already present are skipped.
import fs from 'node:fs';
import yaml from 'js-yaml';

const list = yaml.load(fs.readFileSync('src/data/images.yaml', 'utf8'));
fs.mkdirSync('public/images/remote', { recursive: true });
for (const img of list) {
  const ext = (img.url.match(/\.(jpe?g|png|webp)(\?|$)/i) || [, 'jpg'])[1];
  const file = `public/images/remote/${img.id}.${ext}`;
  if (fs.existsSync(file)) continue;
  try {
    const r = await fetch(img.url, { headers: { 'User-Agent': 'personal-website-build' } });
    if (!r.ok) throw new Error(r.status);
    fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()));
    console.log('saved', file);
  } catch (e) { console.warn('skipped', img.id, e.message); }
}
