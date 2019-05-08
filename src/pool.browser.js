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

  const maxWorkers = 256;
  const totalWorkers = navigator.hardwareConcurrency || 4;

  const workers = [];
  const jobs = [];

  const recycler = [1];
  const jobQueue = [];

  const allocate = () => {
    const i = recycler[0];
    const n = recycler[i] || 0;
    if (n === 0) {
      recycler[0] = i + 1;
    } else {
      recycler[0] = n;
    }
    recycler[i] = -1;
    return i;
  };

  const deallocate = (i) => {
    if (recycler[i] === -1) {
      recycler[i] = recycler[0];
      recycler[0] = i;
    }
  };

  const createWorker = () => {
    const worker = new Worker(url);

    worker.addEventListener('message', ({ data }) => {
      if (jobs[data]) {
        jobs[data]();
        jobs[data] = null;
        deallocate(data);
      }

      if (jobQueue.length > 0) {
        worker.postMessage(jobQueue.shift());
      } else {
        workers.push(worker);
      }
    });

    return worker;
  };

  for (let i = 0; i < totalWorkers; i += 1) {
    workers[i] = createWorker();
  }

  function pushJob(fn) {
    const id = allocate();
    jobs[id] = fn;

    jobQueue.push(id);

    if (workers.length > 0) {
      workers.shift().postMessage(jobQueue.shift());
    } else if (totalWorkers < maxWorkers) {
      createWorker().postMessage(jobQueue.shift());
    }
  }

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
 * A Scheduler that allows scheduling on an idle worker thread from the worker pool.
 *
 * Scheduled functions are not executed on the worker thread, rather,
 * the worker thread emits a message event that schedules the function, in
 * which the functions are called on the main thread.
 *
 * There are a maximum of 256 workers, only 4 or your hardware's concurrency
 * (nagivator.hardwareConcurrency) size are precreated.
 *
 * Execution sequence may be arbitrary due to varying execution times for each worker.
 */
export default class PoolScheduler extends SchedulerInterface {
  static get instance() {
    if (typeof INSTANCE === 'undefined') {
      INSTANCE = new PoolScheduler();
    }
    return INSTANCE;
  }

  /**
   * Schedules the function on an idle worker thread from the worker pool.
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
   * Schedules the function on an idle worker thread from the worker pool.
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
