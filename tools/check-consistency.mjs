#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');

const BYTE_PAIRS = [
  ['SPEC.md', 'docs/SPEC.md'],
  ['DOPPELGANGER.md', 'docs/DOPPELGANGER.md'],
  ['DOPPELGANGER.template.md', 'docs/DOPPELGANGER.template.md'],
];

const PRE_HTML = 'docs/example/index.html';
const PRE_SOURCE = 'docs/DOPPELGANGER.md';

const NAMED = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
};

function tryRead(rel, encoding) {
  try {
    return readFileSync(join(ROOT, rel), encoding);
  } catch {
    return null;
  }
}

function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-fA-F]+|#\d+|amp|lt|gt|quot|apos);/g, (_, body) => {
    if (body[0] === '#') {
      const code =
        body[1] === 'x' || body[1] === 'X'
          ? parseInt(body.slice(2), 16)
          : parseInt(body.slice(1), 10);
      return String.fromCodePoint(code);
    }
    return NAMED[body];
  });
}

function extractPres(html) {
  return [...html.matchAll(/<pre>([\s\S]*?)<\/pre>/g)].map((match) => match[1]);
}

function main() {
  const failures = [];

  for (const [left, right] of BYTE_PAIRS) {
    const a = tryRead(left);
    const b = tryRead(right);
    if (a === null) failures.push(`missing ${left}`);
    if (b === null) failures.push(`missing ${right}`);
    if (a !== null && b !== null && !a.equals(b)) {
      failures.push(`${left} != ${right}`);
    }
  }

  const html = tryRead(PRE_HTML, 'utf8');
  const expected = tryRead(PRE_SOURCE, 'utf8');
  if (html === null) {
    failures.push(`missing ${PRE_HTML}`);
  } else {
    const pres = extractPres(html);
    if (pres.length !== 1) {
      failures.push(`${PRE_HTML} has ${pres.length} <pre> (need 1)`);
    } else if (expected === null) {
      failures.push(`missing ${PRE_SOURCE}`);
    } else if (decodeEntities(pres[0]) !== expected) {
      failures.push(`${PRE_HTML} <pre> != ${PRE_SOURCE}`);
    }
  }

  for (const message of failures) console.log(`error: ${message}`);
  process.exit(failures.length > 0 ? 1 : 0);
}

main();
