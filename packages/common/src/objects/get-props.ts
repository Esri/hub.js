import { getProp } from "./get-prop";

/**
 * Given an array of prop paths, return all the values that exist, in an array
 */
export function getProps(
  obj: { [index: string]: any },
  props: string[]
): any[] {
  return props.reduce((a, p) => {
    const v = getProp(obj, p);
    if (v) {
      a.push(v);
    }
    return a;
  }, []);
}
