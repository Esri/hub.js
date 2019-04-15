import { ISearchParams } from "./params";
import { paramSchema } from "./param-schema";

/**
 * Create filters
 *
 * @param {ISearchParams} params
 * @returns {Promise<any>}
 */
export function createFilters(params: ISearchParams): any {
  const queryParams = Object.assign({}, params);
  const filter = Object.keys(queryParams).reduce((filters: any = {}, key) => {
    const paramDefinition = paramSchema[key] || {};
    if (
      !!queryParams[key] &&
      paramDefinition.type === "filter" &&
      paramDefinition.dataType
    ) {
      const values = queryParams[key];
      filters[key] = generateFilter(values, paramDefinition);
    }
    return filters;
  }, {});
  // return an object with a filters key if any filters were generated
  return Object.keys(filter).length > 0 ? { filter } : {};
}

function generateFilter(values: string, paramDefinition: any) {
  // user has passed in a query like any(foo,bar)
  const match = values.match(/(any|all)\((.+)\)/);
  if (match) {
    return {
      fn: match[1],
      terms: match[2].split(","),
      catalogDefinition: paramDefinition.catalogDefinition
    };
  } else {
    return {
      fn: paramDefinition.defaultOp || null,
      terms: values.split(","),
      catalogDefinition: paramDefinition.catalogDefinition
    };
  }
}
