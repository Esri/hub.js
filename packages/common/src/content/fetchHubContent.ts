import {
  EditableContentEnrichment,
  IHubEditableContentEnrichments,
} from "../items/_enrichments";
import { IHubEditableContent } from "../core/types/IHubEditableContent";
import { fetchContent, IFetchContentOptions } from "./fetchContent";
import { fetchEditableContentEnrichments } from "./_internal/fetchEditableContentEnrichments";
import { normalizeItemType } from "./compose";
import { setProp } from "../objects/set-prop";
import { modelToHubEditableContent } from "./modelToHubEditableContent";
import { fetchSettingV2 } from "../discussions/api/settings/settings";
import { getDefaultEntitySettings } from "../discussions/api/settings/getDefaultEntitySettings";
import { fetchModelFromItem } from "../models";
import { IItem } from "@esri/arcgis-rest-portal";
import { IEntitySetting } from "../discussions/api/types";
import { checkPermission } from "../permissions/checkPermission";
import { IArcGISContext } from "../types/IArcGISContext";

/**
 * fetch a content entity by identifier
 * @param identifier
 * @param requestOptions
 * @returns content entity
 */
export const fetchHubContent = async (
  identifier: string,
  context: IArcGISContext,
  enrichments?: EditableContentEnrichment[]
): Promise<IHubEditableContent> => {
  // NOTE: b/c we have to support slugs, we use fetchContent() to get the item
  // by telling it to not fetch any enrichments. We then can fetch enrichments
  // as needed after we have the item
  const options = {
    ...context.hubRequestOptions,
    enrichments: [],
  } as IFetchContentOptions;
  const { item } = await fetchContent(identifier, options);

  const editableContentEnrichments = await fetchEditableContentEnrichments(
    item,
    context.hubRequestOptions,
    enrichments
  );

  // we must normalize the underlying item type to account
  // for older items (e.g. sites that are type "Web Mapping
  // Application") before we map the model to a Hub Entity
  const type = normalizeItemType(item);
  setProp("type", type, item);

  return convertItemToContent(item, context, editableContentEnrichments);
};

/**
 * Convert an Item to an editable Hub Content object,
 * fetch any additional information that may be required
 */
export const convertItemToContent = async (
  item: IItem,
  context: IArcGISContext,
  enrichments?: IHubEditableContentEnrichments
): Promise<IHubEditableContent> => {
  const model = await fetchModelFromItem(item, context.hubRequestOptions);
  if (checkPermission("hub:content:workspace:settings:discussions", context)) {
    model.entitySettings = await fetchSettingV2({
      id: item.id,
      ...context.hubRequestOptions,
    }).catch(
      () =>
        ({
          id: null,
          ...getDefaultEntitySettings("content"),
        } as IEntitySetting)
    );
  }
  const content: Partial<IHubEditableContent> = modelToHubEditableContent(
    model,
    context.hubRequestOptions,
    enrichments
  );

  return content as IHubEditableContent;
};
