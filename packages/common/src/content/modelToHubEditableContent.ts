import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IModel } from "../hub-types";
import { IItemAndIServerEnrichments } from "../items/_enrichments";
import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { IHubEditableContent } from "../core/types/IHubEditableContent";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { computeProps } from "./_internal/computeProps";

/**
 * Converts an Imodel to a Hub editable content object
 *
 * @param model IModel to convert
 * @param requestOptions
 * @param enrichments  hash of enrichments to apply to the content
 */
export function modelToHubEditableContent(
  model: IModel,
  requestOptions: IRequestOptions,
  enrichments: IItemAndIServerEnrichments,
  content: Partial<IHubEditableContent> = {}
) {
  const mapper = new PropertyMapper<Partial<IHubEditableContent>, IModel>(
    getPropertyMap()
  );
  const updatedContent = mapper.storeToEntity(
    model,
    content
  ) as IHubEditableContent;
  return computeProps(model, updatedContent, requestOptions, enrichments);
}
