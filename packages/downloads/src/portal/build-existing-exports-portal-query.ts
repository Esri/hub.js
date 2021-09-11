import { SearchQueryBuilder } from "@esri/arcgis-rest-portal";

const downloadFormats = {
  csv: {
    name: 'CSV',
    itemType: 'CSV Collection',
    supportProjection: true
  },
  kml: {
    name: 'KML',
    itemType: 'KML Collection',
    supportProjection: false
  },
  shapefile: {
    name: 'Shapefile',
    itemType: 'Shapefile',
    supportProjection: true
  },
  fileGeodatabase: {
    name: 'File Geodatabase',
    itemType: 'File Geodatabase',
    supportProjection: true
  },
  geojson: {
    name: 'GeoJson',
    itemType: 'GeoJson',
    supportProjection: false
  },
  excel: {
    name: 'Excel',
    itemType: 'Microsoft Excel',
    supportProjection: true
  },
  featureCollection: {
    name: 'Feature Collection',
    itemType: 'Feature Collection',
    supportProjection: true
  }
};

/**
 * Builds the Portal API query string to search for exports from a given dataset
 *
 * @param datasetId - The dataset ID
 * @param options - A set of options including requested export types and spatialRefId
 * @returns
 */
export function buildExistingExportsPortalQuery(
  itemId: string,
  options?: {
    layerId?: number;
    onlyTypes?: string[];
    spatialRefId?: string;
  }
) {
  let types, layerId, spatialRefId
  if (options) {
    types = options.onlyTypes;
    layerId = options.layerId;
    spatialRefId = options.spatialRefId;
  }

  const queryBuilder = new SearchQueryBuilder()
    .match(`exportItem:${itemId}`)
    .in("typekeywords")
    .and()
    .match(`exportLayer:${layerId ? `0${layerId}` : null}`)
    .in("typekeywords");

  if (types?.length) {
    queryBuilder.and().startGroup();
    buildMultiTermOrFromArray(types, 'type', queryBuilder);
    queryBuilder.endGroup();
  }

  if (spatialRefId) {
    queryBuilder.and().match(spatialRefId).in("spatialRefId");
  }

  return queryBuilder.toParam();
}


function buildMultiTermOrFromArray (terms: string[], inTerm: string, builder: SearchQueryBuilder) {
  terms.forEach((format, i) => {
    builder.match(format).in(inTerm);

    if (i < terms.length - 1) {
      builder.or();
    }
  });
}