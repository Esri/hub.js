import { getProp } from "@esri/hub-common";

/**
 * Url-encoding of search params. This function is generic enough to encode a deeply nested object
 * ```
 * Example:
 * Input: { a: { b: 2 }, c: 3 }
 * Output: 'a[b]=2&c=3'
 * ```
 * @param {Any} params (query params from hub indexer)
 * @returns {String}
 */
export function encodeParams(params: any = {}): string {
  // get raw paths
  const paths = getPaths(params);
  const flatPaths = paths.filter(path => {
    return typeof getProp(params, path.join(".")) !== "object";
  });
  const parts: string[] = [];
  // for each nested path, we want to surround it with `[]`
  // i.e. if a path is like ['a', 'b'], we want encoding as 'a[b]=2' given the input object { a: { b: 2 }, c: 3 }
  flatPaths.forEach(path => {
    let str = "";
    for (let i = 0; i < path.length; i++) {
      if (i === 0) {
        str += path[i];
      } else {
        str += `[${path[i]}]`;
      }
    }
    const right = encodeURIComponent(getProp(params, path.join(".")) || "");
    const left = encodeURIComponent(str);
    if (right) {
      parts.push(`${left}=${right}`);
    }
    return str;
  });
  const serialized = parts.join("&");
  return serialized;
}

/**
 * Get all paths to properties of an object as an array of arrays
 * where each array is a path to a property in the nested object
 * ```
 * Example:
 * Input: { a: { b: 2 }, c: 3 }
 * Output: [['a'], ['a', 'b'], ['c']]
 * ```
 * @param {Any} root the input object
 * @returns {String}
 */
export function getPaths(root: any = {}): string[][] {
  const paths: string[][] = [];
  const nodes: any[] = [
    {
      obj: root,
      path: []
    }
  ];
  while (nodes.length > 0) {
    const n = nodes.pop();
    Object.keys(n.obj).forEach(k => {
      if (typeof n.obj[k] === "object") {
        const path = n.path.concat(k);
        paths.push(path);
        nodes.unshift({
          obj: n.obj[k],
          path
        });
      } else {
        paths.push(n.path.concat(k));
      }
    });
  }
  return paths;
}
