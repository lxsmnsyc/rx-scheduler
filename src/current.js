/* eslint-disable class-methods-use-this */
import AbortController from 'abort-controller';
import SchedulerInterface from './scheduler-interface';

let INSTANCE;

/**
 * A Scheduler that allows scheduling on the current thread.
 */
export default class CurrentScheduler extends SchedulerInterface {
  static get instance() {
    if (typeof INSTANCE === 'undefined') {
      INSTANCE = new CurrentScheduler();
    }
    return INSTANCE;
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
