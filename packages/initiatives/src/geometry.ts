/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions, request } from "@esri/arcgis-rest-request";
import { getProp } from "@esri/hub-common";

/**
 * Wrapper for geometry service functions
 */
const geometryService = {
  // default geometry service url
  AGO_GEOMETRY_SERVICE:
    "https://utility.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer",

  /**
   * Get the geometry service url.
   * If a portal object is passed, it will extract the portal's geometry server
   * otherwise, it will return the public AGO geometry service
   *
   * @param portal
   */
  getUrl(portal?: any): string {
    let url = this.AGO_GEOMETRY_SERVICE;
    if (portal) {
      const portalService = getProp(portal, "helperServices.geometry.url");
      if (portalService) {
        url = portalService;
      }
    }
    return url;
  },

  /**
   * Should we add a token to the call - basically we never want to send
   * tokens to the public arcgisonline service.
   *
   * @param {string} url
   * @returns {boolean}
   */
  shouldAddTokenToCall(url: string): boolean {
    let result = true;
    if (url.indexOf("arcgisonline") > -1) {
      result = false;
    }
    return result;
  },

  /**
   * Project a geometry using a specific geometry server
   *
   * @param {string} serviceUrl
   * @param {*} inSR input spatial reference - wkid or object
   * @param {*} outSR output spatial reference - wkid or object
   * @param {string} geometryType the type of the input geometries
   * @param {[any]} geometries array of geometryes
   * @param {IRequestOptions} requestOptions
   * @returns {Promise<any>}
   */
  project(
    serviceUrl: string,
    inSR: any,
    outSR: any,
    geometryType: string,
    geometries: [any],
    requestOptions: IRequestOptions
  ): Promise<any> {
    const url = `${serviceUrl}/project`;

    // we may be mutating this, so make a copy...
    const opts = {
      ...requestOptions
    } as IRequestOptions;

    opts.params = {
      geometries: {
        geometryType,
        geometries
      },
      transformForward: false,
      transformation: "",
      inSR,
      outSR,
      f: "json"
    };

    if (!this.shouldAddTokenToCall(url) && opts.authentication) {
      // remove the authentication...
      // if the same rO is used thru multiple calls...
      delete opts.authentication;
    }

    return request(url, opts);
  }
};

export default geometryService;
