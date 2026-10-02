// Run: npm test
import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { allowedHostnames, verifyTurnstile } from './turnstile.ts';

const HOSTS = ['guidingwinds-unplug.com', 'www.guidingwinds-unplug.com'];
const base = { secret: 'shh', token: 'tok', ip: '203.0.113.7', hostnames: HOSTS };

function stubSiteverify(outcome: object) {
  return mock.method(globalThis, 'fetch', async () => Response.json(outcome));
}

test('passes a valid token from our hostname, sending secret + token', async (t) => {
  const fetch = stubSiteverify({ success: true, hostname: 'guidingwinds-unplug.com' });
  t.after(() => fetch.mock.restore());

  assert.equal(await verifyTurnstile(base), true);
  const [url, init] = fetch.mock.calls[0].arguments as [string, RequestInit];
  assert.equal(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
  const sent = init.body as FormData;
  assert.equal(sent.get('secret'), 'shh');
  assert.equal(sent.get('response'), 'tok');
  assert.equal(sent.get('remoteip'), '203.0.113.7');
  assert.ok(init.signal instanceof AbortSignal, 'siteverify call must be time-bounded');
});

test('fails a token Cloudflare rejects', async (t) => {
  const fetch = stubSiteverify({ success: false, 'error-codes': ['invalid-input-response'] });
  t.after(() => fetch.mock.restore());
  assert.equal(await verifyTurnstile(base), false);
});

test('fails a valid token minted on a different hostname', async (t) => {
  const fetch = stubSiteverify({ success: true, hostname: 'evil.example' });
  t.after(() => fetch.mock.restore());
  assert.equal(await verifyTurnstile(base), false);
});

test('fails with no token or no secret, without calling siteverify', async (t) => {
  const fetch = stubSiteverify({ success: true, hostname: HOSTS[0] });
  t.after(() => fetch.mock.restore());
  assert.equal(await verifyTurnstile({ ...base, token: undefined }), false);
  assert.equal(await verifyTurnstile({ ...base, token: '' }), false);
  assert.equal(await verifyTurnstile({ ...base, secret: undefined }), false);
  assert.equal(fetch.mock.callCount(), 0);
});

test('fails closed when siteverify is unreachable', async (t) => {
  const fetch = mock.method(globalThis, 'fetch', async () => {
    throw new Error('network down');
  });
  t.after(() => fetch.mock.restore());
  assert.equal(await verifyTurnstile(base), false);
});

test('allowed hostnames are apex + www whether SITE is apex or www', () => {
  assert.deepEqual(allowedHostnames('https://guidingwinds-unplug.com'), HOSTS);
  assert.deepEqual(allowedHostnames('https://www.guidingwinds-unplug.com'), HOSTS);
});
