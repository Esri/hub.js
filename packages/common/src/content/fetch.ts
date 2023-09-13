import {
  getLayer,
  getService,
  parseServiceUrl,
  queryFeatures,
} from "@esri/arcgis-rest-feature-layer";
import { getItem } from "@esri/arcgis-rest-portal";
import { IHubContent, IHubEditableContent } from "../core";
import {
  ItemOrServerEnrichment,
  fetchItemEnrichments,
  IItemAndEnrichments,
  IItemAndIServerEnrichments,
} from "../items/_enrichments";
import { IHubRequestOptions, IModel } from "../types";
import { isNil } from "../util";
import { maybeConcat } from "../utils/_array";
import { addContextToSlug, isSlug, parseDatasetId } from "./slugs";
import {
  fetchHubEnrichmentsById,
  fetchHubEnrichmentsBySlug,
  getContentEnrichments,
} from "./_fetch";
import { canUseHubApiForItem } from "./_internal/internalContentUtils";
import { composeContent, getItemLayer, getProxyUrl } from "./compose";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { computeProps } from "./_internal/computeProps";
import { isHostedFeatureServiceItem } from "./hostedServiceUtils";

const hasFeatures = (contentType: string) =>
  ["Feature Layer", "Table"].includes(contentType);

interface IFetchItemAndEnrichmentsOptions extends IHubRequestOptions {
  enrichments?: ItemOrServerEnrichment[];
}

export interface IFetchContentOptions extends IFetchItemAndEnrichmentsOptions {
  layerId?: number;
  siteOrgKey?: string;
}

const maybeFetchLayerEnrichments = async (
  itemAndEnrichments: IItemAndEnrichments,
  options?: IFetchContentOptions
) => {
  const { item } = itemAndEnrichments;
  let { layers } = itemAndEnrichments;

  let layer = layers && getItemLayer(item, layers, options && options.layerId);

  // TODO: Remove once we stop supporting ArcGIS Servers below version 10.5.
  // The /layers endpoint of some earlier servers return layers and tables
  // without certain critical properties, such as type. If this is the case,
  // fetch the fully hydrated target layer and stab it onto the layers array.
  // See https://devtopia.esri.com/dc/hub/issues/3488 for more details
  if (layer && !layer.type) {
    const layerUrl = parseServiceUrl(item.url) + "/" + layer.id;
    const getLayerOptions = Object.assign({ url: layerUrl }, options); // works whether options is defined or not
    layer = await getLayer(getLayerOptions);
    layers = layers.map((unhydratedLayer) => {
      return unhydratedLayer.id === layer.id ? layer : unhydratedLayer;
    });
  }
  return {
    ...itemAndEnrichments,
    layers,
  };
};

const fetchItemAndEnrichments = async (
  itemId: string,
  options?: IFetchContentOptions
) => {
  // fetch the item
  const item = await getItem(itemId, options);

  // The Hub Application expects the item url of proxied CSVs to point to the
  // proxying feature service. Stabbing it on here maintains that consistency
  // and also helps us fetch and calculate the correct reference layer
  item.url = getProxyUrl(item, options) || item.url;

  // fetch the enrichments
  const enrichmentsToFetch =
    options?.enrichments || getContentEnrichments(item);
  const enrichments = await fetchItemEnrichments(
    item,
    enrichmentsToFetch,
    options
  );
  return maybeFetchLayerEnrichments({ ...enrichments, item }, options);
};

const fetchContentById = async (
  hubId: string,
  options?: IFetchContentOptions
) => {
  // start by fetching the item and item enrichments
  const { itemId } = parseDatasetId(hubId);
  const { item, ...itemEnrichments } = await fetchItemAndEnrichments(
    itemId,
    options
  );
  // did the caller request a specific layer
  const specifiedLayerId = options && options.layerId;
  // if this is a public item and we're not in enterprise
  // fetch the slug and remaining enrichments from the Hub API
  // const { slug, layerId, boundary, extent, searchDescription, statistics } =
  const hubEnrichments = canUseHubApiForItem(item, options)
    ? await fetchHubEnrichmentsById(hubId, options)
    : {};
  const layerId = hubEnrichments.layerId;
  // return a new content object composed from the item and enrichments we fetched
  return composeContent(item, {
    requestOptions: options,
    ...itemEnrichments,
    ...hubEnrichments,
    // prefer specified layer id if any
    layerId: isNil(specifiedLayerId) ? layerId : specifiedLayerId,
    // merge error arrays
    errors: maybeConcat([itemEnrichments.errors, hubEnrichments.errors]),
  });
};

const fetchContentBySlug = async (
  fullyQualifiedSlug: string,
  options?: IFetchContentOptions
) => {
  // we only have a slug, not an item id, so we start by
  // fetching the item id (and enrichments) from the Hub API
  // NOTE: if we are in enterprise this will throw an error
  let hubEnrichments = await fetchHubEnrichmentsBySlug(
    fullyQualifiedSlug,
    options
  );
  const { itemId } = hubEnrichments;
  let { layerId } = hubEnrichments;
  // now we can fetch the item and item enrichments
  const { item, ...itemEnrichments } = await fetchItemAndEnrichments(
    itemId,
    options
  );
  // did the caller request a specific layer
  const specifiedLayerId = options && options.layerId;
  if (!isNil(specifiedLayerId) && specifiedLayerId !== layerId) {
    // we fetched Hub enrichments by slug for another record,
    // most likely the record for the parent service of this layer,
    // so we need to fetch them for the specified layer instead
    layerId = specifiedLayerId;
    hubEnrichments = {
      ...hubEnrichments,
      ...(await fetchHubEnrichmentsById(`${itemId}_${layerId}`, options)),
    };
  }
  return composeContent(item, {
    requestOptions: options,
    ...itemEnrichments,
    ...hubEnrichments,
    layerId,
    // Note that we are not extracting the slug for the specified layer.
    // It seems that the old client composer code always populated the slug
    // field with the slug that was passed into the function (typically the
    // slug of the parent service). To maintain parity, we do the same here.
    //
    // TODO: should we prefer the slug of the fetched layer instead?
    // return a new content object composed from the item and enrichments we fetched
    slug: fullyQualifiedSlug,
    // merge error arrays
    errors: maybeConcat([itemEnrichments.errors, hubEnrichments.errors]),
  });
};

const fetchContentRecordCount = async (
  content: IHubContent,
  requestOptions: IRequestOptions
) => {
  const { url, viewDefinition } = content;
  const where = viewDefinition?.definitionExpression;
  try {
    const response: any = await queryFeatures({
      ...requestOptions,
      url,
      where,
      returnCountOnly: true,
    });
    return response.count;
  } catch {
    // swallow the error and return Infinity as a flag that the caller can act on
    // NOTE: this is what the -ui app currently expects, see:
    // https://github.com/ArcGIS/opendata-ui/blob/300601918eb2dee79a89314880541ecd60f21e68/packages/opendata-ui/app/utils/composer.js#L273-L279
    // however, we should probably push the error message into content.errors instead
    return Infinity;
  }
};

/**
 * Fetch enriched content from the Portal and Hub APIs.
 * @param identifier content slug or id
 * @param options Request options with additional options to control how the content or enrichments are fetched
 * @returns A content object composed of the backing item and enrichments
 *
 * ```js
 * import { fetchContent } from '@esri/hub-common'
 * // fetch content by slug
 * const content = await fetchContent('my-org::item-name')
 * ```
 */
export const fetchContent = async (
  identifier: string,
  options?: IFetchContentOptions
) => {
  const content = isSlug(identifier)
    ? await fetchContentBySlug(
        addContextToSlug(identifier, options?.siteOrgKey),
        options
      )
    : await fetchContentById(identifier, options);
  // fetch record count for content that has features (e.g. layers, tables, or proxied CSVs)
  const { layer, type } = content;
  // it's too expensive to always fetch the live record count up front
  // in order to avoid a breaking change, we're including the cached recordCount
  // in the list of enrichments we fetch from the Hub API and using that
  // and only fetching the live record count in cases where we don't have that
  // TODO: fetchContent() should NOT fetch record count in the next breaking change
  const canQuery = !!layer && hasFeatures(type);
  content.recordCount =
    canQuery && (isNil(content.recordCount) || content.viewDefinition)
      ? // no cached count, or this is client-side layer view, fetch the count
        await fetchContentRecordCount(content, options)
      : content.recordCount;
  return content;
};

export const fetchHubContent = async (
  identifier: string,
  requestOptions: IRequestOptions
): Promise<IHubEditableContent> => {
  // NOTE: We can't just call `getModel` because we need to be able
  // to properly handle other types like PDFs that don't have JSON data
  const item = await getItem(identifier, requestOptions);
  const enrichments: IItemAndIServerEnrichments = {};
  if (isHostedFeatureServiceItem(item)) {
    enrichments.server = await getService({
      ...requestOptions,
      url: parseServiceUrl(item.url),
    });
  }
  const model: IModel = { item };
  return modelToHubEditableContent(model, requestOptions, enrichments);
};

export function modelToHubEditableContent(
  model: IModel,
  requestOptions: IRequestOptions,
  enrichments: IItemAndIServerEnrichments = {}
) {
  const mapper = new PropertyMapper<Partial<IHubEditableContent>, IModel>(
    getPropertyMap()
  );
  const content = mapper.storeToEntity(model, {}) as IHubEditableContent;
  return computeProps(model, content, requestOptions, enrichments);
}
