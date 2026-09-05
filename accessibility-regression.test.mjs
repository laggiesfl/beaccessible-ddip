import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');

test('shared accessibility controls are present', () => {
  for (const text of ['A- Decrease','A Reset','A+ Increase','High contrast','Reduce motion','Listen to this page','Pause listening','Stop listening','Reset accessibility']) {
    assert.ok(html.includes(text), `missing ${text}`);
  }
});

test('display preferences persist with 80 to 200 percent text sizing', () => {
  assert.ok(html.includes('ddip-text-size'));
  assert.ok(html.includes('ddip-high-contrast'));
  assert.ok(html.includes('ddip-reduce-motion'));
  assert.match(html, /Math\.max\([^\n]*80\)/);
  assert.match(html, /Math\.min\([^\n]*200\)/);
});

test('read aloud excludes interactive fields and supports pause/resume', () => {
  assert.ok(html.includes('cloneNode(true)'));
  assert.ok(html.includes('input, textarea, select, button, [data-speech-exclude]'));
  assert.ok(html.includes('speechSynthesis.pause()'));
  assert.ok(html.includes('speechSynthesis.resume()'));
});

test('core DDIP features remain present', () => {
  for (const marker of ['28 Strategies','Maturity Index','Abi','function renderStrategies','function calcMaturity','async function sendMsg','function quickAsk','Screen reader compatible systems']) {
    assert.ok(html.includes(marker), `missing ${marker}`);
  }
});

test('unsupported page-level conformance claims are removed', () => {
  assert.ok(!html.includes('✓ WCAG AAA'));
  assert.ok(html.includes('Targets WCAG 2.2 AA'));
});
