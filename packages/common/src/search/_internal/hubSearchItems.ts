import { IItem } from "@esri/arcgis-rest-types";
import { IHubContent } from "../../core";
import { getProp } from "../../objects/get-prop";
import { IHubRequestOptions } from "../../types";
import { cloneObject } from "../../util";
import {
  IFilter,
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
  IPredicate,
  IQuery,
} from "../types";
import { itemToSearchResult } from "./portalSearchItems";

// ##    ##  #######  ######## ########
// ###   ## ##     ##    ##    ##
// ####  ## ##     ##    ##    ##
// ## ## ## ##     ##    ##    ######
// ##  #### ##     ##    ##    ##
// ##   ### ##     ##    ##    ##
// ##    ##  #######     ##    ########
//
// Since Hub API is still in flux, there is no code coverage for this file

/**
 * @private
 * Execute item search against the Hub API
 * @param query
 * @param options
 * @returns
 */
/* istanbul ignore next */
export async function hubSearchItems(
  _query: IQuery,
  _options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  return null;
}

export function getOgcItemQueryParams(
  query: IQuery,
  options: IHubSearchOptions
) {
  const filter = query.filters.map(formatFilterBlock).join(" AND ");
  const token = getProp(options, "requestOptions.authentication.token");
  const limit = options.num;
  // API requires the param name be all lowercase
  const startindex = options.start;

  const result = Object.entries({ filter, token, limit, startindex })
    .filter(([_key, value]) => !!value)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `?${result}`;
}

export function formatFilterBlock(filter: IFilter) {
  const operation = filter.operation || "OR";
  const formatted = filter.predicates
    .map(formatPredicate)
    .join(` ${operation} `);
  return `(${formatted})`;
}

export function formatPredicate(predicate: IPredicate) {
  const formatted = Object.entries(predicate)
    // Remove undefined entries
    .filter(([_field, value]) => !!value)
    // Create sections for each field
    .reduce((acc, [field, value]) => {
      let section;
      if (typeof value === "string") {
        // TODO: do we add single quotes for string fields?
        section = `${field}=${value}`;
      } else if (Array.isArray(value)) {
        section = `${field} IN (${value.join(", ")})`;
      } else {
        const anys = value.any && `${field} IN (${value.any.join(", ")})`;
        const alls =
          value.all &&
          value.all.map((v: string) => `${field}=${v}`).join(" AND ");
        const nots = value.not && `${field} NOT IN (${value.not.join(", ")})`;
        section = [anys, alls, nots]
          .filter((subsection) => !!subsection)
          .join(" AND ");
      }
      acc.push(section);
      return acc;
    }, [])
    // AND together all field requirements
    .join(" AND ");

  return `(${formatted})`;
}

interface IOgcItem {
  id: string;
  type: "Feature";
  geometry: any; // for simplification
  time: any; // for simplification
  links: any[]; // for simplification
  properties: Record<string, any>;
}

async function ogcItemToSearchResult(
  ogcItem: IOgcItem,
  includes: string[] = [],
  requestOptions?: IHubRequestOptions
): Promise<IHubSearchResult> {
  // OGC Api stuffs the item wholesale in  `.properties`
  // NOTE: the properties hash may also have some extraneous members such
  // as `license` and `source` if the OgcItem came from the index.
  const pseudoItem = ogcItem.properties as IItem;
  return itemToSearchResult(pseudoItem, includes, requestOptions);
}

// NOTE: don't use functions below this comment

/**
 * Re-structure a jsonApi data entry into a flat object cast into
 * IHubContent
 * @param data
 * @returns
 */
/* istanbul ignore next */
export function jsonApiToHubContent(data: Record<string, any>): IHubContent {
  const content = cloneObject(data.attributes) as unknown as IHubContent;
  content.id = data.id;
  return content;
}

/* istanbul ignore next */
export function hubContentToSearchResult(
  content: IHubContent
): Promise<IHubSearchResult> {
  const result: IHubSearchResult = {
    access: content.access,
    id: content.id,
    type: content.type,
    name: content.name,
    owner: content.owner,
    summary: content.snippet || content.description,
    createdDate: new Date(content.createdDate),
    createdDateSource: content.createdDateSource,
    updatedDate: new Date(content.updatedDate),
    updatedDateSource: content.updatedDateSource,
    thumbnailUrl: content.thumbnailUrl,
    metadata: [],
    family: content.family,
    urls: {
      portalHome: "not-implemented",
      relative: "not-implemented",
    },
  };

  // TODO: Per-type plucking of props into the `meta` hash for use in the card components

  return Promise.resolve(result);
}
