#!/usr/bin/env node

import {Command} from 'commander';
import {createRulesTable} from '../lib/index.js';
import {version} from '../lib/version.js';

const program = new Command();
program
  .version(version)
  .option('-c, --cwd <directory>', 'Directory to work from.  Defaults to cwd, and looks for package.json up from there.')
  .option('-r, --readme <readme name>', 'Name of readme file.  Relative to package.json', 'README.md')
  .parse();

try {
  await createRulesTable(program.opts());
} catch (er) {
  // eslint-disable-next-line no-console
  console.error(er.message);
  process.exit(1);
}
