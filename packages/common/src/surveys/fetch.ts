import { getItem } from "@esri/arcgis-rest-portal";
import { IItem } from "@esri/arcgis-rest-types";
import { IHubSurvey } from "../core/types/IHubSurvey";
import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { computeProps } from "./_internal/computeProps";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { getFormJson } from "./utils/get-form-json";
import { isGuid } from "../utils/is-guid";
import { IHubRequestOptions, IModel } from "../types";
import { getItemBySlug } from "../items/slugs";

/**
 * @private
 * Get a Survey entity by id or slug
 * @param identifier item id or slug
 * @param requestOptions request options
 * @returns a promise that resolves a IHubSurvey object
 */
export async function fetchSurvey(
  identifier: string,
  requestOptions: IHubRequestOptions
): Promise<IHubSurvey> {
  let getPrms;
  if (isGuid(identifier)) {
    // get item by id
    getPrms = getItem(identifier, requestOptions);
  } else {
    getPrms = getItemBySlug(identifier, requestOptions);
  }
  return getPrms.then((item) => {
    if (!item) return null;
    return convertItemToSurvey(item, requestOptions);
  });
}

/**
 * @private
 * Convert a Hub Survey Item into a Hub Survey entity, fetching any additional
 * information that may be required
 * @param item the Survey item
 * @param auth request options
 * @returns a promise that resolves a IHubSurvey object
 */
export async function convertItemToSurvey(
  item: IItem,
  requestOptions: IHubRequestOptions
): Promise<IHubSurvey> {
  const model: IModel = { item };
  model.formJSON = await getFormJson(item, requestOptions);
  const mapper = new PropertyMapper<Partial<IHubSurvey>, IModel>(
    getPropertyMap()
  );
  const survey = mapper.storeToEntity(model, {}) as IHubSurvey;
  return computeProps(model, survey, requestOptions);
}
