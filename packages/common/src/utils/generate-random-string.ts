/**
 * Generate a random string of a specified length
 * User when we need to ensure a unique domain with a fixed length
 * @param {Number} chars Length of random string
 */
export function generateRandomString(chars: number): string {
  let d = new Date().getTime();
  const result = Array(chars)
    .fill(0)
    .reduce(function(acc) {
      /* tslint:disable-next-line */
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      acc = `${acc}${r.toString(16)}`;
      return acc;
    }, "");
  return result;
}
