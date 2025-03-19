import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getItem, IItem } from "@esri/arcgis-rest-portal";

import { getFamily } from "../content/get-family";
import { deriveLocationFromItem } from "../content/_internal/internalContentUtils";
import { IHubInitiativeTemplate } from "../core/types";
import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { getItemBySlug } from "../items/slugs";

import { fetchModelFromItem } from "../models";
import { IHubSearchResult } from "../search";
import { IHubRequestOptions, IModel } from "../hub-types";
import { isGuid } from "../utils";
import { computeProps } from "./_internal/computeProps";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { computeLinks } from "./_internal/computeLinks";

export async function fetchInitiativeTemplate(
  identifier: string,
  requestOptions: IRequestOptions
): Promise<IHubInitiativeTemplate> {
  let getPrms;
  if (isGuid(identifier)) {
    // get item by id
    getPrms = getItem(identifier, requestOptions);
  } else {
    getPrms = getItemBySlug(identifier, requestOptions);
  }
  return getPrms.then((item) => {
    if (!item) return null;
    return convertItemToInitiativeTemplate(item, requestOptions);
  });
}

/**
 * @private
 * Convert a Hub Initiative Template Item into a Hub Initiative Template, feching any additional
 * information that may be required
 * @param item
 * @param requestOptions
 * @returns
 */
export async function convertItemToInitiativeTemplate(
  item: IItem,
  requestOptions: IRequestOptions
): Promise<IHubInitiativeTemplate> {
  const model = await fetchModelFromItem(item, requestOptions);
  const mapper = new PropertyMapper<Partial<IHubInitiativeTemplate>, IModel>(
    getPropertyMap()
  );
  const it = mapper.storeToEntity(model, {}) as IHubInitiativeTemplate;
  return computeProps(model, it, requestOptions);
}

export async function enrichInitiativeTemplateSearchResult(
  item: IItem,
  include: string[],
  requestOptions: IHubRequestOptions
): Promise<IHubSearchResult> {
  const result: IHubSearchResult = {
    access: item.access,
    id: item.id,
    type: item.type,
    name: item.title,
    owner: item.owner,
    typeKeywords: item.typeKeywords,
    tags: item.tags,
    categories: item.categories,
    summary: item.snippet || item.description,
    createdDate: new Date(item.created),
    createdDateSource: "item.created",
    updatedDate: new Date(item.modified),
    updatedDateSource: "item.modified",
    family: getFamily(item.type),
    links: {
      self: "not-implemented",
      siteRelative: "not-implemented",
      thumbnail: "not-implemented",
      workspaceRelative: "not-implemented",
    },
    location: deriveLocationFromItem(item),
    rawResult: item,
  };

  // TODO: reimplement enrichment fetching when we know what enrichments we're looking for

  // Handle links
  // TODO: links should be an enrichment
  result.links = computeLinks(item, requestOptions);

  return result;
}
