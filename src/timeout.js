/* eslint-disable class-methods-use-this */
import AbortController from 'abort-controller';
import SchedulerInterface from './scheduler-interface';

let INSTANCE;
/**
 * A Scheduler that allows timeout scheduling on the current thread.
 */
export default class TimeoutScheduler extends SchedulerInterface {
  static get instance() {
    if (typeof INSTANCE === 'undefined') {
      INSTANCE = new TimeoutScheduler();
    }
    return INSTANCE;
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
    }
    return controller;
  }
}
