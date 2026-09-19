#!/usr/bin/env node

import { readFileSync } from 'node:fs';

const MUST_TITLES = [
  'Meta',
  'Identity',
  'Voice fingerprint',
  'Tone rules',
  'Hard bans',
  'Limits',
];

const META_FIELDS = ['name', 'kind', 'language', 'version', 'updated', 'license'];

const LIMITS_SENTENCES = [
  'Do not paste or request secrets.',
  'Do not invent facts, metrics, clients, employers, revenue, or case studies.',
  'If a claim is not in this file and not supplied in the prompt, say so or ask. Do not fill the gap.',
];

const ALLOWED_MARKERS = new Set(['0.1', '0.1.1', '0.1.2']);
const CHAR_BUDGET = 4600;
const FINGERPRINT_SHARE = 0.2;
const SAMPLE_MIN = 3;
const SAMPLE_MAX = 7;

const MARKER_LINE = /doppelganger-spec:\s*(\S+)/g;
const REGISTER_TOKEN = /^[a-z]+(?:-[a-z]+)*$/;
const H1_LINE = /^# (?!#)\S/;
const H2_LINE = /^## (.+)$/;
const H3_LINE = /^### (.+)$/;
const LIST_FIELD = /^\s*[-*]\s*([A-Za-z][A-Za-z0-9_-]*)\s*:\s*(.*?)\s*$/;
const TABLE_FIELD = /^\|\s*([A-Za-z][A-Za-z0-9_-]*)\s*\|\s*(.*?)\s*\|/;
const LIST_REGISTER = /^\s*[-*]\s*([a-z]+(?:-[a-z]+)*)\s*:/;
const CONTRACTION =
  /\b(?:I'm|I've|I'd|I'll|you're|you've|you'd|you'll|we're|we've|we'd|we'll|they're|they've|they'd|they'll|it's|that's|what's|who's|there's|here's|isn't|aren't|wasn't|weren't|don't|doesn't|didn't|can't|couldn't|shouldn't|wouldn't|won't|hasn't|haven't|hadn't|mustn't|let's)\b/i;
const FACT_NEGATION = /^(do not|don't|does not|did not|never|not|no)\b/i;
const BCP47 = /^[a-z]{2,3}(?:-[A-Za-z0-9]{1,8})*$/i;
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

function stripComments(text) {
  return text.replace(/<!--[\s\S]*?-->/g, '');
}

function isEmptyContent(text) {
  return stripComments(text).replace(/\s+/g, '') === '';
}

function canonicalTitle(title) {
  return title === 'Safety' ? 'Limits' : title;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isBcp47(tag) {
  return BCP47.test(tag);
}

function isIsoDate(value) {
  const match = ISO_DATE.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function extractFrontmatter(source) {
  if (!source.startsWith('---')) {
    return { frontmatter: '', body: source, hasFrontmatter: false, unclosed: false };
  }
  const closer = source.indexOf('\n---', 3);
  if (closer === -1) {
    return { frontmatter: source, body: '', hasFrontmatter: true, unclosed: true };
  }
  let end = closer + 4;
  if (source.startsWith('\n', end)) end += 1;
  return {
    frontmatter: source.slice(0, end),
    body: source.slice(end),
    hasFrontmatter: true,
    unclosed: false,
  };
}

function collectMarkers(text) {
  const found = [];
  const re = new RegExp(MARKER_LINE.source, 'g');
  let match;
  while ((match = re.exec(text)) !== null) {
    found.push(match[1].replace(/["'\->]+$/, ''));
  }
  return found;
}

function parseSections(body) {
  const lines = body.split('\n');
  const sections = [];
  let prefixLines = [];
  let current = null;

  for (const line of lines) {
    const heading = H2_LINE.exec(line);
    if (heading) {
      if (current) sections.push(current);
      current = { title: heading[1].trim(), lines: [] };
      continue;
    }
    if (current) current.lines.push(line);
    else prefixLines.push(line);
  }
  if (current) sections.push(current);

  for (const section of sections) {
    section.body = section.lines.join('\n');
    section.canonical = canonicalTitle(section.title);
  }

  return { prefix: prefixLines.join('\n'), sections };
}

function parseMeta(body) {
  const fields = {};
  for (const line of stripComments(body).split('\n')) {
    const list = LIST_FIELD.exec(line);
    if (list) {
      fields[list[1].toLowerCase()] = list[2].trim();
      continue;
    }
    const table = TABLE_FIELD.exec(line);
    if (table) fields[table[1].toLowerCase()] = table[2].trim();
  }
  return fields;
}

function parseSamples(body) {
  const samples = [];
  let current = null;
  for (const line of stripComments(body).split('\n')) {
    const heading = H3_LINE.exec(line);
    if (heading) {
      if (current) samples.push(current);
      current = { register: heading[1].trim() };
      continue;
    }
  }
  if (current) samples.push(current);
  return samples;
}

function registerEntries(body) {
  const found = new Set();
  for (const line of stripComments(body).split('\n')) {
    const list = LIST_REGISTER.exec(line);
    if (list) found.add(list[1]);
    const heading = H3_LINE.exec(line);
    if (heading && REGISTER_TOKEN.test(heading[1].trim())) {
      found.add(heading[1].trim());
    }
  }
  return found;
}

function quotedPhrases(body) {
  const phrases = [];
  const re = /"([^"]{8,})"|'([^']{8,})'/g;
  let match;
  while ((match = re.exec(body)) !== null) {
    phrases.push((match[1] || match[2]).replace(/\s+/g, ' ').trim().toLowerCase());
  }
  return phrases;
}

function sectionSlice(source, title) {
  const start = source.search(new RegExp(`^## ${escapeRegExp(title)}$`, 'm'));
  if (start === -1) return '';
  const fromHeading = source.slice(start);
  const afterFirstLine = fromHeading.indexOf('\n');
  if (afterFirstLine === -1) return fromHeading;
  const rest = fromHeading.slice(afterFirstLine + 1);
  const next = rest.search(/^## /m);
  if (next === -1) return fromHeading;
  return fromHeading.slice(0, afterFirstLine + 1 + next);
}

function prefixProblems(prefix) {
  const problems = [];
  const comments = [];
  const remainder = prefix.replace(/<!--[\s\S]*?-->/g, (block) => {
    comments.push(block);
    return '\n';
  });
  for (const comment of comments) {
    const versions = collectMarkers(comment);
    if (!versions.some((version) => ALLOWED_MARKERS.has(version))) {
      problems.push('content before Meta is not an optional H1 or the spec marker');
      return problems;
    }
  }
  const nonempty = remainder
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  let h1Count = 0;
  for (const line of nonempty) {
    if (H1_LINE.test(line)) {
      h1Count += 1;
      continue;
    }
    problems.push('content before Meta is not an optional H1 or the spec marker');
    return problems;
  }
  if (h1Count > 1) {
    problems.push('content before Meta is not an optional H1 or the spec marker');
  }
  return problems;
}

function parseVoiceFile(source) {
  const extracted = extractFrontmatter(source);
  const { prefix, sections } = parseSections(extracted.hasFrontmatter ? extracted.body : source);
  const byCanonical = new Map();
  for (const section of sections) {
    if (!byCanonical.has(section.canonical)) byCanonical.set(section.canonical, section);
  }
  const fingerprint = byCanonical.get('Voice fingerprint');
  return {
    source,
    unclosed: extracted.unclosed,
    markers: collectMarkers(source),
    prefix,
    sections,
    byCanonical,
    meta: byCanonical.has('Meta') ? parseMeta(byCanonical.get('Meta').body) : {},
    metaSection: byCanonical.get('Meta'),
    fingerprint,
    samples: fingerprint ? parseSamples(fingerprint.body) : [],
    limits: byCanonical.get('Limits'),
    registerShifts: byCanonical.get('Register shifts'),
    facts: byCanonical.get('Facts and claims'),
    tone: byCanonical.get('Tone rules'),
    hardBans: byCanonical.get('Hard bans'),
    beforeAfter: byCanonical.get('Before and after'),
  };
}

function add(bucket, message) {
  if (!bucket.includes(message)) bucket.push(message);
}

function lint(source) {
  const errors = [];
  const warnings = [];
  const file = parseVoiceFile(source);

  const validMarkers = file.markers.filter((version) => ALLOWED_MARKERS.has(version));
  const invalidMarkers = [...new Set(file.markers.filter((version) => !ALLOWED_MARKERS.has(version)))];
  if (validMarkers.length === 0) {
    add(errors, 'missing spec marker doppelganger-spec: 0.1, 0.1.1, or 0.1.2');
  }
  for (const version of invalidMarkers) {
    add(errors, `spec marker "doppelganger-spec: ${version}" is not 0.1, 0.1.1, or 0.1.2`);
  }
  if (file.unclosed) add(errors, 'YAML frontmatter is not closed');

  if (!file.sections[0] || file.sections[0].canonical !== 'Meta') {
    add(errors, 'Meta must be the first section');
  }
  for (const problem of prefixProblems(file.prefix)) add(errors, problem);

  for (const title of MUST_TITLES) {
    if (!file.byCanonical.has(title)) add(errors, `section "${title}" is missing`);
  }

  const seenMust = new Set();
  for (const section of file.sections) {
    if (!MUST_TITLES.includes(section.canonical)) continue;
    if (seenMust.has(section.canonical)) {
      add(errors, `section "${section.canonical}" appears more than once`);
    }
    seenMust.add(section.canonical);
  }

  const presentMust = [];
  for (const section of file.sections) {
    if (MUST_TITLES.includes(section.canonical) && !presentMust.includes(section.canonical)) {
      presentMust.push(section.canonical);
    }
  }
  const expectedMust = MUST_TITLES.filter((title) => presentMust.includes(title));
  if (presentMust.join('\n') !== expectedMust.join('\n')) {
    add(errors, 'MUST sections are out of order');
  }

  const mustIndexes = MUST_TITLES.map((title) =>
    file.sections.findIndex((section) => section.canonical === title),
  );
  if (mustIndexes.every((index) => index !== -1)) {
    const between = file.sections.slice(mustIndexes[0], mustIndexes[mustIndexes.length - 1] + 1);
    for (const section of between) {
      if (!MUST_TITLES.includes(section.canonical)) {
        add(errors, `section "${section.title}" appears among the MUST sections`);
      }
    }
  }

  const metaEmpty = !file.metaSection || isEmptyContent(file.metaSection.body);
  const metaBucket = metaEmpty ? warnings : errors;
  for (const field of META_FIELDS) {
    if (!file.meta[field]) add(metaBucket, `Meta is missing "${field}"`);
  }
  if (file.meta.kind && file.meta.kind !== 'person' && file.meta.kind !== 'organization') {
    add(errors, 'Meta kind must be person or organization');
  }
  if (file.meta.language && !isBcp47(file.meta.language)) {
    add(errors, 'Meta language must be a BCP 47 tag');
  }
  if (file.meta.updated && !isIsoDate(file.meta.updated)) {
    add(errors, 'Meta updated must be an ISO 8601 date (YYYY-MM-DD)');
  }

  const fingerprintEmpty = !file.fingerprint || isEmptyContent(file.fingerprint.body);
  const sampleCount = file.samples.length;
  if (sampleCount < SAMPLE_MIN || sampleCount > SAMPLE_MAX) {
    add(
      fingerprintEmpty ? warnings : errors,
      `Voice fingerprint has ${sampleCount} samples (need ${SAMPLE_MIN} to ${SAMPLE_MAX})`,
    );
  }
  for (const sample of file.samples) {
    if (!REGISTER_TOKEN.test(sample.register)) {
      add(
        errors,
        `Voice fingerprint heading "${sample.register}" is not a single lower-case token`,
      );
    }
  }

  if (file.limits) {
    const limitsText = stripComments(file.limits.body);
    const translated = /\b(translation|translated)\b/i.test(limitsText);
    if (!translated) {
      const limitsEmpty = isEmptyContent(file.limits.body);
      for (const sentence of LIMITS_SENTENCES) {
        if (!limitsText.includes(sentence)) {
          add(limitsEmpty ? warnings : errors, `Limits is missing "${sentence}"`);
        }
      }
    }
  }

  const registers = [
    ...new Set(file.samples.map((sample) => sample.register).filter((name) => REGISTER_TOKEN.test(name))),
  ];
  if (registers.length > 0) {
    const entries = file.registerShifts ? registerEntries(file.registerShifts.body) : new Set();
    for (const register of registers) {
      if (!entries.has(register)) {
        add(errors, `Voice fingerprint register "${register}" has no Register shifts entry`);
      }
    }
  }

  if (source.length > CHAR_BUDGET) {
    add(warnings, `file is ${source.length} characters (budget ${CHAR_BUDGET})`);
  }

  if (file.fingerprint) {
    const raw = sectionSlice(source, file.fingerprint.title);
    const share = raw.length / source.length;
    if (share < FINGERPRINT_SHARE) {
      const percent = (share * 100).toFixed(2).replace(/\.?0+$/, '');
      add(warnings, `Voice fingerprint is ${percent}% of the file (budget 20%)`);
    }
  }

  if (file.facts) {
    for (const line of stripComments(file.facts.body).split('\n')) {
      const text = line.replace(/^\s*[-*]\s+/, '').trim();
      if (text && FACT_NEGATION.test(text)) {
        add(warnings, `Facts and claims line starts with a negation: "${text}"`);
      }
    }
  }

  const phraseMap = new Map();
  for (const section of file.sections) {
    for (const phrase of quotedPhrases(stripComments(section.body))) {
      if (!phraseMap.has(phrase)) phraseMap.set(phrase, new Set());
      phraseMap.get(phrase).add(section.title);
    }
  }
  for (const [phrase, titles] of phraseMap) {
    if (titles.size > 1) {
      add(warnings, `quoted phrase "${phrase}" appears in ${[...titles].join(', ')}`);
    }
  }

  const toneText = file.tone ? stripComments(file.tone.body) : '';
  if (/\bcontractions?\b/i.test(toneText)) {
    const hits = [];
    const watched = [
      ['Voice fingerprint', file.fingerprint],
      ['Tone rules', file.tone],
      ['Hard bans', file.hardBans],
      ['Before and after', file.beforeAfter],
    ];
    for (const [name, section] of watched) {
      if (section && CONTRACTION.test(stripComments(section.body))) hits.push(name);
    }
    if (
      hits.length > 0 &&
      hits.every((name) => name === 'Hard bans' || name === 'Before and after')
    ) {
      add(
        warnings,
        'Tone rules ask for contractions, but verb contractions appear only in Hard bans or Before and after',
      );
    }
  }

  return { errors, warnings };
}

function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('usage: node tools/lint.mjs <path>');
    process.exit(2);
  }
  let source;
  try {
    source = readFileSync(filePath, 'utf8');
  } catch {
    console.error(`error: cannot read ${filePath}`);
    process.exit(2);
  }
  const { errors, warnings } = lint(source);
  for (const message of errors) console.log(`error: ${message}`);
  if (errors.length > 0 && warnings.length > 0) console.log('');
  for (const message of warnings) console.log(`warning: ${message}`);
  process.exit(errors.length > 0 ? 1 : 0);
}

main();
