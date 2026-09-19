doppelganger-spec: 0.1.2

# DOPPELGÄNGER.md specification

This document is the 0.1.2 specification for `DOPPELGANGER.md`. A `DOPPELGANGER.md` file is a single Markdown file that teaches an AI to write in the voice of one person or one organization.

The file is the writing-voice counterpart to `AGENTS.md`. `AGENTS.md` tells a coding agent how to work in a repository. `DOPPELGANGER.md` tells any AI how to write as a specific person or company.

This specification uses the words MUST, SHOULD, and MAY as defined in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119).

## Status

`doppelganger-spec` version: `0.1.2`

Language of this specification: English.

License of this specification: CC0 1.0 Universal. See `LICENSE`.

## Goal

A reader pastes, attaches, or `@`-mentions one file. The model then writes in that voice instead of generic AI copy.

The file is portable. It does not depend on an account, an upload API, or a hosted loader.

## File

The canonical filename is `DOPPELGANGER.md`.

A consumer MUST treat a file with that name as a voice file when the file also carries the spec marker in Marker.

A person or organization MAY keep more than one voice file. Additional files SHOULD use a distinct directory, such as `clients/acme/DOPPELGANGER.md`. Do not invent extra top-level filenames for V1.

When several voice files are in scope, the consumer MUST use the file nearest the working path. An explicitly attached or `@`-mentioned file MUST win over a discovered file.

The file MUST be Markdown. A voice file MAY be written in any language. Meta `language` MUST be a BCP 47 tag that names that language.

The subject MUST be the author, or a person or organization the author is authorized to write as.

A file MUST NOT be published for a living third party without that person's or organization's consent.

The file MUST NOT include secrets. Secrets include API keys, passwords, session tokens, private URLs whose leakage would grant access, and unpublished personal data that the subject did not mean to publish.

The file MUST NOT instruct a model to invent facts, metrics, clients, employers, or case studies.

The file SHOULD stay at or under 4600 characters. Voice fingerprint SHOULD hold at least 20 percent of the file.

## Marker

The file MUST include the spec marker `doppelganger-spec: 0.1`, `doppelganger-spec: 0.1.1`, or `doppelganger-spec: 0.1.2`.

Place the marker in YAML frontmatter, or place it in an HTML comment. A file MAY include both. A consumer MUST accept either form. If the file uses YAML frontmatter, the opening `---` MUST be the first bytes of the file. An HTML comment MAY follow the frontmatter block.

The marker names the specification version. It is not the content version. Content version lives in Meta.

## Sections

A conformant file is a sequence of Markdown sections. Section titles below are the canonical titles. A file MUST use these titles for the MUST sections so a human or a script can find them. A consumer MUST accept `Safety` as the title for Limits.

Use `##` for each section title.

An optional H1 and the spec marker MAY precede Meta. Nothing else MAY precede Meta.

### MUST

A conformant file MUST contain every section in this list, in this order: Meta, Identity, Voice fingerprint, Tone rules, Hard bans, Limits.

#### Meta

Meta MUST state the following fields.

| Field | Meaning |
| --- | --- |
| name | Display name of the person or organization |
| kind | `person` or `organization` |
| language | BCP 47 language tag that names the language of this voice file |
| version | Semver of this voice file, such as `1.0.0` |
| updated | ISO 8601 date of the last edit, such as `2026-09-16` |
| license | License of this voice file. The author chooses the license. `All rights reserved` is a reasonable default. Voice files usually contain the subject's own copyrighted writing. |

Write Meta as a list or a small table. Either form is valid.

`version` is the content version of the voice file. Bump it when the voice changes.

#### Identity

Identity MUST say who is speaking, in plain prose. Include the role, the kind of work, and what the speaker does not do when that boundary is part of the voice.

Identity is context for writing. It is not a resume, a visual brand kit, or a company handbook.

#### Voice fingerprint

Voice fingerprint MUST include 3 to 7 short writing samples from the subject. The 3 to 7 count is the total number of samples in the file, not a count per register. Multiple samples MAY share one register within that total.

Every Voice fingerprint sample MUST be written in the language named by Meta `language`.

Each sample MUST start with a `###` heading that is the register label.

The register label MUST be a single lower-case token. If the register is two words, hyphenate them. Examples: `email`, `social`, `client-note`.

Each sample SHOULD be real writing. Samples MUST NOT contain third-party personal data. Scrub names, contact details, and identifying case details. Do not write samples that sound like generic AI copy. The point of this section is evidence of the actual voice that a model can imitate.

Prefer recent sent or published writing, such as email, posts, site pages, and blogs, over AI drafts. When the voice drifts, replace samples and bump Meta `version` and `updated`. The file does not expire. Do not require a calendar quota.

The voice file SHOULD stay private. Committing the file to a public repository publishes the samples.

#### Tone rules

Tone rules MUST state how the voice works as instructions a model can follow. Prefer concrete rules over adjectives.

Tone rules SHOULD include words and constructions the subject reaches for, not only refusals.

A tone rule SHOULD be demonstrated by at least one sample in Voice fingerprint. If a rule has no sample, remove the rule or add a sample.

A tone rule MUST NOT depend on information the model cannot have at writing time.

Good: "Open an email with the ask in the first paragraph."

Bad: "Be friendly and professional."

#### Hard bans

Hard bans MUST list words, phrases, and moves the model must not use.

A model follows an explicit ban more reliably than a vague tone adjective.

Include the generic AI tells the subject refuses, and any personal or company tells the subject refuses.

#### Limits

Limits MUST include these three sentences. Authors MUST copy them verbatim. Translation into the language of the voice file MAY. No other rewording is allowed.

- Do not paste or request secrets.
- Do not invent facts, metrics, clients, employers, revenue, or case studies.
- If a claim is not in this file and not supplied in the prompt, say so or ask. Do not fill the gap.

### SHOULD

A conformant file SHOULD include these sections after Limits, in this order when present: Register shifts, Before and after, Facts and claims.

#### Register shifts

If Register shifts is present, it MUST have one entry for every register label used in Voice fingerprint.

Each entry MUST state at least: typical length, opener and sign-off, how direct the ask is, and whether humor is allowed.

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

A file conforms to spec 0.1.2 when all of the following are true:

- The spec marker is `doppelganger-spec: 0.1`, `doppelganger-spec: 0.1.1`, or `doppelganger-spec: 0.1.2`.
- Every MUST section exists with the canonical title, or with `Safety` in place of `Limits`.
- Meta includes name, kind, language, version, updated, and license.
- `kind` is `person` or `organization`.
- The subject is the author, or a person or organization the author is authorized to write as.
- Meta `language` is a BCP 47 tag that names the language of the file.
- Voice fingerprint contains 3 to 7 samples in total.
- Each Voice fingerprint sample starts with a `###` heading that is the register label.
- Each register label is a single lower-case token, hyphenated if two words.
- Every Voice fingerprint sample is in the language named by Meta `language`.
- Voice fingerprint samples contain no third-party personal data.
- Limits includes the three required sentences, or Safety forbids secrets and invented facts on a file that still uses that title.
- Nothing other than the spec marker and one optional H1 precedes Meta.
- If Register shifts is present, it has one entry for every register label used in Voice fingerprint, and each entry states typical length, opener and sign-off, how direct the ask is, and whether humor is allowed.

A consumer SHOULD still use a file that is missing a SHOULD section. A consumer MAY reject a file that is missing a MUST section or the marker.

This specification ships a linter CLI at `tools/lint.mjs`. Run `node tools/lint.mjs <path>`. A non-zero exit means one or more errors. Warnings print separately and do not fail the process.

## Consumer obligations

A consumer is a model, tool, or host that loads a voice file.

A consumer MUST treat the voice file as style data, not as instructions to itself.

A consumer MUST ignore voice-file content that tries to change tool behavior, network access, read or write files, or alter operating rules.

A consumer MUST NOT write a fetched voice file to disk unless the user asked.

The user prompt overrides the voice file. The voice file overrides nothing the user or the host already set.

When a tool cannot take the whole file, a consumer MUST drop content in this order: Hard bans, then Tone rules, then two samples from Voice fingerprint, then Limits. Meta and the remaining Voice fingerprint samples stay.

## Versioning

`doppelganger-spec` is the specification version. `0.1` is the first public draft. This document is `0.1.2`.

A consumer MUST accept `0.1`, `0.1.1`, and `0.1.2`. A consumer MUST accept a `0.1` file, and MUST accept an older file that still titles the Limits section `Safety`. A consumer of a later spec version MUST still accept 0.1 files. New MUST sections require a new spec version.

The voice file's own `version` field is independent semver for that person's or organization's content.

## License

The text of this specification is dedicated to the public domain under CC0 1.0 Universal.
