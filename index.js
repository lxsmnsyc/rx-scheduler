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
 * A Scheduler that allows immediate scheduling, using setImmediate.
 */
class ImmediateScheduler extends SchedulerInterface {
  static get instance() {
    if (typeof INSTANCE === 'undefined') {
      INSTANCE = new ImmediateScheduler();
    }
    return INSTANCE;
  }

  /**
   * Schedules the function immediately.
   * @param {!function} fn
   */
  schedule(fn) {
    if (typeof fn === 'function') {
      setImmediate(fn);
    }
  }

  /**
   * Schedules the given function at a delayed time.
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
      const handler = setImmediate(() => {
        const inner = setTimeout(() => {
          fn();
          controller.abort();
        }, amount);

        signal.addEventListener('abort', () => clearTimeout(inner));
      });
      signal.addEventListener('abort', () => clearImmediate(handler));
    } else {
      controller.abort();
    }
    return controller;
  }
}

/* eslint-disable class-methods-use-this */

let INSTANCE$1;
/**
 * A Scheduler that allows async scheduling on the current thread.
 */
class AsyncScheduler extends SchedulerInterface {
  static get instance() {
    if (typeof INSTANCE$1 === 'undefined') {
      INSTANCE$1 = new AsyncScheduler();
    }
    return INSTANCE$1;
  }

  /**
   * Schedules the function immediately on the async task.
   * @param {!function} fn
   */
  schedule(fn) {
    if (typeof fn === 'function') {
      // eslint-disable-next-line no-new
      Promise.resolve().then(() => fn());
    }
  }

  /**
   * Schedules the given function at a delayed time on the async task.
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
    } else {
      controller.abort();
    }
    return controller;
  }
}

/* eslint-disable class-methods-use-this */

let INSTANCE$2;
/**
 * A Scheduler that allows timeout scheduling on the current thread.
 */
class TimeoutScheduler extends SchedulerInterface {
  static get instance() {
    if (typeof INSTANCE$2 === 'undefined') {
      INSTANCE$2 = new TimeoutScheduler();
    }
    return INSTANCE$2;
  }

  /**
   * Schedules the function immediately on the timeout task.
   * @param {!function} fn
   */
  schedule(fn) {
    if (typeof fn === 'function') {
      // eslint-disable-next-line no-new
      setTimeout(fn, 0);
    }
  }

  /**
   * Schedules the given function at a delayed time on the timeout task.
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
        const inner = setTimeout(() => {
          fn();
          controller.abort();
        }, amount);

        signal.addEventListener('abort', () => clearTimeout(inner));
      }, 0);
      signal.addEventListener('abort', () => clearTimeout(timeout));
    } else {
      controller.abort();
    }
    return controller;
  }
}

/* eslint-disable class-methods-use-this */

let INSTANCE$3;

/**
 * A Scheduler that allows scheduling on the current thread.
 */
class CurrentScheduler extends SchedulerInterface {
  static get instance() {
    if (typeof INSTANCE$3 === 'undefined') {
      INSTANCE$3 = new CurrentScheduler();
    }
    return INSTANCE$3;
  }

  /**
   * Schedules the function on the current task.
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

      const inner = setTimeout(() => {
        fn();
        controller.abort();
      }, amount);

      signal.addEventListener('abort', () => clearTimeout(inner));
    } else {
      controller.abort();
    }
    return controller;
  }
}

/* eslint-disable class-methods-use-this */

let INSTANCE$4;

/**
 * A Scheduler that allows scheduling using process.nextTick.
 */
class TickScheduler extends SchedulerInterface {
  static get instance() {
    if (typeof INSTANCE$4 === 'undefined') {
      INSTANCE$4 = new TickScheduler();
    }
    return INSTANCE$4;
  }

  /**
   * Schedules the function immediately.
   * @param {!function} fn
   */
  schedule(fn) {
    if (typeof fn === 'function') {
      process.nextTick(fn);
    }
  }

  /**
   * Schedules the given function at a delayed time.
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
      process.nextTick(() => {
        if (signal.aborted) {
          return;
        }
        const inner = setTimeout(() => {
          fn();
          controller.abort();
        }, amount);

        signal.addEventListener('abort', () => clearTimeout(inner));
      });
    } else {
      controller.abort();
    }
    return controller;
  }
}

/* eslint-disable class-methods-use-this */

/**
 * Scheduler is an object that specifies an API for scheduling units of work.
 * These units of work are scheduled either executed immediately or enqueued and
 * executed using a callback mechanism.
 *
 * Scheduler provides 5 types of scheduling mechanism:
 * - Current: executes the task immediately.
 * - Immediate: schedules the task for the next frame.
 * - Async: schedules the task asynchronously (as a microtask).
 * - Timeout: schedules the task using setTimeout.
 * - Tick: schedules the task using process.nextTick.
 */
class Scheduler {
  /**
   * Interface for all scheduler types.
   */
  static get interface() {
    return SchedulerInterface;
  }

  /**
   * A Scheduler that allows scheduling on the current thread.
   * @returns {CurrentScheduler}
   */
  static get current() {
    return CurrentScheduler.instance;
  }

  /**
   * A Scheduler that allows immediate scheduling, using requestAnimationFrame.
   * @returns {ImmediateScheduler}
   */
  static get immediate() {
    return ImmediateScheduler.instance;
  }

  /**
   * A Scheduler that allows async scheduling on the current thread.
   * @returns {AsyncScheduler}
   */
  static get async() {
    return AsyncScheduler.instance;
  }

  /**
   * A Scheduler that allows timeout scheduling on the current thread.
   * @returns {TimeoutScheduler}
   */
  static get timeout() {
    return TimeoutScheduler.instance;
  }


  /**
   * A Scheduler that allows scheduling using process.nextTick.
   * @returns {TickScheduler}
   */
  static get tick() {
    return TickScheduler.instance;
  }
}

module.exports = Scheduler;
