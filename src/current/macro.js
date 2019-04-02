import AbortController from 'abort-controller';

export default class MacroCurrentScheduler {
  static schedule(fn) {
    if (typeof fn === 'function') {
      // eslint-disable-next-line no-new
      setTimeout(fn, 0);
    }
  }

  static delay(fn, amount) {
    const controller = new AbortController();
    if (typeof fn === 'function') {
      const { signal } = controller;

      const timeout = setTimeout(() => {
        const inner = setTimeout(fn, amount);

        signal.addEventListener('abort', () => clearTimeout(inner));
      }, 0);
      signal.addEventListener('abort', () => clearTimeout(timeout));
    }
    return controller;
  }
}
