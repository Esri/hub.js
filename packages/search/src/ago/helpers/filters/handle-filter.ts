import { buildFilter } from "./build-filter";
import { downloadable } from "./downloadable";
import { hasApi } from "./has-api";
import { groupIds } from "./group-ids";
import { collection } from "./collection";

// custom filter functions
const customFilters: any = {
  downloadable,
  hasApi,
  groupIds,
  collection
};

function isCustomFilter(filter: any) {
  return !!customFilters[filter];
}

/**
 * Convert filter object into AGO filter string
 * @param queryFilters filter object created by create-filters like { tags: { fn: 'all', terms: ['a'] } }
 */
export function handleFilter(queryFilters: any) {
  const catalogDefinition: any = [];
  const otherFilters: any = [];
  Object.keys(queryFilters).forEach(key => {
    let clause;
    if (isCustomFilter(key)) {
      clause = customFilters[key](queryFilters, key);
    } else {
      clause = buildFilter(queryFilters, key);
    }
    if (queryFilters[key].catalogDefinition) {
      catalogDefinition.push(clause);
    } else {
      otherFilters.push(clause);
    }
  });
  if (catalogDefinition.length) {
    const catalogClause = `(${catalogDefinition.join(" OR ")})`;
    if (otherFilters.length) {
      return `${catalogClause} AND (${otherFilters.join(" OR ")})`;
    } else {
      return catalogClause;
    }
  } else if (otherFilters.length) {
    return otherFilters.join(" AND ");
  } else {
    return "";
  }
}
