import assert from 'node:assert/strict';
import { test, afterEach } from 'node:test';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../src/lib/clipboard.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } });
const { copyText } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
const originalDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
afterEach(() => {
  for (const [key, descriptor] of [['navigator', originalNavigator], ['document', originalDocument]]) {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else delete globalThis[key];
  }
});
function setup(writeText, fallback) {
  const events = [];
  const field = { style: {}, select: () => events.push('select'), remove: () => events.push('remove') };
  const dialog = { appendChild: () => events.push('dialog') };
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { clipboard: { writeText } } });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: {
    activeElement: { closest: () => dialog, focus: () => events.push('restore') },
    createElement: () => field,
    body: { appendChild: () => events.push('body') },
    execCommand: () => fallback()
  } });
  return events;
}
test('clipboard confirms success only after the modern API resolves', async () => {
  let received;
  const events = setup(async value => { received = value; }, () => { throw new Error('Must not use fallback'); });
  assert.equal(await copyText('hello@example.com'), true);
  assert.equal(received, 'hello@example.com');
  assert.deepEqual(events, []);
});
test('denied clipboard uses the active dialog and restores focus after fallback success', async () => {
  const events = setup(async () => { throw new Error('Denied'); }, () => true);
  assert.equal(await copyText('hello@example.com'), true);
  assert.deepEqual(events, ['dialog', 'select', 'remove', 'restore']);
});
test('denied clipboard and refused fallback report failure with cleanup', async () => {
  const events = setup(async () => { throw new Error('Denied'); }, () => false);
  assert.equal(await copyText('hello@example.com'), false);
  assert.deepEqual(events, ['dialog', 'select', 'remove', 'restore']);
});
test('unavailable APIs report failure without leaving the hidden field behind', async () => {
  const events = setup(undefined, () => { throw new Error('Unsupported'); });
  assert.equal(await copyText('hello@example.com'), false);
  assert.deepEqual(events, ['dialog', 'select', 'remove', 'restore']);
});
