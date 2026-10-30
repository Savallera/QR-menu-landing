import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { registrationDocument } from './build-legal-documents.mjs';

const source = (text, approved = true) => ({ revisionId: 'test-source', approved, blocks: [
  { kind: 'paragraph', style: 'HEADING_1', runs: [{ text, bold: true }] },
] });

test('unapproved consent is never exposed as a published registration document', () => {
  assert.equal(registrationDocument(source('Test consent', false), 'personal-data-consent'), null);
});
test('published revision identifies and preserves the exact document body', () => {
  const revision = registrationDocument(source('Test consent'), 'personal-data-consent');
  assert.equal(revision.code, 'consent');
  assert.equal(revision.canonicalUrl, 'https://showme.menu/personal-data-consent/');
  assert.ok(revision.contentHtml.includes('<h1'));
  assert.equal(revision.contentSha256, createHash('sha256').update(revision.contentHtml).digest('hex'));
  const next = registrationDocument(source('Updated consent'), 'personal-data-consent');
  assert.notEqual(revision.revisionId, next.revisionId);
  assert.ok(revision.contentHtml.includes('Test consent'));
  assert.equal(revision.contentHtml.includes('Updated consent'), false);
});
