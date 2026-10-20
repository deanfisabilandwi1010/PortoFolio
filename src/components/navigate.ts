// Tiny bridge so any component can trigger the curtain navigation.
type Navigator = (hash: string) => void;
let current: Navigator | null = null;

export function setNavigator(fn: Navigator | null) {
  current = fn;
}

/** Go to an in-page section through the curtain transition (falls back to a plain jump). */
export function navigate(hash: string) {
  if (current) current(hash);
  else document.querySelector(hash)?.scrollIntoView();
}
