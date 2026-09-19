# DOPPELGÄNGER.md

`DOPPELGANGER.md` is an open Markdown voice file for any AI. One file teaches a model to write as one person or one organization. It is the writing-voice counterpart to `AGENTS.md`. Paste it, attach it, or `@DOPPELGANGER.md`. The file is portable. It does not need an account, an upload API, or a hosted loader.

## How to use

1. Put [DOPPELGANGER.md](DOPPELGANGER.md) in the project root, or in a distinct directory such as `clients/acme/DOPPELGANGER.md`. Do not invent extra top-level filenames for spec 0.1.1.
2. Paste the file, attach it, or `@DOPPELGANGER.md`.
3. Tell the model to write as this voice and to follow Hard bans and Safety.
The committed [DOPPELGANGER.md](DOPPELGANGER.md) is a fictional format example. Author a real file against [SPEC.md](SPEC.md).

## Spec

Spec 0.1.1. The specification is written in English. A voice file MAY use any language. Canonical filename: `DOPPELGANGER.md`. Marker: `doppelganger-spec: 0.1.1`. A consumer MUST accept both `0.1` and `0.1.1`. License: CC0 1.0 Universal. See [SPEC.md](SPEC.md) and [LICENSE](LICENSE).

Required sections, in this order:

- Meta
- Identity
- Voice fingerprint (3 to 7 samples in the language named by Meta `language`)
- Tone rules
- Hard bans
- Safety

Recommended after Safety: Register shifts, Before and after, Facts and claims. Optional last section: How to use.

Voice only. Not `AGENTS.md`, not a visual brand kit, not a knowledge base, and not a place for secrets. The file must not instruct a model to invent facts, metrics, clients, or case studies.

## Website

Documentation lives at [doppelganger.md](https://doppelganger.md). The site lives in `docs/`. Set the Cloudflare Pages Root directory to `docs`. Preview the static site with `python3 -m http.server 4173` from `docs/`.

