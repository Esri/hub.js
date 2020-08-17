/**
 * Wrapper over window.location
 * @private
 */
/* istanbul ignore next */
export function _getLocation() {
  /* istanbul ignore next */
  if (window) {
    return window.location;
  }
}
