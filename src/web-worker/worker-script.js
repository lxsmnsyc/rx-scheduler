/* eslint-disable no-eval */
/* eslint-disable no-restricted-globals */

self.addEventListener('message', (e) => {
  const { data } = e;

  /**
   * Destructure content
   */
  const { func, id } = data;

  let result;
  try {
    result = eval(`const FUNCTION_ID = ${id}; (${func})()`);
  } catch (err) {
    self.postMessage({
      status: 'error',
      value: err,
    });
  }

  if (result instanceof Promise) {
    result.then(
      x => self.postMessage({
        status: 'success',
        value: x,
      }),
      err => self.postMessage({
        status: 'error',
        value: err,
      }),
    );
  } else {
    self.postMessage({
      status: 'success',
      value: result,
    });
  }
});
