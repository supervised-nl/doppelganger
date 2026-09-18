# doppelganger.md — site

Static site for the DOPPELGÄNGER.md voice-file convention. Plain HTML, CSS, JS and two
self-hosted variable fonts. No build step, no framework, no runtime.

## Layout

```
index.html              home
structure/index.html    the ten sections, drawn and tabled
load/index.html         per-tool load steps
example/index.html      the full example voice file
faq/index.html          aliases, neighbours, limits
spec/index.html         specification 0.1
404.html
assets/site.css         one stylesheet
assets/site.js          copy buttons and the fig. 1 draw-in
assets/fonts/           Archivo and JetBrains Mono, latin subsets, variable woff2
DOPPELGANGER.md         example voice file, served as text/plain
SPEC.md                 specification source, served as text/plain
llms.txt                machine summary
robots.txt, sitemap.xml
_headers                Cloudflare Pages: content types, caching, CSP
favicon.svg, og.png
LICENSE                 CC0 1.0
.nojekyll               GitHub Pages: do not run Jekyll
```

## Preview

Clean URLs need a server that resolves a directory to its `index.html`:

```
python3 -m http.server 4173
```

Then open http://127.0.0.1:4173/. Opening `index.html` straight from the filesystem works
too, but `/structure` and the other links will not resolve.

## Deploy

**Cloudflare Pages.** Point the project at this directory, leave the build command empty,
and set the output directory to the repo root or wherever these files live. `_headers` does
the rest: `.md` is served as `text/plain`, `/assets/*` gets a one-year immutable cache, and
the CSP allows only same-origin assets.

**GitHub Pages.** Works as-is because of `.nojekyll`. GitHub Pages ignores `_headers`, so
`.md` files will download rather than render as plain text in the browser. Do not add a
`CNAME` file here; the apex is handled outside the repo.

## Editing

`DOPPELGANGER.md` and `SPEC.md` are the source of truth. The example page embeds
`DOPPELGANGER.md` verbatim and the spec page is rendered from `SPEC.md`, so change the
Markdown first and regenerate rather than editing the HTML by hand.

Section titles and levels live in one registry that feeds both the drawing and the table on
`/structure`, so the figure and the spec cannot drift apart.

## SEO, GEO, AEO

- Unique title, description and canonical per page. OG and Twitter cards on every page.
- JSON-LD `@graph` per page: `WebSite`, `WebPage`, `BreadcrumbList`, plus `TechArticle`,
  `HowTo`, `ItemList` or `FAQPage` where the page content actually matches.
- Answer-first structure. Each page opens with a self-contained paragraph that names the
  entity, which is what answer engines lift.
- `llms.txt` carries the same facts in plain text for crawlers that prefer it.
- Alias coverage for tone of voice, brand voice, voice map, voice.md and write-like-me.

## License

CC0 1.0 Universal. Public domain.
