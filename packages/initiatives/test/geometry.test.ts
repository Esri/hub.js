/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as fetchMock from "fetch-mock";
import { MOCK_REQUEST_OPTIONS } from "./mocks/fake-session";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import geometryService from "../src/geometry";

describe("geometryService ::", () => {
  describe("get url from portal", () => {
    it("should return public service if portal null", () => {
      const url = geometryService.getUrl();
      expect(url.indexOf("utility.arcgisonline")).toBeGreaterThan(
        -1,
        "should return utility.arcgisonline"
      );
    });
    it("should return public utility url if helper not defined", () => {
      const url = geometryService.getUrl({
        helperServices: {
          geometryNotDefined: {
            url: "https://some.other.server.com/Geometry/GeometryServer"
          }
        }
      });
      expect(url.indexOf("utility.arcgisonline")).toBeGreaterThan(
        -1,
        "should return utility.arcgisonline"
      );
    });
    it("should return the utility url if defined", () => {
      const url = geometryService.getUrl({
        helperServices: {
          geometry: {
            url: "https://some.other.server.com/Geometry/GeometryServer"
          }
        }
      });
      expect(url.indexOf("utility.arcgisonline")).toEqual(
        -1,
        "should return not utility.arcgisonline"
      );
      expect(url.indexOf("some.other.server")).toBeGreaterThan(
        -1,
        "should return portal helper"
      );
    });
  });

  describe("should add token to call", () => {
    it("should not add a token if public service url", () => {
      const url =
        "https://utility.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer";
      const shouldAdd = geometryService.shouldAddTokenToCall(url);
      expect(shouldAdd).toBeFalsy("Should not add token");
    });
    it("should add a token if not public service url", () => {
      const url =
        "https://some-org.maps.arcgis.com/arcgis/rest/services/Geometry/GeometryServer";
      const shouldAdd = geometryService.shouldAddTokenToCall(url);
      expect(shouldAdd).toBeTruthy("Should add token");
    });
  });

  describe("project geeometry", () => {
    afterEach(() => {
      fetchMock.restore();
    });
    const extent = {
      xmin: -8591193.021454424,
      ymin: 4686637.938320619,
      xmax: -8560023.564032335,
      ymax: 4726686.262982995,
      spatialReference: {
        wkid: 102100
      }
    };
    it("should construct the call and not send a token", done => {
      // expect a post...
      fetchMock.post(`${geometryService.AGO_GEOMETRY_SERVICE}/project`, {
        geometries: [{ xmin: -77, ymin: 38, xmax: -76, ymax: 39 }]
      });
      const url = geometryService.AGO_GEOMETRY_SERVICE;
      const ro = {
        authentication: {
          portal: "https://some.portal.com/arcgis/sharing/rest",
          getToken() {
            return Promise.resolve("FAKE-TOKEN");
          }
        }
      } as IRequestOptions;

      geometryService
        .project(url, 102100, 4326, "esriGeometryTypeEnvelope", [extent], ro)
        .then(result => {
          expect(fetchMock.done()).toBeTruthy();
          const [requestedUrl, options]: [
            string,
            RequestInit
          ] = fetchMock.lastCall(
            `${geometryService.AGO_GEOMETRY_SERVICE}/project`
          );
          expect(requestedUrl).toEqual(
            `${geometryService.AGO_GEOMETRY_SERVICE}/project`,
            "should add /project"
          );
          expect(options.method).toEqual("POST", "should have post");
          expect(options.body).toContain("f=json");
          expect(options.body).not.toContain("token=");
          expect(ro.authentication).toBeDefined(
            "passed in request options should not be modified"
          );
          done();
        });
    });
    it("should send a token to non-default server", done => {
      // expect a post...
      const svcUrl = "https://some.other.com/GS";
      fetchMock.post(`${svcUrl}/project`, {
        geometries: [{ xmin: -77, ymin: 38, xmax: -76, ymax: 39 }]
      });
      const ro = {
        authentication: {
          portal: "https://some.portal.com/arcgis/sharing/rest",
          getToken() {
            return Promise.resolve("FAKE-TOKEN");
          }
        }
      } as IRequestOptions;

      geometryService
        .project(svcUrl, 102100, 4326, "esriGeometryTypeEnvelope", [extent], ro)
        .then(result => {
          expect(fetchMock.done()).toBeTruthy();
          const [requestedUrl, options]: [
            string,
            RequestInit
          ] = fetchMock.lastCall(`${svcUrl}/project`);
          expect(requestedUrl).toEqual(
            `${svcUrl}/project`,
            "should add /project"
          );
          expect(options.method).toEqual("POST", "should have post");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain("token=FAKE-TOKEN");
          expect(ro.authentication).toBeDefined(
            "passed in request options should not be modified"
          );
          done();
        });
    });
  });
});
