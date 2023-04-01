import { IHubEditableContent } from "../core";
import { ItemOrServerEnrichment } from "../items/_enrichments";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { IFetchContentOptions, fetchContent } from "./fetch";

export async function fetchHubContent(
  identifier: string,
  requestOptions: IRequestOptions
): Promise<IHubEditableContent> {
  // TODO: fetch data? org? ownerUser? metadata?
  // could use getItemEnrichments() and remove server, layers, etc
  // but we'd have to do that _after_ fetching the item first
  const enrichments = [] as ItemOrServerEnrichment[];
  const options = { ...requestOptions, enrichments } as IFetchContentOptions;
  // for now we call fetchContent(), which returns a superset of IHubEditableContent
  // in the long run we probably want to replace this w/ fetchItemAndEnrichments()
  // and then use the property mapper and computeProps() to compose the object
  const model = await fetchContent(identifier, options);
  // for now we still need property mapper to get defaults not set by composeContent()
  const mapper = new PropertyMapper<Partial<IHubEditableContent>>(
    getPropertyMap()
  );
  const content = mapper.modelToObject(model, {}) as IHubEditableContent;
  // TODO: computeProps if we end up using fetchItemAndEnrichments()
  return content;
}
