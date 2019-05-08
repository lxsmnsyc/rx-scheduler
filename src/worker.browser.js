/* eslint-disable class-methods-use-this */
import SchedulerInterface from './scheduler-interface';
import { schedule, delay } from './utils';

/**
 * @ignore
 */
let INSTANCE;

/**
 * @ignore
 */
const func = (() => {
  const script = '(()=>{self.addEventListener("message",a=>self.postMessage(a.data))})();';

  const url = URL.createObjectURL(new Blob([script]));

  const worker = new Worker(url);
  let busy = false;

  const jobs = [];
  worker.addEventListener('message', () => {
    if (jobs.length > 0) {
      jobs.shift()();

      if (jobs.length > 0) {
        worker.postMessage(0);
      } else {
        busy = false;
      }
    }
  });

  const pushJob = (fn) => {
    jobs.push(fn);

    if (!busy) {
      busy = true;
      worker.postMessage(0);
    }
  };

  return pushJob;
})();
/**
 * @ignore
 */
const sched = schedule(func);
/**
 * @ignore
 */
const timed = delay(func);

/**
 * A Scheduler that allows scheduling on a separate worker thread.
 *
 * Scheduled functions are not executed on the worker thread, rather,
 * the worker thread emits a message event that schedules the function.
 */
export default class WorkerScheduler extends SchedulerInterface {
  static get instance() {
    if (typeof INSTANCE === 'undefined') {
      INSTANCE = new WorkerScheduler();
    }
    return INSTANCE;
  }

  /**
   * Schedules the function on the separate worker thread.
   * @param {!function} fn
   * A function that is called after being scheduled.
   * @returns {Cancellable}
   * Returns an Cancellable that allows
   * to cancel the schedule.
   */
  schedule(fn) {
    return sched(fn);
  }

  /**
   * Schedules the function on the separate worker thread.
   * @param {!function} fn
   * A function that is called after being scheduled.
   * @param {!number} amount
   * The amount of delay in milliseconds.
   * @returns {Cancellable}
   * Returns an Cancellable that allows
   * to cancel the schedule.
   */
  delay(fn, amount) {
    return timed(fn, amount);
  }
}
