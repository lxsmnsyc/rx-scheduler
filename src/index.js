import CurrentScheduler from './current/index';

export default class Scheduler {
  static get current() {
    return CurrentScheduler;
  }
}
