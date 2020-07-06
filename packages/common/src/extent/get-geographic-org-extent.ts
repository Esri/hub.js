import { IHubRequestOptions } from "../types";
import { getProp } from "../objects";
import { IRequestOptions, request } from "@esri/arcgis-rest-request";
import { IExtent } from "@esri/arcgis-rest-types";

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
