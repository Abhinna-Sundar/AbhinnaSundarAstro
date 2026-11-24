import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const D = 'src/data/';
export const load = f => yaml.load(fs.readFileSync(D + f, 'utf8'));
export const profile = load('profile.yaml');
export const research = load('research.yaml');
export const projects = load('projects.yaml');
export const travel = load('travel.yaml');
export const about = load('timeline.yaml');
export const manualPapers = load('manual-papers.yaml');
export const pubs = JSON.parse(fs.readFileSync(D + 'publications.json', 'utf8'));
const images = load('images.yaml');

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = p => (p && p.startsWith('/') ? base + p : p);

// Resolve an image reference: an id from images.yaml, or a path in /public.
export function img(ref) {
  if (!ref) return null;
  if (ref.startsWith('/')) return fs.existsSync(path.join('public', ref)) ? { src: url(ref) } : null;
  const meta = images.find(i => i.id === ref);
  if (!meta) return null;
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    const p = `/images/remote/${ref}.${ext}`;
    if (fs.existsSync(path.join('public', p))) return { ...meta, src: url(p) };
  }
  return { ...meta, src: null };   // not downloaded yet → placeholder with credit
}

export const fonts = {
  // name: [display family, body family]
  'sora-inter':            ['Sora', 'Inter'],
  'space-grotesk-plex':    ['Space Grotesk', 'IBM Plex Sans'],
  'fraunces-inter':        ['Fraunces', 'Inter'],
  'instrument':            ['Instrument Serif', 'Instrument Sans'],
  'dm':                    ['DM Serif Display', 'DM Sans'],
  'outfit-manrope':        ['Outfit', 'Manrope'],
  'jakarta':               ['Plus Jakarta Sans', 'Plus Jakarta Sans'],
  'syne-inter':            ['Syne', 'Inter'],
};
