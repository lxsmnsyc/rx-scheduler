import Cancellable from 'rx-cancellable';
/**
 * @ignore
 */
const createController = (scheduler, fn, body) => {
  const controller = new Cancellable();
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
export const schedule = scheduler => fn => createController(
  scheduler,
  fn,
  x => !x.cancelled && fn(),
);
/**
 * @ignore
 */
export const delay = scheduler => (fn, amount) => createController(
  scheduler,
  fn,
  (x) => {
    if (x.cancelled) {
      return;
    }
    const inner = setTimeout(fn, amount);

    x.addEventListener('cancel', () => clearTimeout(inner));
  },
);
