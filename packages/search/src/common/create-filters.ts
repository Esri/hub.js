import { ISearchParams } from "./params";

/**
 * Create filters
 *
 * @export
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

/*
 * This object will likely live in a separate file in the near future. We may even tie into the backend
 * schema so the UI always stays in sync (perhaps with a processing step)
 * catalogDefinition: true means a field is part of defining the target set of items to search before any filtering
 */
const paramSchema: any = {
  q: { type: "simple" },
  page: { type: "simple" },
  tags: {
    type: "filter",
    dataType: "string",
    defaultOp: "all"
  },
  source: {
    type: "filter",
    dataType: "string",
    defaultOp: "any"
  },
  bbox: { type: "simple" },
  location_name: { type: "simple" },
  sort: { type: "simple" },
  groupIds: {
    type: "filter",
    dataType: "string",
    defaultOp: "any",
    catalogDefinition: true
  },
  catalog: { type: "simple" },
  owner: {
    type: "filter",
    dataType: "string",
    defaultOp: "any"
  },
  access: {
    type: "filter",
    dataType: "string",
    defaultOp: "any"
  },
  type: {
    type: "filter",
    dataType: "string",
    defaultOp: "any"
  },
  hubType: {
    type: "filter",
    dataType: "string",
    defaultOp: "any"
  },
  downloadable: {
    type: "filter",
    dataType: "boolean"
  },
  hasApi: {
    type: "filter",
    dataType: "boolean"
  },
  openData: {
    type: "filter",
    dataType: "boolean"
  },
  id: {
    type: "filter",
    dataType: "string",
    defaultOp: "any",
    catalogDefinition: true
  },
  collection: {
    type: "filter",
    dataType: "string",
    defaultOp: "any"
  },
  sector: {
    type: "filter",
    dataType: "string",
    defaultOp: "any"
  },
  region: {
    type: "filter",
    dataType: "string",
    defaultOp: "any"
  }
};
