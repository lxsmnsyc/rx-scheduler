var Scheduler = (function (rxCancellable) {
  'use strict';

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
     * @returns {Cancellable}
     * Returns an Cancellable that allows
     * to cancel the schedule.
     * @abstract
     */
    schedule(fn) {}

    /**
     * Schedules the given function at a delayed time.
     * @param {!function} fn
     * A function that is called after being scheduled.
     * @param {!number} amount
     * The amount of delay in milliseconds.
     * @returns {Cancellable}
     * Returns an Cancellable that allows
     * to cancel the schedule.
     * @abstract
     */
    delay(fn, amount) {
    }
  }

  /**
   * @ignore
   */
  const protect = (fn, x) => {
    try {
      fn();
    } finally {
      x.cancel();
    }
  };
  /**
   * @ignore
   */
  const createController = (scheduler, fn, body) => {
    const controller = new rxCancellable.BooleanCancellable();
    if (typeof fn === 'function') {
      // eslint-disable-next-line no-new
      scheduler(() => body(controller));
    } else {
      controller.cancel();
    }
    return controller;
  };
  /**
   * @ignore
   */
  const schedule = scheduler => fn => createController(
    scheduler,
    fn,
    x => !x.cancelled && protect(fn, x),
  );
  /**
   * @ignore
   */
  const delay = scheduler => (fn, amount) => createController(
    scheduler,
    fn,
    (x) => {
      if (x.cancelled) {
        return;
      }

      if (typeof amount === 'number' && amount > 0) {
        const inner = setTimeout(() => !x.cancelled && protect(fn, x), amount);
        x.addEventListener('cancel', () => clearTimeout(inner));
      } else {
        protect(fn, x);
      }
    },
  );

  /* eslint-disable class-methods-use-this */

  /**
   * @ignore
   */
  let INSTANCE;
  /**
   * @ignore
   */
  const func = x => requestAnimationFrame(x);
  /**
   * @ignore
   */
  const sched = schedule(func);
  /**
   * @ignore
   */
  const timed = delay(func);
  /**
   * A Scheduler that allows immediate scheduling, using requestAnimationFrame.
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
     * A function that is called after being scheduled.
     * @returns {Cancellable}
     * Returns an Cancellable that allows
     * to cancel the schedule.
     */
    schedule(fn) {
      return sched(fn);
    }

    /**
     * Schedules the given function at a delayed time.
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

  /* eslint-disable class-methods-use-this */

  /**
   * @ignore
   */
  let INSTANCE$1;

  /**
   * @ignore
   */
  const func$1 = x => Promise.resolve().then(x);
  /**
   * @ignore
   */
  const sched$1 = schedule(func$1);
  /**
   * @ignore
   */
  const timed$1 = delay(func$1);

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
     * A function that is called after being scheduled.
     * @returns {Cancellable}
     * Returns an Cancellable that allows
     * to cancel the schedule.
     */
    schedule(fn) {
      return sched$1(fn);
    }

    /**
     * Schedules the given function at a delayed time on the async task.
     * @param {!function} fn
     * A function that is called after being scheduled.
     * @param {!number} amount
     * The amount of delay in milliseconds.
     * @returns {Cancellable}
     * Returns an Cancellable that allows
     * to cancel the schedule.
     */
    delay(fn, amount) {
      return timed$1(fn, amount);
    }
  }

  /* eslint-disable class-methods-use-this */

  let INSTANCE$2;
  /**
   * @ignore
   */
  const func$2 = x => setTimeout(x, 0);
  /**
   * @ignore
   */
  const sched$2 = schedule(func$2);
  /**
   * @ignore
   */
  const timed$2 = delay(func$2);
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
     * A function that is called after being scheduled.
     * @returns {Cancellable}
     * Returns an Cancellable that allows
     * to cancel the schedule.
     */
    schedule(fn) {
      return sched$2(fn);
    }

    /**
     * Schedules the given function at a delayed time on the timeout task.
     * @param {!function} fn
     * A function that is called after being scheduled.
     * @param {!number} amount
     * The amount of delay in milliseconds.
     * @returns {Cancellable}
     * Returns an Cancellable that allows
     * to cancel the schedule.
     */
    delay(fn, amount) {
      return timed$2(fn, amount);
    }
  }

  /* eslint-disable class-methods-use-this */

  /**
   * @ignore
   */
  let INSTANCE$3;
  /**
   * @ignore
   */
  const func$3 = x => x();
  /**
   * @ignore
   */
  const sched$3 = schedule(func$3);
  /**
   * @ignore
   */
  const timed$3 = delay(func$3);

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
     * A function that is called after being scheduled.
     * @returns {Cancellable}
     * Returns an Cancellable that allows
     * to cancel the schedule.
     */
    schedule(fn) {
      return sched$3(fn);
    }

    /**
     * Schedules the given function at a delayed time on the current task.
     * @param {!function} fn
     * A function that is called after being scheduled.
     * @param {!number} amount
     * The amount of delay in milliseconds.
     * @returns {Cancellable}
     * Returns an Cancellable that allows
     * to cancel the schedule.
     */
    delay(fn, amount) {
      return timed$3(fn, amount);
    }
  }

  /* eslint-disable class-methods-use-this */

  /**
   * @ignore
   */
  let INSTANCE$4;

  /**
   * @ignore
   */
  const func$4 = (() => {
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
  const sched$4 = schedule(func$4);
  /**
   * @ignore
   */
  const timed$4 = delay(func$4);

  /**
   * A Scheduler that allows scheduling on a separate worker thread.
   *
   * Scheduled functions are not executed on the worker thread, rather,
   * the worker thread emits a message event that schedules the function.
   */
  class WorkerScheduler extends SchedulerInterface {
    static get instance() {
      if (typeof INSTANCE$4 === 'undefined') {
        INSTANCE$4 = new WorkerScheduler();
      }
      return INSTANCE$4;
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
      return sched$4(fn);
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
      return timed$4(fn, amount);
    }
  }

  /* eslint-disable class-methods-use-this */

  /**
   * @ignore
   */
  let INSTANCE$5;

  /**
   * @ignore
   */
  const func$5 = (() => {
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
  const sched$5 = schedule(func$5);
  /**
   * @ignore
   */
  const timed$5 = delay(func$5);

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
  class PoolScheduler extends SchedulerInterface {
    static get instance() {
      if (typeof INSTANCE$5 === 'undefined') {
        INSTANCE$5 = new PoolScheduler();
      }
      return INSTANCE$5;
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
      return sched$5(fn);
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
      return timed$5(fn, amount);
    }
  }

  /**
   * Scheduler is an object that specifies an API for scheduling units of work.
   * These units of work are scheduled either executed immediately or enqueued and
   * executed using a callback mechanism.
   *
   * Scheduler provides 4 types of scheduling mechanism:
   * - Current: executes the task immediately.
   * - Immediate: schedules the task for the next frame.
   * - Async: schedules the task asynchronously (as a microtask).
   * - Timeout: schedules the task using setTimeout.
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

    static get worker() {
      return WorkerScheduler.instance;
    }

    static get pool() {
      return PoolScheduler.instance;
    }
  }

  return Scheduler;

}(Cancellable));
