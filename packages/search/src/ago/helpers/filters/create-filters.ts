import { ISearchParams } from "../../params";
import { filterSchema } from "./filter-schema";

/**
 * Create filters object based on raw params like tags=a,b or tags=any(a,b)
 *
 * @param {ISearchParams} params
 * @returns {any}
 */
// return a standard filter object
// given a query string that looks like this:
//
// ?tags=tag1,tag2&source=source1,source2
//
// This function will return a filter like:
//
// {
//   filter: {
//     tags: {
//       fn: 'all',
//       terms: [ 'tag1', 'tag2' ]
//     },
//     source: {
//       fn: 'any',
//       terms: [ 'source1', 'source2' ]
//     }
//   }
// }
export function createFilters(params: ISearchParams): any {
  const filter = Object.keys(params).reduce((filters: any, key) => {
    const filterDefinition = filterSchema[key] || {};
    if (
      params[key] &&
      filterDefinition.type === "filter" &&
      filterDefinition.dataType
    ) {
      const values = params[key];
      filters[key] = generateFilter(values, filterDefinition);
    }
    return filters;
  }, {});
  return filter;
}

export function generateFilter(values: string, filterDefinition: any) {
  const match = values.match(/(any|all)\((.+)\)/);
  if (match) {
    return {
      fn: match[1],
      terms: match[2].split(","),
      catalogDefinition: filterDefinition.catalogDefinition
    };
  } else {
    return {
      fn: filterDefinition.defaultOp || null,
      terms: values.split(","),
      catalogDefinition: filterDefinition.catalogDefinition
    };
  }
}
