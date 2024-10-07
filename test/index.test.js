import {createRulesTable} from '../lib/index.js';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs/promises';
import path from 'node:path';
import {rejects} from 'node:assert';
import snap from 'snappy-snaps';
// eslint-disable-next-line n/no-unsupported-features/node-builtins
import test from 'node:test';

const fixtures = fileURLToPath(new URL('./fixtures/', import.meta.url));
const good = path.resolve(fixtures, 'good');
const bad = path.resolve(fixtures, 'bad');

test('createRulesTable', async() => {
  await createRulesTable({cwd: good});
  await snap('good', await fs.readFile(path.join(good, 'README.md'), 'utf8'));
});

test('bad README', async() => {
  await rejects(
    () => createRulesTable({cwd: bad}),
    {message: 'Invalid markdown file, needs start/end comments'}
  );
});

test('bad package.json', async() => {
  await rejects(
    () => createRulesTable({cwd: '/'}),
    {message: 'Unable to find package.json from "/"'}
  );
});
