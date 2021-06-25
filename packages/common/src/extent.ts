import { IExtent } from "@esri/arcgis-rest-types";
import { IHubRequestOptions, IBBox } from "./types";
import { getProp } from "./objects";
import { IRequestOptions, request } from "@esri/arcgis-rest-request";

export function createExtent(
  xmin: number,
  ymin: number,
  xmax: number,
  ymax: number,
  wkid: number = 4326
): IExtent {
  return {
    xmin,
    ymin,
    xmax,
    ymax,
    // type: 'extent',
    spatialReference: {
      wkid
    }
  };
}

/**
 * Turns an extent into a bbox
 * @param envelope extent
 */
export function extentToBBox(envelope: IExtent): IBBox {
  return [[envelope.xmin, envelope.ymin], [envelope.xmax, envelope.ymax]];
}

export const GLOBAL_EXTENT: IExtent = {
  xmin: -180,
  ymin: -90,
  xmax: 180,
  ymax: 90,
  spatialReference: {
    wkid: 4326
  }
};

/**
 * Gets the geographic extent for an org
 * @param hubRequestOptions
 */
export function getGeographicOrgExtent(
  hubRequestOptions: IHubRequestOptions
): Promise<IExtent> {
  const portal = hubRequestOptions.portalSelf;
  const orgExtent = portal.defaultExtent;
  const geometryServiceUrl = getProp(portal, "helperServices.geometry.url");
  // Define a default global extent object
  if (!geometryServiceUrl) {
    return Promise.resolve(GLOBAL_EXTENT);
  }
  if (!orgExtent) {
    return Promise.resolve(GLOBAL_EXTENT);
  }
  const url = `${geometryServiceUrl}/project`;
  // geometry params...
  const geometryParam = {
    geometryType: "esriGeometryEnvelope",
    geometries: [orgExtent]
  };
  const options: IRequestOptions = {
    httpMethod: "POST",
    params: {
      geometries: JSON.stringify(geometryParam),
      transformForward: false,
      transformation: "",
      inSR: orgExtent.spatialReference.wkid,
      outSR: 4326,
      f: "json"
    }
  };
  // add in auth if it's passed
  if (hubRequestOptions.authentication) {
    options.authentication = hubRequestOptions.authentication;
  }
  return request(url, options)
    .then(response => {
      const geom = response.geometries[0];
      return {
        xmin: geom.xmin,
        ymin: geom.ymin,
        xmax: geom.xmax,
        ymax: geom.ymax,
        spatialReference: {
          wkid: 4326
        }
      };
    })
    .catch(ex => {
      return GLOBAL_EXTENT;
    });
}

/**
 * Get the default org extent as a bbox for use on item.extent
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function getOrgExtentAsBBox(
  hubRequestOptions: IHubRequestOptions
): Promise<IBBox> {
  return getGeographicOrgExtent(hubRequestOptions).then(extent =>
    extentToBBox(extent)
  );
}

export function isExtentCoordinateArray(extent: object) {
  return (
    Array.isArray(extent) &&
    Array.isArray(extent[0]) &&
    Array.isArray(extent[1])
  );
}

function isExtentJSON(extent: any) {
  return ["xmin", "ymin", "xmax", "ymax"].every(
    key => typeof extent[key] === "number"
  );
}

/**
 * Check if the given extent is in a known format
 * @param  {Object} extent extent in any format
 * @return {Boolean}       indicator
 */
export function isValidExtent(extent: object) {
  return (
    !!extent &&
    [isExtentCoordinateArray, isExtentJSON].some(test => test(extent))
  );
}
