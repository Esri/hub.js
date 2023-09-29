import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IHubTemplate } from "../core/types/IHubTemplate";
import { IModel } from "../types";
import { isGuid } from "../utils";
import { IItem, getItem } from "@esri/arcgis-rest-portal";
import { getItemBySlug } from "../items/slugs";
import { fetchModelFromItem } from "../models";
import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { computeProps } from "./_internal/computeProps";

/**
 * @private
 * Fetch a Hub Template backing item by id or slug
 * @param identifier item id or slug
 * @param requestOptions
 */
export async function fetchTemplate(
  identifier: string,
  requestOptions: IRequestOptions
): Promise<IHubTemplate> {
  let getPrms;
  if (isGuid(identifier)) {
    getPrms = getItem(identifier, requestOptions);
  } else {
    getPrms = getItemBySlug(identifier, requestOptions);
  }
  return getPrms.then((item) => {
    if (!item) return null;
    return convertItemToTemplate(item, requestOptions);
  });
}

/**
 * @private
 * Convert an Hub Solution Item into a Hub Template, fetching
 * any additional information that may be required
 * @param item
 * @param auth
 */
export async function convertItemToTemplate(
  item: IItem,
  requestOptions: IRequestOptions
): Promise<IHubTemplate> {
  const model = await fetchModelFromItem(item, requestOptions);
  // 1. Create a property mapper between the the template
  // object and item model
  const mapper = new PropertyMapper<Partial<IHubTemplate>, IModel>(
    getPropertyMap()
  );

  // 2. Map the item into an IHubTemplate
  const template = mapper.storeToEntity(model, {}) as IHubTemplate;

  // 3. Compute + set various properties on the IHubTemplate
  // that cannot be directly mapped from the item
  return computeProps(model, template, requestOptions);
}
