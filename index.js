'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var AbortController = _interopDefault(require('abort-controller'));

class ImmediateCurrentScheduler {
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

class MicroCurrentScheduler {
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

class MacroCurrentScheduler {
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

class CurrentScheduler {
  static get immediate() {
    return ImmediateCurrentScheduler;
  }

  static get micro() {
    return MicroCurrentScheduler;
  }

  static get macro() {
    return MacroCurrentScheduler;
  }
}

class Scheduler {
  static get current() {
    return CurrentScheduler;
  }
}

module.exports = Scheduler;
