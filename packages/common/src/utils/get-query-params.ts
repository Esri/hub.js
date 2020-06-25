import { getProp } from '../objects';

/**
 * Get query params from current window. 
 * If no params are set, an empty object is returned. 
 * Multiple values for a single param name are assigned to an array
 * If a param is a flag (e.g. no explicit value) it's assigned a value of true
 * @returns Hash of param names to values
 */
export function getQueryParams(winRef: Window) {
  const searchString = getProp(winRef, 'location.search') || '';
  const params = searchString.split(/\?|&/);

  return params.reduce((hash: any, param: string) => {
    if (param) {
      const [name, value = true] = param.split('=');
      const currentVal = hash[name];
      if (!!currentVal) {
        hash[name] = Array.isArray(currentVal) ? currentVal.concat([value]) : [currentVal, value];
      } else {
        hash[name] = value
      }
    }
    return hash;
  }, {});
}