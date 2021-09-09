import { SearchQueryBuilder } from "@esri/arcgis-rest-portal";
import { parseDatasetId } from "@esri/hub-common";

/**
 * Builds the Portal API query string to search for exports from a given dataset
 *
 * @param datasetId - The dataset ID
 * @param options - A set of options including requested export types and spatialRefId
 * @returns
 */
export function buildExistingExportsPortalQuery(
  datasetId: string,
  options: {
    formats?: string[];
    spatialRefId: string;
  }
) {
  const { formats, spatialRefId } = options;

  const { itemId, layerId } = parseDatasetId(datasetId);

  const query = new SearchQueryBuilder()
    .match(`exportItem:${itemId}`)
    .in("typekeywords")
    .and()
    .match(`exportLayer:${layerId ? `0${layerId}` : null}`)
    .in("typekeywords");

  if (formats?.length) {
    query.and().startGroup();

    formats.forEach((format, i) => {
      query.match(format).in("type");

      if (i < formats.length - 1) {
        query.or();
      }
    });

    query.endGroup();
  }

  if (spatialRefId) {
    query.and().match(spatialRefId).in("spatialRefId");
  }

  return query.toParam();
}
