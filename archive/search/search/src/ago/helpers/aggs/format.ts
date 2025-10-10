// format raw counts for an agg field which has format like
// { hasApi: { 'true': 2, 'false': 4 } } or { downloadable: { 'true': 7, 'false': 0 } }
// into v3 like { hasApi: [{ key: 'false', docCount: 4 }, { key: 'true', docCount: 2 }] }
export function format(rawCounts: any) {
  return Object.keys(rawCounts).reduce((formattedAggs: any, field: string) => {
    formattedAggs[field] = Object.keys(rawCounts[field])
      .reduce((formatted: any, key: string) => {
        formatted.push({ key, docCount: rawCounts[field][key] });
        return formatted;
      }, [])
      .sort(compareReverse);
    return formattedAggs;
  }, {});
}

function compareReverse(a: any, b: any) {
  return b.docCount > a.docCount ? 1 : -1;
}
