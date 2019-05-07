import { BooleanCancellable } from 'rx-cancellable';

/**
 * @ignore
 */
const protect = (fn, x) => {
  try {
    fn();
  } finally {
    x.cancel();
  }
};
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
  x => !x.cancelled && protect(fn, x),
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

    if (typeof amount === 'number' && amount > 0) {
      const inner = setTimeout(() => !x.cancelled && protect(fn, x), amount);
      x.addEventListener('cancel', () => clearTimeout(inner));
    } else {
      protect(fn, x);
    }
  },
);
