doppelganger-spec: 0.1.1

# DOPPELGÄNGER.md specification

This document is the 0.1.1 specification for `DOPPELGANGER.md`. A `DOPPELGANGER.md` file is a single Markdown file that teaches an AI to write in the voice of one person or one organization.

The file is the writing-voice counterpart to `AGENTS.md`. `AGENTS.md` tells a coding agent how to work in a repository. `DOPPELGANGER.md` tells any AI how to write as a specific person or company.

This specification uses the words MUST, SHOULD, and MAY as defined in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119).

## Status

`doppelganger-spec` version: `0.1.1`

Language of this specification: English.

License of this specification: CC0 1.0 Universal. See `LICENSE`.

## Goal

A reader pastes, attaches, or `@`-mentions one file. The model then writes in that voice instead of generic AI copy.

The file is portable. It does not depend on an account, an upload API, or a hosted loader.

## File

The canonical filename is `DOPPELGANGER.md`.

A consumer MUST treat a file with that name as a voice file when the file also carries the spec marker in Marker.

A person or organization MAY keep more than one voice file. Additional files SHOULD use a distinct directory, such as `clients/acme/DOPPELGANGER.md`. Do not invent extra top-level filenames for V1.

The file MUST be Markdown. A voice file MAY be written in any language. Meta `language` MUST be a BCP 47 tag that names that language.

The file MUST NOT include secrets. Secrets include API keys, passwords, session tokens, private URLs whose leakage would grant access, and unpublished personal data that the subject did not mean to publish.

The file MUST NOT instruct a model to invent facts, metrics, clients, employers, or case studies.

## Marker

The file MUST include the spec marker `doppelganger-spec: 0.1` or `doppelganger-spec: 0.1.1`.

Place the marker in YAML frontmatter, or place it in an HTML comment. A file MAY include both. A consumer MUST accept either form. If the file uses YAML frontmatter, the opening `---` MUST be the first bytes of the file. An HTML comment MAY follow the frontmatter block.

The marker names the specification version. It is not the content version. Content version lives in Meta.

## Sections

A conformant file is a sequence of Markdown sections. Section titles below are the canonical titles. A file MUST use these titles for the MUST sections so a human or a script can find them.

Use `##` for each section title.

### MUST

A conformant file MUST contain every section in this list, in this order: Meta, Identity, Voice fingerprint, Tone rules, Hard bans, Safety.

#### Meta

Meta MUST state the following fields.

| Field | Meaning |
| --- | --- |
| name | Display name of the person or organization |
| kind | `person` or `organization` |
| language | BCP 47 language tag that names the language of this voice file |
| version | Semver of this voice file, such as `1.0.0` |
| updated | ISO 8601 date of the last edit, such as `2026-09-16` |
| license | License of this voice file. `CC0-1.0` is recommended |

Write Meta as a list or a small table. Either form is valid.

`version` is the content version of the voice file. Bump it when the voice changes.

#### Identity

Identity MUST say who is speaking, in plain prose. Include the role, the kind of work, and what the speaker does not do when that boundary is part of the voice.

Identity is context for writing. It is not a resume, a visual brand kit, or a company handbook.

#### Voice fingerprint

Voice fingerprint MUST include 3 to 7 short writing samples from the subject. Every Voice fingerprint sample MUST be written in the language named by Meta `language`.

Each sample SHOULD name its register in a single label, such as `email`, `social`, `website`, or `proposal`.

Each sample SHOULD be real writing, lightly edited to remove secrets and third-party private data. Do not write samples that sound like generic AI copy. The point of this section is evidence of the actual voice that a model can imitate.

Prefer recent sent or published writing, such as email, posts, site pages, and blogs, over AI drafts. When the voice drifts, replace samples and bump Meta `version` and `updated`. The file does not expire. Do not require a calendar quota.

#### Tone rules

Tone rules MUST state how the voice works as instructions a model can follow. Prefer concrete rules over adjectives.

Good: "Open an email with the ask in the first paragraph."

Bad: "Be friendly and professional."

#### Hard bans

Hard bans MUST list words, phrases, and moves the model must not use.

A model follows an explicit ban more reliably than a vague tone adjective.

Include the generic AI tells the subject refuses, and any personal or company tells the subject refuses.

#### Safety

Safety MUST include all of the following rules, in the file's own words if needed, with this meaning intact:

- Do not paste or request secrets.
- Do not invent facts, metrics, clients, employers, revenue, or case studies.
- If a claim is not in this file and not supplied in the prompt, say so or ask. Do not fill the gap.

### SHOULD

A conformant file SHOULD include these sections after Safety, in this order when present: Register shifts, Before and after, Facts and claims.

#### Register shifts

Describe how the same voice changes across email, social, website, and proposal. Name the register, then state what changes: length, greeting, how direct the ask is, whether humor is allowed.

#### Before and after

Give two or more pairs. The "before" line is generic AI copy. The "after" line is the subject's voice on the same point. A model uses these pairs as a rewrite target.

#### Facts and claims

List facts the model may treat as true when writing as this subject. If a number, client, or outcome is not in this list and not in the prompt, the model MUST NOT invent it.

Keep this list short. A voice file is not a knowledge base.

### MAY

A file MAY end with a short "How to use" section.

That section SHOULD point at the load guide on the site rather than restating tool UI. One or two sentences is enough.

## What this file is not

`DOPPELGANGER.md` is voice only. It is not:

- `AGENTS.md`, which is how a coding agent works in a repo
- `BRAND.md` or Brand Context Protocol, which cover strategy, voice, and visual identity
- `COPY.md`, which is a related voice-and-bans practice without this spec
- A design system, a logo kit, or a color palette
- A hosted generator or loader
- A place for secrets

A repo MAY keep `AGENTS.md` and `DOPPELGANGER.md` side by side. `AGENTS.md` MAY tell an agent to read `DOPPELGANGER.md` before writing user-facing copy.

## Conformance

A file conforms to spec 0.1.1 when all of the following are true:

- The spec marker is `doppelganger-spec: 0.1` or `doppelganger-spec: 0.1.1`.
- Every MUST section exists with the canonical title.
- Meta includes name, kind, language, version, updated, and license.
- `kind` is `person` or `organization`.
- Meta `language` is a BCP 47 tag that names the language of the file.
- Voice fingerprint contains 3 to 7 samples.
- Every Voice fingerprint sample is in the language named by Meta `language`.
- Safety forbids secrets and invented facts.

A consumer SHOULD still use a file that is missing a SHOULD section. A consumer MAY reject a file that is missing a MUST section or the marker.

This specification does not ship a linter CLI in 0.1.1.

## Versioning

`doppelganger-spec` is the specification version. `0.1` is the first public draft. This document is `0.1.1`.

A consumer MUST accept both `0.1` and `0.1.1`. A consumer of a later spec version MUST still accept 0.1 files. New MUST sections require a new spec version.

The voice file's own `version` field is independent semver for that person's or organization's content.

## License

The text of this specification is dedicated to the public domain under CC0 1.0 Universal.
