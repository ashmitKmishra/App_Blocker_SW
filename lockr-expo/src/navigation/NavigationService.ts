import { createRef } from 'react';

// Use a loosely-typed ref here to avoid depending on NavigationContainerRef
// type declarations in the environment. This keeps the runtime helper usable
// while letting the consumer (App) provide the proper ref from react-nav.
export const navigationRef = createRef<any>();

export function navigate(name: string, params?: any) {
  const nav = navigationRef.current as any;
  if (nav && typeof nav.navigate === 'function') {
    nav.navigate(name, params);
  }
}
