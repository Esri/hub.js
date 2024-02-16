import { getItem } from "@esri/arcgis-rest-portal";
import { IItem } from "@esri/arcgis-rest-types";
import { IHubFeedback } from "../core/types/IHubFeedback";
import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { fetchSetting, getDefaultEntitySettings } from "../discussions";
import { getItemBySlug } from "../items";
import { fetchModelFromItem } from "../models";
import { IHubRequestOptions, IModel } from "../types";
import { isGuid } from "../utils";
import { computeProps } from "./_internal/computeProps";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { getFormJson } from "../surveys/get-form-json";

/**
 * @private
 * Get a Feedback entity by id or slug
 * @param identifier item id or slug
 * @param requestOptions request options
 * @returns a promise that resolves a IHubFeedback object
 */
export async function fetchFeedback(
  identifier: string,
  requestOptions: IHubRequestOptions
): Promise<IHubFeedback> {
  let getPrms;
  if (isGuid(identifier)) {
    // get item by id
    getPrms = getItem(identifier, requestOptions);
  } else {
    getPrms = getItemBySlug(identifier, requestOptions);
  }
  return getPrms.then((item) => {
    if (!item) return null;
    return convertItemToFeedback(item, requestOptions);
  });
}

/**
 * @private
 * Convert a Hub Feedback Item into a Hub Feedback entity, fetching any additional
 * information that may be required
 * @param item the feedback item
 * @param auth request options
 * @returns a promise that resolves a IHubFeedback object
 */
export async function convertItemToFeedback(
  item: IItem,
  requestOptions: IHubRequestOptions
): Promise<IHubFeedback> {
  const model = await fetchModelFromItem(item, requestOptions);
  model.formJSON = await getFormJson(item, requestOptions);
  const mapper = new PropertyMapper<Partial<IHubFeedback>, IModel>(
    getPropertyMap()
  );
  const feedback = mapper.storeToEntity(model, {}) as IHubFeedback;
  return computeProps(model, feedback, requestOptions);
}
