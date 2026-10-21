export function getApiBase() {
  if (typeof window !== 'undefined') return `${window.location.origin}/api`;
  return '/api';
}
