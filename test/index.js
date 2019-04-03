/* eslint-disable no-undef */
import assert from 'assert';
import Scheduler from '../src/index.node';
import SchedulerInterface from '../src/scheduler-interface';

describe('Scheduler', () => {
  describe('#current', () => {
    it('should return a SchedulerInterface', () => {
      assert(Scheduler.current instanceof SchedulerInterface);
    });
  });
});
