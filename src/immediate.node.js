/* eslint-disable class-methods-use-this */
import AbortController from 'abort-controller';
import SchedulerInterface from './scheduler-interface';

let INSTANCE;

/**
 * A Scheduler that allows immediate scheduling, using setImmediate.
 */
export default class ImmediateScheduler extends SchedulerInterface {
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
    }
    return controller;
  }
}
