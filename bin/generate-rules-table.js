#!/usr/bin/env node

import {Command} from 'commander';
import {createRulesTable} from '../lib/index.js';
import pkg from '../package.json' with {type: 'json'};

const program = new Command();
program
  .version(pkg.version)
  .option('-c, --cwd <directory>', 'Directory to work from.  Defaults to cwd, and looks for package.json up from there.')
  .option('-r, --readme <readme name>', 'Name of readme file.  Relative to package.json', 'README.md')
  .parse();

try {
  await createRulesTable(program.opts());
} catch (er) {
  console.error(er.message);
  process.exit(1);
}
