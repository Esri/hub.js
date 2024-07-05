import { IRequestOptions } from "@esri/arcgis-rest-request";
import { EditableContentEnrichment } from "../items/_enrichments";
import { IHubEditableContent } from "../core/types/IHubEditableContent";
import { IFetchContentOptions } from "./types";
import { fetchContent } from "./fetchContent";
import { fetchEditableContentEnrichments } from "./_internal/fetchEditableContentEnrichments";
import { normalizeItemType } from "./compose";
import { setProp } from "../objects/set-prop";
import { modelToHubEditableContent } from "./modelToHubEditableContent";

/**
 * fetch a content entity by identifier
 * @param identifier
 * @param requestOptions
 * @returns content entity
 */
export const fetchHubContent = async (
  identifier: string,
  requestOptions: IRequestOptions,
  enrichments?: EditableContentEnrichment[]
): Promise<IHubEditableContent> => {
  // NOTE: b/c we have to support slugs, we use fetchContent() to get the item
  // by telling it to not fetch any enrichments. We then can fetch enrichments
  // as needed after we have the item
  const options = {
    ...requestOptions,
    enrichments: [],
  } as IFetchContentOptions;
  const { item } = await fetchContent(identifier, options);

  const editableContentEnrichments = await fetchEditableContentEnrichments(
    item,
    requestOptions,
    enrichments
  );

  // we must normalize the underlying item type to account
  // for older items (e.g. sites that are type "Web Mapping
  // Application") before we map the model to a Hub Entity
  const type = normalizeItemType(item);
  setProp("type", type, item);

  return modelToHubEditableContent(
    { item },
    requestOptions,
    editableContentEnrichments
  );
};
