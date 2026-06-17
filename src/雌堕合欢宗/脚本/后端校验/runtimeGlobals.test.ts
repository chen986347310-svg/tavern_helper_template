import { describe, expect, it } from 'vitest';
import { exposeRuntimeGlobal, requireRuntimeGlobal, resolveRuntimeGlobal, waitForRuntimeGlobal } from './runtimeGlobals';

describe('runtime global resolver', () => {
  it('resolves Mvu from parent scope when the script iframe scope does not own it', () => {
    const iframe: any = {};
    const parent: any = { Mvu: { events: { VARIABLE_UPDATE_ENDED: 'mag_variable_update_ended' } } };
    iframe.parent = parent;
    iframe.top = parent;

    expect(resolveRuntimeGlobal('Mvu', [iframe, iframe.parent, iframe.top])).toBe(parent.Mvu);
  });

  it('prefers iframe-local helpers over parent helpers', () => {
    const iframe: any = { eventOn: () => 'iframe-eventOn' };
    const parent: any = { eventOn: () => 'parent-eventOn' };

    expect(requireRuntimeGlobal<() => string>('eventOn', [iframe, parent])()).toBe('iframe-eventOn');
  });

  it('exposes validation hooks to every writable scope', () => {
    const iframe: any = {};
    const parent: any = {};

    exposeRuntimeGlobal('__TEST_applyValidatedUpdate', 'hook', [iframe, parent]);

    expect(iframe.__TEST_applyValidatedUpdate).toBe('hook');
    expect(parent.__TEST_applyValidatedUpdate).toBe('hook');
  });

  it('waits for Mvu initialization before resolving parent scope Mvu', async () => {
    const parent: any = {};
    const iframe: any = {
      parent,
      top: parent,
      waitGlobalInitialized: async (name: string) => {
        parent[name] = { events: { VARIABLE_UPDATE_ENDED: 'mag_variable_update_ended' } };
      },
    };

    await expect(waitForRuntimeGlobal('Mvu', [iframe, iframe.parent, iframe.top])).resolves.toBe(parent.Mvu);
  });
});
