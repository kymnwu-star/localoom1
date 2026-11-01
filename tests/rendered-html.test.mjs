import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { before, after, test } from 'node:test';
import { setTimeout } from 'node:timers/promises';

const base = 'http://127.0.0.1:3107';
let server;
before(async () => {
  server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', '3107'], { stdio: 'pipe' });
  for (let i = 0; i < 100; i++) {
    try { if ((await fetch(base)).ok) return; } catch {}
    await setTimeout(100);
  }
  throw new Error('Production server did not become ready');
});
after(() => server?.kill());

test('production home renders the brand and all four navigation actions', async () => {
  const response = await fetch(base);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Grim Drawer — 로컬룸 여행 다이어리/);
  assert.match(html, /localoom-logo.png/);
  assert.match(html, /주요 메뉴/);
  for (const label of ['홈', '지도', '기록', '여행책']) assert.ok(html.includes(label));
  assert.doesNotMatch(html, /Codex is working|Your site is taking shape/);
});
test('wordmark and existing place photos remain available', async () => {
  for (const path of ['/localoom-logo.png', '/huinnyeoul.jpg', '/gwangalli.jpg', '/gamcheon.jpg', '/haeundae.jpg']) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get('content-type'), /^image\//);
    assert.ok((await response.arrayBuffer()).byteLength > 100);
  }
});
test('login continues to reject invalid credentials and malformed requests', async () => {
  const response = await fetch(base + '/api/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email:'invalid@example.com', password:'invalid' }) });
  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), {ok:false});
  const malformed = await fetch(base + '/api/login', {method:'POST',body:'invalid-json'});
  assert.equal(malformed.status, 400);
});
