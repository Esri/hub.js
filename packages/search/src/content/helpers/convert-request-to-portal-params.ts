import { IPagingParams, ISearchOptions } from '@esri/arcgis-rest-portal';
import { decode } from "base-64";
import { IBooleanOperator, IContentSearchFilter, IContentSearchOptions, IContentSearchRequest, IContentFieldFilter } from "../../types/content";
import { IDateRange } from '../../types/common';
import { Logger } from '@esri/hub-common';

const STRING_ENCLOSED_FILTER_FIELDS = ['title', 'type', 'typekeywords', 'description', 'tags', 'snippet', 'categories'];
const DATE_FILTER_FIELDS = ['created', 'modified'];

export function convertToPortalParams(request: IContentSearchRequest): ISearchOptions {
  const q: string = processFilter(request);
  const paging: IPagingParams = processPage(request);
  return createSearchOptions(q, paging, request.options)
}

function processFilter(request: IContentSearchRequest): string {
  const filter: IContentSearchFilter = request.filter || {};
  const filters: string[] = Object.keys(filter).reduce((arr: string[], key: string) => {
    const filterClause = convertToPortalFilterClause(key, filter[key]);
    if (filterClause) {
      arr.push(filterClause)
    }
    return arr;
  }, [])
  return filters.join(" AND ").trim();
}

function processPage(request: IContentSearchRequest): IPagingParams {
  const options: IContentSearchOptions = request.options;
  const providedPage: IPagingParams | string = options.page || { start: 1, num: 10 };
  return typeof providedPage === 'string' ? decodePage(providedPage) : providedPage;
}

function createSearchOptions(q: string, page: IPagingParams, options: IContentSearchOptions): ISearchOptions {
  return {
    q,
    sortOrder: options.sortOrder,
    sortField: options.sortField,
    start: page.start,
    num: page.num,
    countFields: options.aggregations,
    countSize: 200,
    bbox: options.bbox
  }
}

function convertToPortalFilterClause(filterField: string, filterValue: any): string {
  if (!filterValue) {
    return null;
  } else if (isFilterAString(filterValue)) {
    return processStringFilter(filterField, filterValue as string);
  } else if (isFilterAnArray(filterValue)) {
    return processArrayFilter(filterField, filterValue as string[]);
  } else if (isFilterFieldADateRange(filterField)) {
    return processDateField(filterField, filterValue as IDateRange<number>);
  } else {
    return processFieldFilter(filterField, filterValue as IContentFieldFilter);
  }
}

function processStringFilter(filterField: string, filterValue: string): string {
  return `(${stringifyFilterValue(filterField, filterValue)})`;
}

function processArrayFilter(filterField: string, filterArray: string[]): string {
  const filters = filterArray.map((filter: string) => stringifyFilterValue(filterField, filter));
  return `(${filterField}: ${filters.join(` OR ${filterField}: `)})`;
}

function processDateField(filterField: string, filterValue: IDateRange<number>) {
  return `(${filterField}: [${filterValue.from || 0} TO ${filterValue.to || new Date().getTime()}])`;
}

function processFieldFilter(filterField: string, contentFilter: IContentFieldFilter): string {
  const operator: IBooleanOperator = contentFilter.bool || IBooleanOperator.OR;
  const filters = contentFilter.value.map((filter: string) => stringifyFilterValue(filterField, filter));

  if (operator === IBooleanOperator.NOT) {
    return `(-${filterField}: ${filters.join(` AND -${filterField}: `)})`;
  } else {
    return `(${filterField}: ${filters.join(` ${operator.toString()} ${filterField}: `)})`;
  }
}

function isFilterAString(filterValue: any) {
  return typeof filterValue === "string";
}

function isFilterAnArray(filterValue: any) {
  return Array.isArray(filterValue);
}

function isFilterFieldADateRange(filterField: string) {
  return DATE_FILTER_FIELDS.indexOf(filterField) >= 0;
}

function decodePage(page: string): IPagingParams {
  try {
    const decodedPage: any = decode(page);
    return JSON.parse(decodedPage);
  } catch (err) {
    Logger.error(`error decoding and parsing the provided page: ${page}. Defaulting to starting page`)
    return { start: 1, num: 10 };
  }
}

function stringifyFilterValue(filterField: string, filterValue: string): string {
  return STRING_ENCLOSED_FILTER_FIELDS.indexOf(filterField) >= 0 ? `"${filterValue}"` : filterValue;
}