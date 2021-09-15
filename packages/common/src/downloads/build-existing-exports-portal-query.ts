import { SearchQueryBuilder } from "@esri/arcgis-rest-portal";
import { ISpatialReference } from "@esri/arcgis-rest-types";
import { btoa } from "abab";
import { flattenArray } from "../util";

export const WGS84_WKID = "4326";

export const PORTAL_EXPORT_TYPES = {
  csv: {
    name: "CSV",
    itemTypes: ["CSV", "CSV Collection"],
    supportsProjection: true,
  },
  kml: {
    name: "KML",
    itemTypes: ["KML", "KML Collection"],
    supportsProjection: false,
  },
  shapefile: {
    name: "Shapefile",
    itemTypes: ["Shapefile"],
    supportsProjection: true,
  },
  fileGeodatabase: {
    name: "File Geodatabase",
    itemTypes: ["File Geodatabase"],
    supportsProjection: true,
  },
  geojson: {
    name: "GeoJson",
    itemTypes: ["GeoJson"],
    supportsProjection: false,
  },
  excel: {
    name: "Excel",
    itemTypes: ["Microsoft Excel"],
    supportsProjection: true,
  },
  featureCollection: {
    name: "Feature Collection",
    itemTypes: ["Feature Collection"],
    supportsProjection: true,
  },
};

interface IExistingExportsPortalQueryOptions {
  layerId?: number | string;
  onlyTypes?: string[];
  spatialRefId?: string;
}

/**
 * Puts a spatial reference into a serialized format that can be used
 * for item typeKeywords.
 *
 * **Note**: discards "latestWkid"
 *
 * In the past we used `JSON.stringify`, but that causes problems because
 * it can include commas which are interpreted by the portal [update item call](https://developers.arcgis.com/rest/users-groups-and-items/update-item.htm)
 * as being separate typekeywords. With `JSON.stringify`, equality was also
 * dependent on the order of the properties in the spatial reference.
 *
 * Check https://developers.arcgis.com/web-map-specification/objects/spatialReference/
 * for more details on what this object looks like.
 */
export function serializeSpatialReference(
  spatialReference: ISpatialReference | string
): string {
  if (typeof spatialReference === "object") {
    const { wkid, wkt } = spatialReference;
    return wkid ? wkid + "" : btoa(wkt);
  } else {
    return spatialReference;
  }
}

/**
 * spatialRefId can currently take the form of either a WKID string or a
 * serialized ISpatialReference object.
 *
 * TODO - we shouldn't need this function. Instead, spatialRefId should
 * always be consistent, maybe by using serializeSpatialReference
 *
 * @private
 */
function parseSpatialRefId(spatialRefId: string): string | ISpatialReference {
  let _spatialRefId;
  try {
    _spatialRefId = JSON.parse(spatialRefId) as ISpatialReference;
  } catch {
    _spatialRefId = spatialRefId;
  }

  return _spatialRefId;
}

/**
 * Builds the Portal API query string to search for exports from a given dataset
 *
 * @param itemId - The dataset ID
 * @param options - A set of options including item types, layerId, and spatialRefId
 * @returns
 */
export function buildExistingExportsPortalQuery(
  itemId: string,
  options?: IExistingExportsPortalQueryOptions
) {
  const { onlyTypes, layerId, spatialRefId } = maybeExtractOptions(options);

  const formatInfos = Object.keys(PORTAL_EXPORT_TYPES).map(
    (key) => PORTAL_EXPORT_TYPES[key as keyof typeof PORTAL_EXPORT_TYPES]
  );

  const noProjectionItemTypes = new Set(
    flattenArray(
      formatInfos
        .filter((info) => !info.supportsProjection)
        .map((info) => info.itemTypes)
    ) as string[]
  );

  let types: string[];
  if (!onlyTypes) {
    types = flattenArray(formatInfos.map((info) => info.itemTypes)) as string[];
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
    .match(`exportLayer:${layerId ? `0${layerId}` : "null"}`)
    .in("typekeywords")
    .endGroup()
    .and()
    .startGroup();
  buildExportTypesClause(queryBuilder, {
    types,
    spatialRefId,
    noProjectionItemTypes,
  });
  queryBuilder.endGroup();

  return queryBuilder.toParam();
}

function maybeExtractOptions(options: IExistingExportsPortalQueryOptions) {
  if (options) {
    return {
      onlyTypes: options.onlyTypes,
      layerId: options.layerId,
      spatialRefId: options.spatialRefId,
    };
  }
  return {};
}

function buildExportTypesClause(
  builder: SearchQueryBuilder,
  options: {
    types: string[];
    noProjectionItemTypes: Set<string>;
    spatialRefId?: string;
  }
) {
  const { types, noProjectionItemTypes, spatialRefId } = options;

  const getSpatialRefIdWithDefaults = (
    _spatialRefId: string,
    itemType: string
  ) => {
    let ret = WGS84_WKID;
    if (_spatialRefId && !noProjectionItemTypes.has(itemType)) {
      ret = _spatialRefId;
    }
    return ret;
  };

  const buildQueryForType = (type: string, _builder: SearchQueryBuilder) => {
    _builder
      .startGroup()
      .match(/\s/g.test(type) ? type : `"${type}"`) // temporary logic until https://github.com/Esri/arcgis-rest-js/issues/916 is resolved
      .in("type")
      .and()
      .match(
        getSpatialRefTypeKeyword(
          getSpatialRefIdWithDefaults(spatialRefId, type)
        )
      )
      .in("typekeywords")
      .endGroup();
  };

  types.forEach((type, i) => {
    buildQueryForType(type, builder);
    if (i < types.length - 1) {
      builder.or();
    }
  });
}

/**
 * Generates typekeyword for spatialRefId
 * @param spatialRefId
 * @param supportsProjection
 * @returns
 */
export function getSpatialRefTypeKeyword(spatialRefId: string) {
  const parsedSpatialReference = parseSpatialRefId(spatialRefId);
  const serializedSpatialReference = serializeSpatialReference(
    parsedSpatialReference
  );
  return `spatialRefId:${serializedSpatialReference}`;
}
