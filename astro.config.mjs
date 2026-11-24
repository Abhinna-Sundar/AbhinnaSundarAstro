import { defineConfig } from 'astro/config';
// SITE: change to your own domain once it is connected (see README, step 5).
export default defineConfig({
  site: process.env.SITE_URL || 'https://abhinna-sundar.github.io',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
});
