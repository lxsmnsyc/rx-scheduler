/* eslint-disable class-methods-use-this */
import ImmediateCurrentScheduler from './immediate';
import MicroCurrentScheduler from './micro';
import MacroCurrentScheduler from './macro';
import SchedulerGroup from '../scheduler-group';

let INSTANCE;
export default class CurrentScheduler extends SchedulerGroup {
  static get instance() {
    if (typeof INSTANCE === 'undefined') {
      INSTANCE = new MicroCurrentScheduler();
    }
    return INSTANCE;
  }

  get immediate() {
    return ImmediateCurrentScheduler.instance;
  }

  get micro() {
    return MicroCurrentScheduler.instance;
  }

  get macro() {
    return MacroCurrentScheduler.instance;
  }
}
