import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));

test('build includes mobile drawer navigation and shared theme toggle hooks', () => {
	execFileSync('npm', ['run', 'build'], { cwd: rootDir, stdio: 'pipe' });

	const homeHtml = readFileSync(join(rootDir, 'dist', 'index.html'), 'utf8');
	const themeToggleHooks = homeHtml.match(/data-theme-toggle type="button"/g) ?? [];

	assert.match(homeHtml, /class="mobile-nav"/);
	assert.match(homeHtml, /class="mobile-menu-toggle"/);
	assert.match(homeHtml, /class="mobile-menu-panel"/);
	assert.match(homeHtml, /モバイルメニュー/);
	assert.equal(themeToggleHooks.length, 2, 'expected desktop and mobile theme toggles in markup');
});
