import ImmediateCurrentScheduler from './immediate';
import MicroCurrentScheduler from './micro';
import MacroCurrentScheduler from './macro';

export default class CurrentScheduler {
  static get immediate() {
    return ImmediateCurrentScheduler;
  }

  static get micro() {
    return MicroCurrentScheduler;
  }

  static get macro() {
    return MacroCurrentScheduler;
  }
}
