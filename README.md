# Abhinna's website

Built with [Astro](https://astro.build). Hosted free on GitHub Pages. Every push to `main` rebuilds and publishes the site, and every Monday it refreshes papers and citations from SciX/ADS.

## Where everything lives

| What you want to change | File |
|---|---|
| Name, headline, rotating roles, links, email, font | `src/data/profile.yaml` |
| Your photo | `public/images/me.jpg` (square, ≥ 800 px) |
| CV | `public/cv.pdf` (replace the file, keep the name) |
| Research projects and their pictures | `src/data/research.yaml` |
| Data & ML case studies | `src/data/projects.yaml` |
| Papers not yet on SciX (submitted / in prep) | `src/data/manual-papers.yaml` |
| SciX/ADS search used for the paper list | `src/data/ads.yaml` |
| Travel countries, places, stories, photos | `src/data/travel.yaml` + photos in `public/images/travel/` |
| About text and timeline | `src/data/timeline.yaml` |
| Blog posts | `src/content/blog/*.md` (one file per post) |
| Pictures from NASA/ESO/ESA (with credits) | `src/data/images.yaml` |
| Your own figures (plots from papers) | put PNG/JPG/SVG in `public/images/figures/` and use `/images/figures/name.png` |
| Colours and layout | `src/styles/global.css` (top of file) |

`src/data/publications.json` is written automatically. Don't edit it by hand.

## Editing: the 3-step routine

1. Open the file in GitHub (click it → pencil icon) or locally in VS Code.
2. Change the text between the quotes and keep the indentation as it is. YAML is picky about spaces.
3. Commit ("Commit changes" on GitHub, or `git add -A && git commit -m "…" && git push`). The site is live again 1–2 minutes later. Progress shows under the repository's **Actions** tab.

### Write a new blog post
Copy `src/content/blog/phd-positions-in-astronomy-and-astrophysics.md`, rename it (the file name becomes the URL), change the header:

```yaml
---
title: "My new post"
date: 2026-12-01
description: "One sentence shown on the Writing page."
tags: [data science, careers]
cover: /images/figures/my-cover.png    # or an id from images.yaml, e.g. ngc330
---
```
Then write the post in Markdown underneath.

### Add a country to Travel
In `src/data/travel.yaml`, copy one country block and change `id` (ISO numeric, e.g. Austria = "040"), `iso` (AT), `name`, `continent` and its places. Coordinates: right-click a spot in Google Maps and click the numbers to copy them.

### Add a NASA/ESO picture
Add an entry to `src/data/images.yaml` with a direct `.jpg` link and the credit line from the image page, then use its `id` anywhere an `image:` is asked for. ESO, ESA/Hubble and ESA/Webb images are CC BY 4.0 (credit required). NASA images are generally free to use with credit.

### Change the font
In `profile.yaml`, set `font:` to one of `sora-inter`, `space-grotesk-plex`, `fraunces-inter`, `instrument`, `dm`, `outfit-manrope`, `jakarta`, `syne-inter`.

## One-time setup (go live)

1. **Push this folder to GitHub.** Run this in Terminal from the folder:
   `git add -A && git commit -m "New Astro website" && git push`
2. **Turn on Pages.** In the repository go to Settings → Pages → Build and deployment → Source: **GitHub Actions**.
3. **Connect SciX/ADS so papers update by themselves.**
   1. Log in at https://scixplorer.org → Settings → API Token → generate a token.
   2. In GitHub go to Settings → Secrets and variables → Actions → New repository secret. Name it `ADS_TOKEN` and paste the token as the value.
   3. Claim your papers on SciX through ORCID (SciX → ORCID), so the ORCID search finds them all.
4. **First run.** Actions tab → "Build and publish website" → Run workflow. When it's green, the site is live at `https://abhinna-sundar.github.io/AbhinnaSundarAstro/`. Set the repository variable `BASE_PATH` to `/AbhinnaSundarAstro` until you add a custom domain. Alternatively, rename the repository to `Abhinna-Sundar.github.io` so the site sits at the root.
5. **Custom domain (optional, ~€10–15/year).**
   1. Buy or renew the domain at a registrar (Cloudflare Registrar, Porkbun, Namecheap, INWX…).
   2. In the registrar's DNS settings add four `A` records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, and a `CNAME` record `www` → `abhinna-sundar.github.io`.
   3. In GitHub go to Settings → Pages → Custom domain, enter `www.yourdomain.com`, then tick **Enforce HTTPS** once it's offered.
   4. In Settings → Secrets and variables → Actions → Variables, set `SITE_URL` = `https://www.yourdomain.com` and `BASE_PATH` = `/`.

## Run it on your laptop (optional)
```
npm install
npm run dev        # opens http://localhost:4321 and reloads as you edit
```
