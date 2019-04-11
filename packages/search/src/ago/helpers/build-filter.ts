export function buildFilter(queryFilters: any, key: string) {
  const terms =
    queryFilters && queryFilters[key] && queryFilters[key].terms
      ? queryFilters[key].terms
      : [];
  const joinType =
    queryFilters && queryFilters[key] && queryFilters[key].fn
      ? queryFilters[key].fn
      : undefined;
  let filter = terms
    .map((term: string) => `${key}:"${term}"`)
    .join(agoJoin(joinType));
  if (joinType === "not") {
    // "not" filter means everything but not those given terms
    filter = `NOT ${filter}`;
  }
  return `(${filter})`;
}

// This function returns the AGO-translation for the query types
// 'any' -> ' OR '
// 'all' => ' AND '
// 'not' => ' NOT '
// ... more filters to come, like the ones below
// 'gt' => ...
// 'lt' => ...
// 'gte' => ...
// 'lte' => ...
// 'range' => ...
function agoJoin(joinType: string) {
  const key = joinType || "any";
  const joinMap: { [key: string]: string } = {
    any: " OR ",
    all: " AND ",
    not: " NOT "
  };
  return joinMap[key];
}
