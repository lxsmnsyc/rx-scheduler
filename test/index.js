/* eslint-disable no-undef */
import assert from 'assert';
import Cancellable from 'rx-cancellable';
import Scheduler from '../src/index.node';
import SchedulerInterface from '../src/scheduler-interface';
import CurrentScheduler from '../src/current';
import ImmediateScheduler from '../src/immediate.node';
import AsyncScheduler from '../src/async';
import TimeoutScheduler from '../src/timeout';
import TickScheduler from '../src/tick';

/**
 *
 */
describe('Scheduler', () => {
  /**
   *
   */
  describe('#current', () => {
    /**
     *
     */
    it('should return a Cancellable', () => {
      const controller = Scheduler.current.schedule(() => {});

      assert(controller instanceof Cancellable);
    });
    /**
     *
     */
    it('should return a cancelled Cancellable if first arg is not a function.', () => {
      const controller = Scheduler.current.schedule(null);

      assert(controller.cancelled);
    });
    /**
     *
     */
    it('should return a SchedulerInterface', () => {
      assert(Scheduler.current instanceof SchedulerInterface);
    });
    /**
     *
     */
    it('should return a CurrentScheduler', () => {
      assert(Scheduler.current instanceof CurrentScheduler);
    });
    /**
     *
     */
    describe('#schedule', () => {
      it('should return a Cancellable.', () => {

      });
    });
    /**
     *
     */
    describe('#delay', () => {
      /**
       *
       */
      it('should return a Cancellable', () => {
        const controller = Scheduler.current.delay(() => {}, 100);

        assert(controller instanceof Cancellable);
      });
      /**
       *
       */
      it('should return a cancelled Cancellable if first arg is not a function.', () => {
        const controller = Scheduler.current.delay(null, 100);

        assert(controller.cancelled);
      });
      /**
       *
       */
      it('should execute before tick', (done) => {
        let executed;
        Scheduler.tick.delay(() => (executed ? done() : done(false)), 100);
        Scheduler.current.delay(() => { executed = true; }, 100);
      });
      /**
       *
       */
      it('should execute before async', (done) => {
        let executed;
        Scheduler.async.delay(() => (executed ? done() : done(false)), 100);
        Scheduler.current.delay(() => { executed = true; }, 100);
      });
      /**
       *
       */
      it('should execute before timeout', (done) => {
        let executed;
        Scheduler.timeout.delay(() => (executed ? done() : done(false)), 100);
        Scheduler.current.delay(() => { executed = true; }, 100);
      });
      /**
       *
       */
      it('should execute before immediate', (done) => {
        let executed;
        Scheduler.immediate.delay(() => (executed ? done() : done(false)), 100);
        Scheduler.current.delay(() => { executed = true; }, 100);
      });
    });
  });
  /**
   *
   */
  describe('#immediate', () => {
    /**
     *
     */
    it('should return a SchedulerInterface', () => {
      assert(Scheduler.immediate instanceof SchedulerInterface);
    });
    /**
     *
     */
    it('should return a ImmediateScheduler', () => {
      assert(Scheduler.immediate instanceof ImmediateScheduler);
    });
    /**
     *
     */
    describe('#schedule', () => {
      /**
       *
       */
      it('should return a Cancellable', () => {
        const controller = Scheduler.immediate.schedule(() => {});

        assert(controller instanceof Cancellable);
      });
      /**
       *
       */
      it('should return a cancelled Cancellable if first arg is not a function.', () => {
        const controller = Scheduler.immediate.schedule(null);

        assert(controller.cancelled);
      });
      /**
       *
       */
      it('should execute after current thread', (done) => {
        let executed;
        Scheduler.current.schedule(() => { executed = true; });
        Scheduler.immediate.schedule(() => (executed ? done() : done(false)));
      });
      /**
       *
       */
      it('should execute after tick', (done) => {
        let executed;
        Scheduler.tick.schedule(() => { executed = true; });
        Scheduler.immediate.schedule(() => (executed ? done() : done(false)));
      });
      /**
       *
       */
      it('should execute after async', (done) => {
        let executed;
        Scheduler.async.schedule(() => { executed = true; });
        Scheduler.immediate.schedule(() => (executed ? done() : done(false)));
      });
      /**
       *
       */
      it('should execute after timeout', (done) => {
        let executed;
        Scheduler.timeout.schedule(() => { executed = true; });
        Scheduler.immediate.schedule(() => (executed ? done() : done(false)));
      });
    });
    /**
     *
     */
    describe('#delay', () => {
      /**
       *
       */
      it('should return a Cancellable', () => {
        const controller = Scheduler.immediate.delay(() => {}, 100);

        assert(controller instanceof Cancellable);
      });
      /**
       *
       */
      it('should return a cancelled Cancellable if first arg is not a function.', () => {
        const controller = Scheduler.immediate.delay(null, 100);

        assert(controller.cancelled);
      });
      /**
       *
       */
      it('should execute after current thread', (done) => {
        let executed;
        Scheduler.current.delay(() => { executed = true; }, 100);
        Scheduler.immediate.delay(() => (executed ? done() : done(false)), 100);
      });
      /**
       *
       */
      it('should execute after tick', (done) => {
        let executed;
        Scheduler.tick.delay(() => { executed = true; }, 100);
        Scheduler.immediate.delay(() => (executed ? done() : done(false)), 100);
      });
      /**
       *
       */
      it('should execute after async', (done) => {
        let executed;
        Scheduler.async.delay(() => { executed = true; }, 100);
        Scheduler.immediate.delay(() => (executed ? done() : done(false)), 100);
      });
      /**
       *
       */
      it('should execute after timeout', (done) => {
        let executed;
        Scheduler.timeout.delay(() => { executed = true; }, 100);
        Scheduler.immediate.delay(() => (executed ? done() : done(false)), 100);
      });
    });
  });
  /**
   *
   */
  describe('#async', () => {
    /**
     *
     */
    it('should return a SchedulerInterface', () => {
      assert(Scheduler.async instanceof SchedulerInterface);
    });
    /**
     *
     */
    it('should return a AsyncScheduler', () => {
      assert(Scheduler.async instanceof AsyncScheduler);
    });
    /**
     *
     */
    describe('#schedule', () => {
      /**
       *
       */
      it('should return a Cancellable', () => {
        const controller = Scheduler.async.schedule(() => {});

        assert(controller instanceof Cancellable);
      });
      /**
       *
       */
      it('should return a cancelled Cancellable if first arg is not a function.', () => {
        const controller = Scheduler.async.schedule(null);

        assert(controller.cancelled);
      });
      /**
       *
       */
      it('should execute after current thread', (done) => {
        let executed;
        Scheduler.current.schedule(() => { executed = true; });
        Scheduler.async.schedule(() => (executed ? done() : done(false)));
      });
      /**
       *
       */
      it('should execute after tick', (done) => {
        let executed;
        Scheduler.tick.schedule(() => { executed = true; });
        Scheduler.async.schedule(() => (executed ? done() : done(false)));
      });
      /**
       *
       */
      it('should execute before timeout', (done) => {
        let executed;
        Scheduler.timeout.schedule(() => (executed ? done() : done(false)));
        Scheduler.async.schedule(() => { executed = true; });
      });
      /**
       *
       */
      it('should execute before immediate', (done) => {
        let executed;
        Scheduler.immediate.schedule(() => (executed ? done() : done(false)));
        Scheduler.async.schedule(() => { executed = true; });
      });
    });
    /**
     *
     */
    describe('#delay', () => {
      /**
       *
       */
      it('should return a Cancellable', () => {
        const controller = Scheduler.async.delay(() => {}, 100);

        assert(controller instanceof Cancellable);
      });
      /**
       *
       */
      it('should return a cancelled Cancellable if first arg is not a function.', () => {
        const controller = Scheduler.async.delay(null, 100);

        assert(controller.cancelled);
      });
      /**
       *
       */
      it('should execute after current thread', (done) => {
        let executed;
        Scheduler.current.delay(() => { executed = true; }, 100);
        Scheduler.async.delay(() => (executed ? done() : done(false)), 100);
      });
      /**
       *
       */
      it('should execute after tick', (done) => {
        let executed;
        Scheduler.tick.delay(() => { executed = true; }, 100);
        Scheduler.async.delay(() => (executed ? done() : done(false)), 100);
      });
      /**
       *
       */
      it('should execute before timeout', (done) => {
        let executed;
        Scheduler.timeout.delay(() => (executed ? done() : done(false)), 100);
        Scheduler.async.delay(() => { executed = true; }, 100);
      });
      /**
       *
       */
      it('should execute before immediate', (done) => {
        let executed;
        Scheduler.immediate.delay(() => (executed ? done() : done(false)), 100);
        Scheduler.async.delay(() => { executed = true; }, 100);
      });
    });
  });
  /**
   *
   */
  describe('#timeout', () => {
    /**
     *
     */
    it('should return a SchedulerInterface', () => {
      assert(Scheduler.timeout instanceof SchedulerInterface);
    });
    /**
     *
     */
    it('should return a TimeoutScheduler', () => {
      assert(Scheduler.timeout instanceof TimeoutScheduler);
    });
    /**
     *
     */
    describe('#schedule', () => {
      /**
       *
       */
      it('should return a Cancellable', () => {
        const controller = Scheduler.timeout.schedule(() => {});

        assert(controller instanceof Cancellable);
      });
      /**
       *
       */
      it('should return a cancelled Cancellable if first arg is not a function.', () => {
        const controller = Scheduler.timeout.schedule(null);

        assert(controller.cancelled);
      });
      /**
       *
       */
      it('should execute after current thread', (done) => {
        let executed;
        Scheduler.current.schedule(() => { executed = true; });
        Scheduler.timeout.schedule(() => (executed ? done() : done(false)));
      });
      /**
       *
       */
      it('should execute after tick', (done) => {
        let executed;
        Scheduler.tick.schedule(() => { executed = true; });
        Scheduler.timeout.schedule(() => (executed ? done() : done(false)));
      });
      /**
       *
       */
      it('should execute after async', (done) => {
        let executed;
        Scheduler.async.schedule(() => { executed = true; });
        Scheduler.timeout.schedule(() => (executed ? done() : done(false)));
      });
      /**
       *
       */
      it('should execute before immediate', (done) => {
        let executed;
        Scheduler.immediate.schedule(() => (executed ? done() : done(false)));
        Scheduler.timeout.schedule(() => { executed = true; });
      });
    });
    /**
     *
     */
    describe('#delay', () => {
      /**
       *
       */
      it('should return a Cancellable', () => {
        const controller = Scheduler.timeout.delay(() => {}, 100);

        assert(controller instanceof Cancellable);
      });
      /**
       *
       */
      it('should return a cancelled Cancellable if first arg is not a function.', () => {
        const controller = Scheduler.timeout.delay(null, 100);

        assert(controller.cancelled);
      });
      /**
       *
       */
      it('should execute after current thread', (done) => {
        let executed;
        Scheduler.current.delay(() => { executed = true; }, 100);
        Scheduler.timeout.delay(() => (executed ? done() : done(false)), 100);
      });
      /**
       *
       */
      it('should execute after tick', (done) => {
        let executed;
        Scheduler.tick.delay(() => { executed = true; }, 100);
        Scheduler.timeout.delay(() => (executed ? done() : done(false)), 100);
      });
      /**
       *
       */
      it('should execute after async', (done) => {
        let executed;
        Scheduler.async.delay(() => { executed = true; }, 100);
        Scheduler.timeout.delay(() => (executed ? done() : done(false)), 100);
      });
      /**
       *
       */
      it('should execute before immediate', (done) => {
        let executed;
        Scheduler.immediate.delay(() => (executed ? done() : done(false)), 100);
        Scheduler.timeout.delay(() => { executed = true; }, 100);
      });
    });
  });
  /**
   *
   */
  describe('#tick', () => {
    /**
     *
     */
    it('should return a SchedulerInterface', () => {
      assert(Scheduler.tick instanceof SchedulerInterface);
    });
    /**
     *
     */
    it('should return a TickScheduler', () => {
      assert(Scheduler.tick instanceof TickScheduler);
    });
    /**
     *
     */
    describe('#schedule', () => {
      /**
       *
       */
      it('should execute after current thread', (done) => {
        let executed;
        Scheduler.current.schedule(() => { executed = true; });
        Scheduler.tick.schedule(() => (executed ? done() : done(false)));
      });
      /**
       *
       */
      it('should execute before async', (done) => {
        let executed;
        Scheduler.async.schedule(() => (executed ? done() : done(false)));
        Scheduler.tick.schedule(() => { executed = true; });
      });
      /**
       *
       */
      it('should execute before timeout', (done) => {
        let executed;
        Scheduler.timeout.schedule(() => (executed ? done() : done(false)));
        Scheduler.tick.schedule(() => { executed = true; });
      });
      /**
       *
       */
      it('should execute before immediate', (done) => {
        let executed;
        Scheduler.immediate.schedule(() => (executed ? done() : done(false)));
        Scheduler.tick.schedule(() => { executed = true; });
      });
    });
    /**
     *
     */
    describe('#delay', () => {
      /**
       *
       */
      it('should return a Cancellable', () => {
        const controller = Scheduler.tick.delay(() => {}, 100);

        assert(controller instanceof Cancellable);
      });
      /**
       *
       */
      it('should return a cancelled Cancellable if first arg is not a function.', () => {
        const controller = Scheduler.tick.delay(null, 100);

        assert(controller.cancelled);
      });
      /**
       *
       */
      it('should execute after current thread', (done) => {
        let executed;
        Scheduler.current.delay(() => { executed = true; }, 100);
        Scheduler.tick.delay(() => (executed ? done() : done(false)), 100);
      });
      /**
       *
       */
      it('should execute before async', (done) => {
        let executed;
        Scheduler.async.delay(() => (executed ? done() : done(false)), 100);
        Scheduler.tick.delay(() => { executed = true; }, 100);
      });
      /**
       *
       */
      it('should execute before timeout', (done) => {
        let executed;
        Scheduler.timeout.delay(() => (executed ? done() : done(false)), 100);
        Scheduler.tick.delay(() => { executed = true; }, 100);
      });
      /**
       *
       */
      it('should execute before immediate', (done) => {
        let executed;
        Scheduler.immediate.delay(() => (executed ? done() : done(false)), 100);
        Scheduler.tick.delay(() => { executed = true; }, 100);
      });
    });
  });
});
