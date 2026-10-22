import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { setup } from './helpers';

function fakeDist() {
  const dir = mkdtempSync(join(tmpdir(), 'pc-dist-'));
  writeFileSync(join(dir, 'index.html'), '<!doctype html><title>spa</title>');
  mkdirSync(join(dir, 'assets'));
  writeFileSync(join(dir, 'assets', 'app-123.js'), 'console.log(1)');
  return dir;
}

describe('SPA estático', () => {
  it('serve assets com cache imutável e rotas client-side com index.html', async () => {
    const { app } = await setup(undefined, { WEB_DIST_PATH: fakeDist() });

    const asset = await app.inject({ url: '/assets/app-123.js' });
    expect(asset.statusCode).toBe(200);
    expect(asset.headers['cache-control']).toContain('immutable');

    const route = await app.inject({ url: '/admin' });
    expect(route.statusCode).toBe(200);
    expect(route.body).toContain('<title>spa</title>');
    expect(route.headers['content-security-policy']).toContain("default-src 'self'");

    const api404 = await app.inject({ url: '/api/nada' });
    expect(api404.statusCode).toBe(404);
    expect(api404.json().error.code).toBe('NOT_FOUND');
    await app.close();
  });
});
