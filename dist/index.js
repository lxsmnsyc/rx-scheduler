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
    x => !x.cancelled && fn() && x.cancel(),
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
        const inner = setTimeout(() => !x.cancelled && fn() && x.cancel(), amount);
        x.addEventListener('cancel', () => clearTimeout(inner));
      } else {
        fn();
        x.cancel();
      }
    },
  );

  /* eslint-disable class-methods-use-this */

  let INSTANCE;

  const func = x => requestAnimationFrame(x);
  const sched = schedule(func);
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

  let INSTANCE$1;

  const func$1 = x => Promise.resolve().then(x);
  const sched$1 = schedule(func$1);
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

  const func$2 = x => setTimeout(x, 0);
  const sched$2 = schedule(func$2);
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

  let INSTANCE$3;

  const func$3 = x => x();
  const sched$3 = schedule(func$3);
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
  }

  return Scheduler;

}(Cancellable));
