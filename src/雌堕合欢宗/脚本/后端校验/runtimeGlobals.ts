export type RuntimeScope = typeof globalThis & Record<string, any>;

export function runtimeScopes(root: RuntimeScope = globalThis as RuntimeScope): RuntimeScope[] {
  const scopes: RuntimeScope[] = [];
  const seen = new Set<RuntimeScope>();
  const add = (scope: unknown) => {
    if (!scope || typeof scope !== 'object') return;
    const typed = scope as RuntimeScope;
    if (seen.has(typed)) return;
    seen.add(typed);
    scopes.push(typed);
  };

  add(root);
  try {
    add(root.window);
  } catch {}
  try {
    add(root.parent);
  } catch {}
  try {
    add(root.top);
  } catch {}

  return scopes;
}

export function resolveRuntimeGlobal<T = any>(name: string, scopes = runtimeScopes()): T | undefined {
  for (const scope of scopes) {
    if (scope[name] !== undefined && scope[name] !== null) return scope[name] as T;
  }
  return undefined;
}

export function requireRuntimeGlobal<T = any>(name: string, scopes = runtimeScopes()): T {
  const value = resolveRuntimeGlobal<T>(name, scopes);
  if (value === undefined || value === null) {
    throw new Error(`[hehuan backend_validate] Missing runtime global: ${name}`);
  }
  return value;
}

export async function waitForRuntimeGlobal<T = any>(name: string, scopes = runtimeScopes()): Promise<T> {
  const initialValue = resolveRuntimeGlobal<T>(name, scopes);
  if (initialValue !== undefined && initialValue !== null) return initialValue;

  const waitGlobalInitialized = resolveRuntimeGlobal<(name: string) => Promise<unknown>>('waitGlobalInitialized', scopes);
  if (waitGlobalInitialized) {
    await waitGlobalInitialized(name);
  }

  return requireRuntimeGlobal<T>(name, scopes);
}

export function exposeRuntimeGlobal(name: string, value: unknown, scopes = runtimeScopes()): void {
  for (const scope of scopes) {
    try {
      scope[name] = value;
    } catch {}
  }
}
