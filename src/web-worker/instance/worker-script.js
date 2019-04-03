/* eslint-disable no-eval */
/* eslint-disable no-restricted-globals */

self.addEventListener('message', (e) => {
  const { data } = e;

  /**
   * Destructure content
   */
  const { func, id } = data;

  try {
    eval(`const FUNCTION_ID = ${id}; (${func})()`);
  } catch (err) {
    self.postMessage({
      status: 'error',
      value: err,
    });
  }
});
