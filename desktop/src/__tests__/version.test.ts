import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';

// #948: the v0.8.2–v0.8.4 releases shipped installers stamped 0.8.1 because
// desktop/package.json was never bumped after v0.8.1. electron-builder reads
// this version for the artifact filenames, so a stale number here silently
// mislabels every future release. Assert the version is well-formed and that
// the lockfile tracks it, so the next forgotten bump fails CI instead of
// shipping a mislabeled .dmg/.exe.

const here = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(resolve(here, '../../package.json'), 'utf8')) as {
  name: string;
  version: string;
};
const lock = JSON.parse(readFileSync(resolve(here, '../../package-lock.json'), 'utf8')) as {
  name: string;
  version: string;
  packages: Record<string, { version?: string }>;
};

describe('desktop package version', () => {
  it('is a semver-ish x.y.z', () => {
    expect(pkg.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('is stamped into the lockfile root', () => {
    expect(lock.name).toBe(pkg.name);
    expect(lock.version).toBe(pkg.version);
    expect(lock.packages['']?.version).toBe(pkg.version);
  });
});
