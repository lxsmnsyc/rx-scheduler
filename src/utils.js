import { BooleanCancellable } from 'rx-cancellable';
/**
 * @ignore
 */
const createController = (scheduler, fn, body) => {
  const controller = new BooleanCancellable();
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
  x => x.cancel() && fn(),
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
    const inner = setTimeout(() => x.cancel() && fn(), amount);

    x.addEventListener('cancel', () => clearTimeout(inner));
  },
);
