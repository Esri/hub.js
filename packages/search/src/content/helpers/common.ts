import { decode } from "base-64";
import { Logger } from "@esri/hub-common";
import { IPagingParams } from "@esri/arcgis-rest-portal";
import {
  IContentSearchOptions,
  IContentSearchRequest
} from "../../types/content";

const DATE_FILTER_FIELDS = ["created", "modified"];

export function isFilterAString(filterValue: any) {
  return typeof filterValue === "string";
}

export function isFilterAnArray(filterValue: any) {
  return Array.isArray(filterValue);
}

export function isFilterFieldADateRange(filterField: string) {
  return DATE_FILTER_FIELDS.indexOf(filterField) >= 0;
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

export function decodePage(page: string): IPagingParams {
  try {
    if (!page) {
      return undefined;
    }
    const decodedPage: any = decode(page);
    return JSON.parse(decodedPage);
  } catch (err) {
    Logger.error(
      `error decoding and parsing the provided page: ${page}. Defaulting to starting page`
    );
    return undefined;
  }
}
