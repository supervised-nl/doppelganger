# Site audit (spec 0.1)

P0 none. P1 is fixed in this branch. P2 stays open on purpose. This is not a redesign.

## P1 fixed

- Copy controls now announce through a live region. A bare "Copy" button takes its name from the code bar.
- The skip link is clipped until focus, so it no longer sits at `left: -9999px`.
- Primary nav links are at least 44px tall. Footer and copy controls are at least 24px.
- `prefers-reduced-motion: reduce` also turns off button and FAQ chevron transitions.
- CSS and JS comments are gone.
- Unused `tpl-prompt` and `tpl-agent` templates are gone from `/example` and `/load`.
- The 404 lede names six HTML pages plus `DOPPELGANGER.md`, `SPEC.md`, and `llms.txt`.
- The Structure table links to `/faq#accurate`.

## P2 leftover

- `--dim` and `--muted` are the same color.
- Twitter cards have no `twitter:image:alt`.
- `rel="noopener"` sits on same-tab GitHub links and does nothing.
- The 404 page canonicals to `/404`, which is not a real route.
- The nav `mask-image` fades the first item.
- `/spec` HTML and the example `<pre>` are hand copies of `SPEC.md` and `DOPPELGANGER.md`. They match today. They can drift.
- FAQ `<summary>` elements are not in the heading outline.
- The copy fallback still uses `document.execCommand("copy")`.
- ChatGPT character-cap numbers on `/load` will go stale when OpenAI changes them.
- Homepage JSON-LD FAQ is a subset of `/faq`.
