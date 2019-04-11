/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
/**
 * @interface
 */
export default class SchedulerInterface {
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
