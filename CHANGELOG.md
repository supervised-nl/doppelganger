# Changelog

Spec editions of `doppelganger-spec`. Newest first. The current text lives at `/spec/`. Frozen 0.1 lives at `/spec/0.1/`.

## 0.1.2

Current edition. Marker `doppelganger-spec: 0.1.2`. A consumer MUST accept `0.1`, `0.1.1`, and `0.1.2`.

Landed on 2026-09-19 in `0082c6e` after consumer obligations and file precedence. Later 0.1.2 commits kept the same marker and added consent and license-choice rules, countable Voice fingerprint samples, the Safety to Limits rename, register / tone / size rules, and the `tools/lint.mjs` CLI.

## 0.1.1

Marker `doppelganger-spec: 0.1.1`. Landed on 2026-09-19 in `5b54229` (Task 2). Spec prose stays English. A voice file MAY use any language. Meta `language` MUST be a BCP 47 tag that names that language. Voice fingerprint samples MUST be in that language. A consumer MUST accept `0.1` and `0.1.1`.

No frozen HTML URL in this change.

## 0.1

First public draft. Marker `doppelganger-spec: 0.1`. Landed on 2026-09-18 in `ae797d2`. The voice file MUST be English. The sixth MUST section is titled Safety. Frozen HTML is the last 0.1-labeled site page, `6804559:docs/spec/index.html`. Frozen Markdown is `ae797d2:SPEC.md`, which equals `6804559:SPEC.md`.
