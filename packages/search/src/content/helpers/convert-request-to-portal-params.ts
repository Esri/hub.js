import { decode } from "base-64";
import { Logger } from "@esri/hub-common";
import { IPagingParams, ISearchOptions } from "@esri/arcgis-rest-portal";
import { UserSession } from "@esri/arcgis-rest-auth";
import {
  IBooleanOperator,
  IContentSearchFilter,
  IContentSearchOptions,
  IContentSearchRequest,
  IContentFieldFilter
} from "../../types/content";
import { IDateRange } from "../../types/common";
import {
  isFilterAnArray,
  isFilterAString,
  isFilterFieldADateRange
} from "./common";

const TERM_FIELD = "terms";
const DEFAULT_FILTERS = ['(-type: "code attachment")'];
const STRING_ENCLOSED_FILTER_FIELDS = [
  "title",
  "type",
  "typekeywords",
  "description",
  "tags",
  "snippet",
  "categories"
];

export function convertToPortalParams(
  request: IContentSearchRequest,
  servicePortalSharingUrl?: string,
  serviceSession?: UserSession
): ISearchOptions {
  const q: string = processFilter(request);
  const paging: IPagingParams = processPage(request) || { start: 1, num: 10 };
  return createSearchOptions(
    q,
    paging,
    request.options,
    servicePortalSharingUrl,
    serviceSession
  );
}

function processFilter(request: IContentSearchRequest): string {
  const filter: IContentSearchFilter = request.filter || {};
  const filters: string[] = Object.keys(filter).reduce(
    (arr: string[], key: string) => {
      /* istanbul ignore else */
      if (filter[key]) {
        arr.push(convertToPortalFilterClause(key, filter[key]));
      }
      return arr;
    },
    []
  );
  const filtersWithDefaults = addDefaultFilters(filters);
  return filtersWithDefaults.join(" AND ").trim();
}

export function processPage(request: IContentSearchRequest): IPagingParams {
  const options: IContentSearchOptions = request.options || {};
  const providedPage: IPagingParams | string = options.page || {
    start: 1,
    num: 10
  };
  return typeof providedPage === "string"
    ? decodePage(providedPage)
    : providedPage;
}

function createSearchOptions(
  q: string,
  page: IPagingParams,
  options: IContentSearchOptions = {},
  servicePortalSharingUrl?: string,
  serviceSession?: UserSession
): ISearchOptions {
  return {
    q,
    sortOrder: options.sortOrder,
    sortField: options.sortField,
    start: page.start,
    num: page.num,
    countFields: options.aggregations,
    countSize: options.aggregations ? 200 : undefined,
    bbox: options.bbox,
    portal: options.portalSharingUrl || servicePortalSharingUrl,
    authentication: options.session || serviceSession,
    httpMethod: "POST"
  };
}

function convertToPortalFilterClause(
  filterField: string,
  filterValue: any
): string {
  if (isFilterAString(filterValue)) {
    return processStringFilter(filterField, filterValue as string);
  } else if (isFilterAnArray(filterValue)) {
    return processArrayFilter(filterField, filterValue as string[]);
  } else if (isFilterFieldADateRange(filterField)) {
    return processDateField(filterField, filterValue as IDateRange<number>);
  } else {
    return processFieldFilter(filterField, filterValue as IContentFieldFilter);
  }
}

function addDefaultFilters(filters: string[]) {
  return filters.concat(DEFAULT_FILTERS);
}

function processStringFilter(filterField: string, filterValue: string): string {
  if (filterField === TERM_FIELD) {
    return `(${stringifyFilterValue(filterField, filterValue)})`;
  }
  return `(${filterField}: ${stringifyFilterValue(filterField, filterValue)})`;
}

function processArrayFilter(
  filterField: string,
  filterArray: string[]
): string {
  const filters = filterArray.map((filter: string) =>
    stringifyFilterValue(filterField, filter)
  );
  return `(${filterField}: ${filters.join(` OR ${filterField}: `)})`;
}

function processDateField(
  filterField: string,
  filterValue: IDateRange<number>
) {
  return `(${filterField}: [${filterValue.from || 0} TO ${filterValue.to ||
    new Date().getTime()}])`;
}

function processFieldFilter(
  filterField: string,
  contentFilter: IContentFieldFilter
): string {
  const operator: IBooleanOperator = contentFilter.bool || IBooleanOperator.OR;
  const filters = contentFilter.value.map((filter: string) =>
    stringifyFilterValue(filterField, filter)
  );

  if (operator === IBooleanOperator.NOT) {
    return `(-${filterField}: ${filters.join(` AND -${filterField}: `)})`;
  } else {
    return `(${filterField}: ${filters.join(
      ` ${operator.toString()} ${filterField}: `
    )})`;
  }
}

function stringifyFilterValue(
  filterField: string,
  filterValue: string
): string {
  return STRING_ENCLOSED_FILTER_FIELDS.indexOf(filterField) >= 0
    ? `"${filterValue}"`
    : filterValue;
}

export function decodePage(page: string): IPagingParams {
  try {
    const decodedPage: any = decode(page);
    return JSON.parse(decodedPage);
  } catch (err) {
    Logger.error(
      `error decoding and parsing the provided page: ${page}. Defaulting to starting page`
    );
    return undefined;
  }
}
