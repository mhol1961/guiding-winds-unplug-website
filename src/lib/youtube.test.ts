// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFeed } from './youtube.ts';

const entry = (id: string, title: string, published: string) =>
  `<entry><yt:videoId>${id}</yt:videoId><title>${title}</title><published>${published}</published></entry>`;

test('parses entries newest-first, cleaning titles and skipping the feed title', () => {
  const xml = `<feed><title>Guiding Winds "Unplug"</title>
    ${entry('sf6Mjar-ja0', 'Could you see yourself doing this? #fishing  #sailing &amp; more', '2026-05-22T18:14:33+00:00')}
    ${entry('auqQmiLKYTs', 'Our Croatia Charter Adventure 2026 @GuidingWindsCatamaranCharters', '2026-10-01T18:24:04+00:00')}
  </feed>`;
  assert.deepEqual(parseFeed(xml), [
    { id: 'auqQmiLKYTs', title: 'Our Croatia Charter Adventure 2026', published: '2026-10-01T18:24:04.000Z' },
    { id: 'sf6Mjar-ja0', title: 'Could you see yourself doing this? & more', published: '2026-05-22T18:14:33.000Z' },
  ]);
});

test('hashtag-only title falls back; numeric entities and CDATA decode', () => {
  const [a, b, c] = parseFeed(
    entry('aaaaaaaaaaa', '#sailing #travel', '2026-03-01T00:00:00Z') +
      entry('bbbbbbbbbbb', 'Fish &#38; chips &#x2014; Vis', '2026-02-01T00:00:00Z') +
      `<entry><yt:videoId>ccccccccccc</yt:videoId><title type="text"><![CDATA[Sun & sea]]></title><published>2026-01-01T00:00:00Z</published></entry>`,
  );
  assert.equal(a.title, 'A video from the boat');
  assert.equal(b.title, 'Fish & chips — Vis');
  assert.equal(c.title, 'Sun & sea');
});

test('invalid or missing dates become empty and sort last; bad ids are dropped', () => {
  const v = parseFeed(
    entry('ddddddddddd', 'No date', 'not-a-date') +
      entry('eeeeeeeeeee', 'Dated', '2026-04-01T00:00:00Z') +
      entry('bad id "x"', 'Injected', '2026-05-01T00:00:00Z'),
  );
  assert.deepEqual(v.map((x) => [x.id, x.published]), [
    ['eeeeeeeeeee', '2026-04-01T00:00:00.000Z'],
    ['ddddddddddd', ''],
  ]);
});

test('garbage input yields no videos', () => {
  assert.deepEqual(parseFeed('<html>error</html>'), []);
});
