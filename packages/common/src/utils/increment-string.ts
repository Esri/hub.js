/**
 * Given a string, append a `- 1` on the end if no number is present
 * otherwise, increment the number
 * @param {string} str String to increment
 */
export function incrementString(str: string) {
  const matches = str.match(/-\s(\d+$)/);
  if (matches) {
    // get the number
    const current = parseInt(matches[1], 10);
    // replace `- current` with `- current + 1`
    const next = current + 1;
    str = str.replace(`- ${current}`, `- ${next}`);
  } else {
    str = str + " - 1";
  }
  return str;
}
