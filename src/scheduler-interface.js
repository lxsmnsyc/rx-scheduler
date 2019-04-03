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
