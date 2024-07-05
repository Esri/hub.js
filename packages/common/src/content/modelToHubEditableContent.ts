import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IModel } from "../types";
import { IItemAndIServerEnrichments } from "../items/_enrichments";
import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { IHubEditableContent } from "../core/types/IHubEditableContent";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { computeProps } from "./_internal/computeProps";

export function modelToHubEditableContent(
  model: IModel,
  requestOptions: IRequestOptions,
  enrichments: IItemAndIServerEnrichments
) {
  const mapper = new PropertyMapper<Partial<IHubEditableContent>, IModel>(
    getPropertyMap()
  );
  const content = mapper.storeToEntity(model, {}) as IHubEditableContent;
  return computeProps(model, content, requestOptions, enrichments);
}
