import { SearchQueryBuilder } from "@esri/arcgis-rest-portal";

const WGS84_WKID = '4326';

export const PORTAL_DOWNLOAD_FORMATS = {
  csv: {
    name: 'CSV',
    itemType: 'CSV Collection',
    supportsProjection: true
  },
  kml: {
    name: 'KML',
    itemType: 'KML Collection',
    supportsProjection: false
  },
  shapefile: {
    name: 'Shapefile',
    itemType: 'Shapefile',
    supportsProjection: true
  },
  fileGeodatabase: {
    name: 'File Geodatabase',
    itemType: 'File Geodatabase',
    supportsProjection: true
  },
  geojson: {
    name: 'GeoJson',
    itemType: 'GeoJson',
    supportsProjection: false
  },
  excel: {
    name: 'Excel',
    itemType: 'Microsoft Excel',
    supportsProjection: true
  },
  featureCollection: {
    name: 'Feature Collection',
    itemType: 'Feature Collection',
    supportsProjection: true
  }
};

interface ExistingExportsPortalQueryOptions {
  layerId?: number | string;
  onlyTypes?: string[];
  spatialRefId?: string;
}

/**
 * Builds the Portal API query string to search for exports from a given dataset
 *
 * @param datasetId - The dataset ID
 * @param options - A set of options including requested export types and spatialRefId
 * @returns
 */
export function buildExistingExportsPortalQuery(
  itemId: string,
  options?: ExistingExportsPortalQueryOptions
) {
  const {
    onlyTypes,
    layerId,
    spatialRefId
   } = maybeExtractOptions(options);

  const formatInfos = Object.keys(PORTAL_DOWNLOAD_FORMATS)
    .map((key) => PORTAL_DOWNLOAD_FORMATS[key as keyof typeof PORTAL_DOWNLOAD_FORMATS]);

  const noProjectionItemTypes = new Set(
    formatInfos
      .filter(info => !info.supportsProjection)
      .map(info => info.itemType)
  );

  let types;
  if (!onlyTypes) {
    types = formatInfos.map(info => info.itemType);
  } else {
    types = onlyTypes;
  }

  const queryBuilder = new SearchQueryBuilder()
    .startGroup()
      .match(`exportItem:${itemId}`)
      .in("typekeywords")
      .and()
      // NOTE - Layer Id's need to be padded with "0" so that /search results are predictable. Searches for typeKeywords:"exportLayer:1" don't work.
      // See https://github.com/Esri/hub.js/pull/472 for more information.
      // TODO - use `filter` when Enterprise Sites adds support.
      .match(`exportLayer:${layerId ? `0${layerId}` : 'null'}`)
      .in("typekeywords")
    .endGroup()
    .and()
    .startGroup();
      buildExportTypesClause(queryBuilder, {
        types,
        spatialRefId,
        noProjectionItemTypes
      });
    queryBuilder.endGroup();

  return queryBuilder.toParam();
}

function maybeExtractOptions (options: ExistingExportsPortalQueryOptions) {
  if (options) {
    return {
      onlyTypes: options.onlyTypes,
      layerId: options.layerId,
      spatialRefId: options.spatialRefId
    };
  }
  return {};
}

function buildExportTypesClause (builder: SearchQueryBuilder, options: {
  types: string[],
  noProjectionItemTypes: Set<string>,
  spatialRefId?: string
}) {
  const { types, noProjectionItemTypes, spatialRefId } = options;
  const buildQueryForType = (
    type: string,
    builder: SearchQueryBuilder,
  ) => {
    builder
      .startGroup()
        .match(type)
        .in('type')
        .and()
        .match(getSpatialRefTypeKeyword(
          !noProjectionItemTypes.has(type),
          spatialRefId
        ))
        .in('typekeywords')
      .endGroup();
  }

  types.forEach((type, i) => {
    buildQueryForType(type, builder);
    if (i < types.length - 1) {
      builder.or();
    }
  });
}

function getSpatialRefTypeKeyword (supportsProjection: boolean, spatialRefId?: string) {
  return `spatialRefId:${supportsProjection && spatialRefId ? spatialRefId : WGS84_WKID}`;
}