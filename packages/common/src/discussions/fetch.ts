import { IItem, getItem } from "@esri/arcgis-rest-portal";
import { IHubDiscussion } from "../core/types";
import { fetchModelFromItem } from "../models";
import { getItemBySlug } from "../items/slugs";
import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { computeProps } from "./_internal/computeProps";
import { getDefaultEntitySettings } from "./api/settings/getDefaultEntitySettings";
import { IHubRequestOptions, IModel } from "../types";
import { isGuid } from "../utils/is-guid";
import { fetchSetting } from "./api/settings/settings";

/**
 * @private
 * Get a Discussion by id or slug
 * @param identifier item id or slug
 * @param requestOptions request options
 * @returns a promise that resolves a IHubDiscussion
 */
export async function fetchDiscussion(
  identifier: string,
  requestOptions: IHubRequestOptions
): Promise<IHubDiscussion> {
  let getPrms;
  if (isGuid(identifier)) {
    // get item by id
    getPrms = getItem(identifier, requestOptions);
  } else {
    getPrms = getItemBySlug(identifier, requestOptions);
  }
  return getPrms.then((item) => {
    if (!item) return null;
    return convertItemToDiscussion(item, requestOptions);
  });
}

/**
 * @private
 * Convert a Hub Discussion Item into a Hub Discussion, fetching any additional
 * information that may be required
 * @param item the discussion item
 * @param auth request options
 * @returns a promise that resolves a IHubDiscussion
 */
export async function convertItemToDiscussion(
  item: IItem,
  requestOptions: IHubRequestOptions
): Promise<IHubDiscussion> {
  const model = await fetchModelFromItem(item, requestOptions);
  let entitySettings;
  try {
    entitySettings = await fetchSetting({ id: item.id, ...requestOptions });
  } catch (e) {
    const defaultSettings = getDefaultEntitySettings("discussion");
    entitySettings = {
      id: null,
      ...defaultSettings,
    };
  }
  model.entitySettings = entitySettings;
  const mapper = new PropertyMapper<Partial<IHubDiscussion>, IModel>(
    getPropertyMap()
  );
  const discussion = mapper.storeToEntity(model, {}) as IHubDiscussion;
  return computeProps(model, discussion, requestOptions);
}
