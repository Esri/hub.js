import { atob } from "@esri/hub-common";
import { ISearchParams } from "../../ago/params";
import { IDateRange } from "../../types/common";
import {
  IBooleanOperator,
  IContentFieldFilter,
  IContentSearchFilter,
  IContentSearchOptions,
  IContentSearchRequest,
} from "../../types/content";
import {
  isFilterAnArrayWithData,
  isFilterANonEmptyString,
  isFilterFieldADateRange,
} from "./common";

const TERM_FIELD = "terms";
const VALID_CATALOG_PROPS = ["id", "orgid", "group", "initiativeid"];

// Necessary to map Portal API-supported properties to Hub Indexer Search API properties
const PROP_MAP: Record<string, string> = {
  group: "groupIds",
  title: "name",
  typekeywords: "typeKeywords",
  orgid: "orgId",
  initiativeid: "initiativeId",
};

// Necessary to map Portal API-supported values of properties to Hub Indexer Search API properties
const VALUE_MAP: Record<string, Record<string, string>> = {
  access: {
    org: "organization",
    shared: "team",
    private: "myself",
  },
};

/**
 * Converts the common request format of contentSearch to a format specific to the Hub V3 Search API
 * @param request - the IContentSearchRequest instance for searching
 */
export function convertToHubParams(
  request: IContentSearchRequest
): ISearchParams {
  const { termField, filterFields, catalogFields }: Record<string, any> =
    splitFilterTerms(request);
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
    options: request.options,
  });
}

function splitFilterTerms(request: IContentSearchRequest): Record<string, any> {
  const filter: IContentSearchFilter = request.filter || {};
  return Object.keys(filter).reduce(
    (filterObj: Record<string, any>, key: string) => {
      const hubKey: string = PROP_MAP[key] ? PROP_MAP[key] : key;
      if (isFilterATerm(key)) {
        filterObj.termField = filter[key];
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
  filterFields: Record<string, any>
): Record<string, string> {
  return Object.keys(filterFields).reduce(
    (filterObj: Record<string, string>, key: string) => {
      const clause = convertToHubFilterClause(key, filterFields[key]);
      if (clause) {
        filterObj[key] = clause;
      }
      return filterObj;
    },
    {}
  );
}

function processCatalog(
  catalogFields: Record<string, any>
): Record<string, string> {
  return Object.keys(catalogFields).reduce(
    (catalogObj: Record<string, string>, key: string) => {
      const clause: string = convertToHubFilterClause(key, catalogFields[key]);
      if (clause) {
        catalogObj[key] = clause;
      }
      return catalogObj;
    },
    {}
  );
}

function processPage(request: IContentSearchRequest): string {
  const options: IContentSearchOptions = request.options || {};
  return options.page;
}

function createSearchOptions(params: Record<string, any>): ISearchParams {
  const options = params.options || {};
  const sort = createSort(options.sortField, options.sortOrder);
  const agg = getAggregations(options.aggregations);
  const fields = getFields(options.fields);

  const searchParams: ISearchParams = {
    q: params.termField || undefined,
    sort,
    filter: params.filter,
    catalog: params.catalog,
    page: params.paging && { key: params.paging },
    agg,
    fields,
  };

  return searchParams;
}

function convertToHubFilterClause(
  filterField: string,
  filterValue: any
): string {
  if (isFilterANonEmptyString(filterValue)) {
    return processArrayFilter(filterField, [filterValue as string]);
  } else if (isFilterAnArrayWithData(filterValue)) {
    return processArrayFilter(filterField, filterValue as string[]);
  } else if (isFilterFieldADateRange(filterField, filterValue)) {
    return processDateField(filterValue as IDateRange<number>);
  } else {
    return processFieldFilter(filterValue as IContentFieldFilter);
  }
}

function processArrayFilter(field: string, filterArray: string[]): string {
  const modifiedFilterValues = filterArray.map((filter: string) => {
    if (VALUE_MAP[field] && VALUE_MAP[field][filter]) {
      return VALUE_MAP[field][filter];
    }
    return filter;
  });
  return `any(${modifiedFilterValues.join(",")})`;
}

function processDateField(dateFilterValue: IDateRange<number>) {
  const from = dateFilterValue.from || 0;
  const to = dateFilterValue.to || new Date().getTime();
  return `between(${convertDateEpochToString(from)},${convertDateEpochToString(
    to
  )})`;
}

function processFieldFilter(contentFilter: IContentFieldFilter): string {
  if (!contentFilter || !isFilterAnArrayWithData(contentFilter.value)) {
    return undefined;
  }

  const operator: IBooleanOperator = contentFilter.bool || IBooleanOperator.OR;
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
        fields: aggregations,
      }
    : undefined;
}

function getFields(fields: string) {
  return fields
    ? {
        datasets: fields,
      }
    : undefined;
}
