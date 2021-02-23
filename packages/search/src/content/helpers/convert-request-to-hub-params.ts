import { ISearchParams } from "../../ago/params";
import { IDateRange } from "../../types/common";
import {
  IBooleanOperator,
  IContentFieldFilter,
  IContentSearchFilter,
  IContentSearchOptions,
  IContentSearchRequest
} from "../../types/content";
import {
  isFilterAnArray,
  isFilterAString,
  isFilterFieldADateRange
} from "./common";

const TERM_FIELD = "terms";
const VALID_CATALOG_PROPS = ["id", "orgid", "group", "initiativeid"];
const PROP_MAP: Record<string, string> = {
  group: "groupIds",
  title: "name",
  typekeywords: "typeKeywords",
  orgid: "orgId",
  initiativeid: "initiativeId"
};

export function convertToHubParams(
  request: IContentSearchRequest
): ISearchParams {
  const {
    termField,
    filterFields,
    catalogFields
  }: Record<string, any> = splitFilterTerms(request);
  const filter: Record<string, string> = Object.keys(filterFields).length
    ? processFilter(filterFields)
    : undefined;
  const catalog: Record<string, string> = Object.keys(catalogFields).length
    ? processCatalog(catalogFields)
    : undefined;
  const paging: string = processPage(request);
  return createSearchOptions({
    termField,
    filter,
    catalog,
    paging,
    options: request.options
  });
}

function splitFilterTerms(request: IContentSearchRequest): Record<string, any> {
  const filter: IContentSearchFilter = request.filter || {};
  return Object.keys(filter).reduce(
    (filterObj: Record<string, any>, key: string) => {
      const hubKey: string = PROP_MAP[key] ? PROP_MAP[key] : key;
      if (isFilterATerm(key)) {
        filterObj.termField = filter[key] ? filter[key] : undefined;
      } else if (isFilterACatalogFilter(key)) {
        filterObj.catalogFields[hubKey] = filter[key];
      } else {
        filterObj.filterFields[hubKey] = filter[key];
      }
      return filterObj;
    },
    { termField: undefined, filterFields: {}, catalogFields: {} }
  );
}

function processFilter(
  filterFields: Record<string, any> = {}
): Record<string, string> {
  return Object.keys(filterFields).reduce(
    (filterObj: Record<string, string>, key: string) => {
      if (filterFields[key]) {
        filterObj[key] = convertToHubFilterClause(key, filterFields[key]);
      }
      return filterObj;
    },
    {}
  );
}

function processCatalog(
  catalogFields: Record<string, any> = {}
): Record<string, string> {
  return Object.keys(catalogFields).reduce(
    (catalogObj: Record<string, string>, key: string) => {
      if (catalogFields[key]) {
        catalogObj[key] = convertToHubFilterClause(key, catalogFields[key]);
      }
      return catalogObj;
    },
    {}
  );
}

function processPage(request: IContentSearchRequest): string {
  const options: IContentSearchOptions = request.options || {};
  return typeof options.page === "string" ? options.page : undefined;
}

function createSearchOptions(params: Record<string, any>): ISearchParams {
  const options = params.options || {};
  const sort = createSort(options.sortField, options.sortOrder);
  const agg = getAggregations(options.aggregations);
  const fields = getFields(options.fields);

  return {
    q: params.termField,
    sort,
    filter: params.filter,
    catalog: params.catalog,
    agg,
    fields
  };
}

function convertToHubFilterClause(
  filterField: string,
  filterValue: any
): string {
  if (isFilterAString(filterValue)) {
    return processArrayFilter([filterValue as string]);
  } else if (isFilterAnArray(filterValue)) {
    return processArrayFilter(filterValue as string[]);
  } else if (isFilterFieldADateRange(filterField)) {
    return processDateField(filterValue as IDateRange<number>);
  } else {
    return processFieldFilter(filterValue as IContentFieldFilter);
  }

  function processArrayFilter(filterArray: string[]): string {
    return `any(${filterArray.join(",")})`;
  }

  function processDateField(dateFilterValue: IDateRange<number>) {
    const from = dateFilterValue.from || 0;
    const to = dateFilterValue.to || new Date().getTime();
    return `between(${convertDateEpochToString(
      from
    )},${convertDateEpochToString(to)})`;
  }

  function processFieldFilter(contentFilter: IContentFieldFilter): string {
    const operator: IBooleanOperator =
      contentFilter.bool || IBooleanOperator.OR;
    const hubOperator: string = convertToHubOperator(operator);
    const filters = contentFilter.value;
    return `${hubOperator}(${filters.join(",")})`;
  }

  function convertDateEpochToString(epoch: number): string {
    const date: string = new Date(epoch).toISOString();
    return date.substring(0, 10);
  }

  function convertToHubOperator(operator: IBooleanOperator) {
    if (operator === IBooleanOperator.NOT) {
      return "not";
    } else if (operator === IBooleanOperator.AND) {
      return "all";
    }
    return "any";
  }
}

function isFilterATerm(filterField: string) {
  return TERM_FIELD === filterField;
}

function isFilterACatalogFilter(filterField: string) {
  return VALID_CATALOG_PROPS.indexOf(filterField) >= 0;
}

function createSort(sortField: string, sortOrder: string): string {
  if (!sortField || sortField.toLowerCase() === "relevance") {
    return undefined;
  }
  const hubSortField = PROP_MAP[sortField] ? PROP_MAP[sortField] : sortField;
  const order = sortOrder && sortOrder.toLowerCase() === "desc" ? "-" : "";
  return `${order}${hubSortField}`;
}

function getAggregations(aggregations: string) {
  return aggregations
    ? {
        fields: aggregations
      }
    : undefined;
}

function getFields(fields: string) {
  return fields
    ? {
        datasets: fields
      }
    : undefined;
}
