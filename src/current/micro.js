import AbortController from 'abort-controller';

export default class MicroCurrentScheduler {
  static schedule(fn) {
    if (typeof fn === 'function') {
      // eslint-disable-next-line no-new
      Promise.resolve().then(() => fn());
    }
  }

  static delay(fn, amount) {
    const controller = new AbortController();
    if (typeof fn === 'function') {
      const { signal } = controller;

      // eslint-disable-next-line no-new
      Promise.resolve().then(() => {
        if (signal.aborted) {
          return;
        }
        const inner = setTimeout(fn, amount);

        signal.addEventListener('abort', () => clearTimeout(inner));
      });
    }
    return controller;
  }
}
