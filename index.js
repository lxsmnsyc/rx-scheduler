'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var AbortController = _interopDefault(require('abort-controller'));

/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
/**
 * @interface
 */
class SchedulerInterface {
  /**
   * Schedules the given function immediately.
   * @param {!function} fn
   * A function that is called after being scheduled.
   *
   * @abstract
   */
  schedule(fn) {}

  /**
   * Schedules the given function at a delayed time.
   * @param {!function} fn
   * A function that is called after being scheduled.
   * @param {!number} amount
   * The amount of delay in milliseconds.
   * @returns {AbortController}
   * Returns an AbortController that allows
   * to abort the schedule.
   * @abstract
   */
  delay(fn, amount) {
  }
}

/* eslint-disable class-methods-use-this */

let INSTANCE;

/**
 * A Scheduler that allows immediate scheduling on the current thread.
 */
class ImmediateScheduler extends SchedulerInterface {
  static get instance() {
    if (typeof INSTANCE === 'undefined') {
      INSTANCE = new ImmediateScheduler();
    }
    return INSTANCE;
  }

  /**
   * Schedules the function immediately on the current task.
   * @param {!function} fn
   */
  schedule(fn) {
    if (typeof fn === 'function') {
      fn();
    }
  }

  /**
   * Schedules the given function at a delayed time on the current task.
   * @param {!function} fn
   * A function that is called after being scheduled.
   * @param {!number} amount
   * The amount of delay in milliseconds.
   * @returns {AbortController}
   * Returns an AbortController that allows
   * to abort the schedule.
   */
  delay(fn, amount) {
    const controller = new AbortController();
    if (typeof fn === 'function') {
      const { signal } = controller;

      const inner = setTimeout(fn, amount);

      signal.addEventListener('abort', () => clearTimeout(inner));
    }
    return controller;
  }
}

/* eslint-disable class-methods-use-this */

let INSTANCE$1;
/**
 * A Scheduler that allows micro scheduling on the current thread.
 */
class MicroScheduler extends SchedulerInterface {
  static get instance() {
    if (typeof INSTANCE$1 === 'undefined') {
      INSTANCE$1 = new MicroScheduler();
    }
    return INSTANCE$1;
  }

  /**
   * Schedules the function immediately on the micro task.
   * @param {!function} fn
   */
  schedule(fn) {
    if (typeof fn === 'function') {
      // eslint-disable-next-line no-new
      Promise.resolve().then(() => fn());
    }
  }

  /**
   * Schedules the given function at a delayed time on the micro task.
   * @param {!function} fn
   * A function that is called after being scheduled.
   * @param {!number} amount
   * The amount of delay in milliseconds.
   * @returns {AbortController}
   * Returns an AbortController that allows
   * to abort the schedule.
   */
  delay(fn, amount) {
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

/* eslint-disable class-methods-use-this */

let INSTANCE$2;
/**
 * A Scheduler that allows macro scheduling on the current thread.
 */
class MacroScheduler extends SchedulerInterface {
  static get instance() {
    if (typeof INSTANCE$2 === 'undefined') {
      INSTANCE$2 = new MacroScheduler();
    }
    return INSTANCE$2;
  }

  /**
   * Schedules the function immediately on the macro task.
   * @param {!function} fn
   */
  schedule(fn) {
    if (typeof fn === 'function') {
      // eslint-disable-next-line no-new
      setTimeout(fn, 0);
    }
  }

  /**
   * Schedules the given function at a delayed time on the macro task.
   * @param {!function} fn
   * A function that is called after being scheduled.
   * @param {!number} amount
   * The amount of delay in milliseconds.
   * @returns {AbortController}
   * Returns an AbortController that allows
   * to abort the schedule.
   */
  delay(fn, amount) {
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

/* eslint-disable class-methods-use-this */

class Scheduler {
  get immediate() {
    return ImmediateScheduler.instance;
  }

  get micro() {
    return MicroScheduler.instance;
  }

  get macro() {
    return MacroScheduler.instance;
  }
}

module.exports = Scheduler;
