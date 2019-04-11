export function calcHighlights(input: string, query: string, property: string) {
  // 1. identify all the matches case insensitively
  // 2. Replace the original match(es) with mark tags
  // We want to match case insensitively but highlight case sensitively the original term
  // E.g. input string: `Capital bike share... blah blah capital.... CAPITAL`
  // We would like to highlight: `Capital`, `capital`, `CAPITAL`
  if (!input) return undefined;
  const matches = input.match(new RegExp(query, "ig")); // search globally and case insensitively
  if (!matches) return undefined;
  return matches.reduce((highlights, match) => {
    // match is what appears as is in the input string
    const replacement = `<mark class="hub-search-highlight ${property}-highlight">${match}</mark>`;
    // replace the case sensitive match with mark tags
    return highlights.replace(new RegExp(match, "g"), replacement);
  }, input);
}
