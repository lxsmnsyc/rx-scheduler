import AbortController from 'abort-controller';

export default class ImmediateCurrentScheduler {
  static schedule(fn) {
    if (typeof fn === 'function') {
      return fn();
    }
    return undefined;
  }

  static delay(fn, amount) {
    const controller = new AbortController();
    if (typeof fn === 'function') {
      const { signal } = controller;

      const inner = setTimeout(fn, amount);

      signal.addEventListener('abort', () => clearTimeout(inner));
    }
    return controller;
  }
}
