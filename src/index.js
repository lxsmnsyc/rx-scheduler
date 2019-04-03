/* eslint-disable class-methods-use-this */
import ImmediateCurrentScheduler from './immediate';
import MicroCurrentScheduler from './micro';
import MacroCurrentScheduler from './macro';

export default class Scheduler {
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
