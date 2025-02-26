import { IHubEditableContentEnrichments } from "../items/_enrichments";
import { IHubEditableContent } from "../core/types/IHubEditableContent";
import { normalizeItemType } from "./compose";
import { setProp } from "../objects/set-prop";
import { modelToHubEditableContent } from "./modelToHubEditableContent";
import { cloneObject } from "../util";
import { IItem } from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "../hub-types";

/**
 * composes a Hub content entity from an item and optional enrichments
 * @param item item to compose content from
 * @param requestOptions request options (needed to determine certain urls)
 * @param enrichments enrichments to use during composition
 * @returns content entity
 */
export const composeHubContent = (
  item: IItem,
  requestOptions: IHubRequestOptions,
  enrichments: IHubEditableContentEnrichments
): IHubEditableContent => {
  // we must normalize the underlying item type to account
  // for older items (e.g. sites that are type "Web Mapping
  // Application") before we map the model to a Hub Entity
  const normalizedItem = cloneObject(item);
  const type = normalizeItemType(item);
  setProp("type", type, normalizedItem);

  return modelToHubEditableContent(
    { item: normalizedItem },
    requestOptions,
    enrichments
  );
};
