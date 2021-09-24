import { getItem } from "@esri/arcgis-rest-portal";
import {
  IHubContent,
  cloneObject,
  datasetToContent,
  fetchDatasets,
  fetchDataset,
  mergeObjects,
} from "@esri/hub-common";
import { isSlug, addContextToSlug, parseDatasetId } from "./slugs";
import { enrichContent, IEnrichContentOptions } from "./enrichments";
// DEPRECATED: remove this at next breaking change
export {
  datasetToContent,
  datasetToItem,
  DatasetResource,
} from "@esri/hub-common";
export interface IGetContentOptions extends IEnrichContentOptions {
  siteOrgKey?: string;
}
// properties to overwrite on the hub api response with the value from the ago api response
const itemOverrides = [
  "contentStatus",
  "spatialReference",
  "accessInformation",
  "proxyFilter",
  "appCategories",
  "industries",
  "languages",
  "largeThumbnail",
  "banner",
  "screenshots",
  "listed",
  "ownerFolder",
  "protected",
  "commentsEnabled",
  "numComments",
  "numRatings",
  "avgRating",
  "numViews",
  "itemControl",
  "scoreCompleteness",
];

/**
 * Fetch a dataset resource with the given ID from the Hub API
 *
 * @param identifier Hub API slug ({orgKey}::{title-as-slug} or {title-as-slug})
 * or record id ((itemId}_{layerId} or {itemId})
 * @param options - request options that may include authentication
 * @export
 */
export function getContentFromHub(
  identifier: string,
  options?: IGetContentOptions
): Promise<IHubContent> {
  let request;
  if (isSlug(identifier)) {
    const slug = addContextToSlug(identifier, options && options.siteOrgKey);
    const opts = cloneObject(options);
    opts.params = { ...opts.params, "filter[slug]": slug };
    request = fetchDatasets(opts).then((resp) => resp && resp.data[0]);
  } else {
    request = fetchDataset(identifier, options).then(
      (resp) => resp && resp.data
    );
  }
  return request
    .then((dataset: any) => {
      // only if authed
      if (dataset && options.authentication) {
        // we fetch the item - this is because if an item is contentStatus: org_authoritative
        // we do not get that info unless we are authed in the org
        // see https://devtopia.esri.com/dc/hub/issues/53#issuecomment-2769965
        return getItem(parseDatasetId(dataset.id).itemId, options).then(
          (item) => {
            dataset.attributes = mergeObjects(
              item,
              dataset.attributes,
              itemOverrides
            );
            return dataset;
          }
        );
      } else {
        return dataset;
      }
    })
    .then((dataset: any) => {
      const content = dataset && datasetToContent(dataset);
      return content && enrichContent(content, options);
    });
}
