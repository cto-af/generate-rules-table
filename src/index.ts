// Inspired by:
// https://github.com/eslint/markdown/blob/876cf0f6190051ff2935a663a6b9a4733d094225/tools/update-rules-docs.js

import {fromMarkdown} from 'mdast-util-from-markdown';
import fs from 'node:fs/promises';
import {packageUp} from 'package-up';
import path from 'node:path';

export interface CreateOptions {
  cwd?: string;
  readme?: string;
}

interface ModuleRules {
  [key: string]: import('eslint').Rule.RuleModule;
}

/**
 * Formats a table row from a rule filename.
 *
 * @param ruleName Name of the rule.
 * @param rule Rule with metadata.
 * @returns Table columns as markdown text.
 */
function formatTableRowFromFilename(
  ruleName: string,
  rule: import('eslint').Rule.RuleModule
): string {
  if (!rule.meta?.docs) {
    return '';
  }
  const {description, recommended} = rule.meta.docs;
  const ruleLink = `[\`${ruleName}\`](./docs/rules/${ruleName}.md)`;
  const recommendedText = recommended ? 'yes' : 'no';

  return `| ${ruleLink} | ${description} | ${recommendedText} |`;
}

function createRulesTableText(
  rules: ModuleRules
): string {
  const text = [
    '| **Rule Name** | **Description** | **Recommended** |',
    '| :- | :- | :-: |',
    ...Object
      .entries(rules)
      .map(([k, v]) => formatTableRowFromFilename(k, v)),
  ].join('\n');

  return text;
}

/**
 * Returns start and end offset of the rules table as indicated by "Rule Table
 * Start" and "Rule Table End" HTML comments in the markdown text.
 *
 * @param text The markdown text.
 * @returns The offset range of the rules table.
 * @throws No rules table comments.
 */
function getRulesTableRange(text: string): [number, number] {
  const tree = fromMarkdown(text);
  const htmlNodes = tree.children.filter(({type}) => type === 'html');
  const startComment = htmlNodes.find(
    // @ts-expect-error value exists on all html nodes
    ({value}) => (value === '<!-- Rule Table Start -->')
  );
  const endComment = htmlNodes.find(
    // @ts-expect-error value exists on all html nodes
    ({value}) => (value === '<!-- Rule Table End -->')
  );

  if (typeof startComment?.position?.end?.offset !== 'number' ||
      typeof endComment?.position?.start?.offset !== 'number'
  ) {
    throw new Error('Invalid markdown file, needs start/end comments');
  }
  return [
    startComment.position.end.offset,
    endComment.position.start.offset,
  ];
}

/**
 * Create a rules table in the README.md found for this project.
 *
 * @param opts Options.
 */
export async function createRulesTable(
  opts?: CreateOptions
): Promise<void> {
  const options: Required<CreateOptions> = {
    cwd: process.cwd(),
    readme: 'README.md',
    ...opts,
  };
  const pkg = await packageUp({cwd: options.cwd});
  if (!pkg) {
    throw new Error(`Unable to find package.json from "${options.cwd}"`);
  }
  const {main} = JSON.parse(await fs.readFile(pkg, 'utf8'));
  const root = path.dirname(pkg);
  const index = path.resolve(root, main);
  const {default: {rules}} = await import(index);
  const readme = path.resolve(root, options.readme);
  const readmeText = await fs.readFile(readme, 'utf8');
  const range = getRulesTableRange(readmeText);
  const tableText = await createRulesTableText(rules);

  const newText = `\
${readmeText.slice(0, range[0])}
${tableText}
${readmeText.slice(range[1])}`;

  await fs.writeFile(readme, newText);
}
