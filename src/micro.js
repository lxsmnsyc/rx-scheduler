/* eslint-disable class-methods-use-this */
import AbortController from 'abort-controller';
import SchedulerInterface from './scheduler-interface';

let INSTANCE;
/**
 * A Scheduler that allows micro scheduling on the current thread.
 */
export default class MicroScheduler extends SchedulerInterface {
  static get instance() {
    if (typeof INSTANCE === 'undefined') {
      INSTANCE = new MicroScheduler();
    }
    return INSTANCE;
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
