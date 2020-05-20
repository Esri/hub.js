/**
 * Wrapper over window.location
 */
/* istanbul ignore next */
export function _getLocation() {
  /* istanbul ignore next */
  if (window) {
    return window.location;
  }
}
