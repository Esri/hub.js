/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  saveModel,
  updateModel,
  getProjectedExtentAsBBOXString
} from "../src/model";
import * as fetchMock from "fetch-mock";
import { MOCK_REQUEST_OPTIONS } from "./mocks/fake-session";
import geometryService from "../src/geometry";

const REST_URL = "https://www.arcgis.com/sharing/rest";

describe("model functions ::", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe("saving a model item ::", () => {
    it("should convert data to .text, attach the id", done => {
      const m = {
        item: {
          owner: "vader",
          type: "Web Map",
          tags: ["test webmap"]
        },
        data: {
          some: {
            content: "nested deep"
          }
        }
      };

      // expect a fetch...
      fetchMock.post(`${REST_URL}/content/users/vader/addItem`, {
        success: true,
        id: "from-mock"
      });

      // call the fn...
      saveModel(m, MOCK_REQUEST_OPTIONS).then(result => {
        expect(result).not.toBe(m, "should return a clone");
        expect(result.item.id).toEqual(
          "from-mock",
          "should add the id into the model"
        );
        expect(result.item.owner).toEqual(
          "vader",
          "should set owner to the user who made the request"
        );
        expect(fetchMock.done()).toBeTruthy();
        done();
      });
    });
  });

  describe("updating a model item ::", () => {
    it("should post", done => {
      const m = {
        item: {
          id: "bc7",
          owner: "vader",
          type: "Web Map",
          tags: ["test webmap"]
        },
        data: {
          some: {
            content: "nested deep"
          }
        }
      };

      // expect a fetch...
      fetchMock.post(`${REST_URL}/content/users/vader/items/bc7/update`, {
        success: true,
        id: "bc7"
      });

      // call the fn...
      updateModel(m, MOCK_REQUEST_OPTIONS).then(result => {
        expect(result).not.toBe(m, "should return a clone");
        expect(result.item.id).toEqual("bc7", "should keep the id");
        expect(fetchMock.done()).toBeTruthy();
        done();
      });
    });
  });

  describe("projecting extent to BBOX", () => {
    const extent = {
      xmin: -8591193.021454424,
      ymin: 4686637.938320619,
      xmax: -8560023.564032335,
      ymax: 4726686.262982995,
      spatialReference: {
        wkid: 102100
      }
    };
    it("should call public geometryService if no portal passed", done => {
      const opts = {
        extent
      };
      const projSpy = spyOn(geometryService, "project").and.callFake(() => {
        const result = {
          geometries: [{ xmin: -77, ymin: 38, xmax: -76, ymax: 39 }]
        };
        return Promise.resolve(result);
      });
      getProjectedExtentAsBBOXString(opts, MOCK_REQUEST_OPTIONS).then(bbox => {
        expect(bbox).toEqual(
          "-77,38,-76,39",
          "should format at WESN bbox string"
        );
        expect(projSpy.calls.count()).toEqual(
          1,
          "should make one call to geometry.project"
        );
        const [url, inSR, outSR, type, geoms] = projSpy.calls.argsFor(0);
        expect(inSR).toEqual(102100, "should send sr from extent");
        expect(outSR).toEqual(4326, "should always be 4326");
        expect(type).toEqual(
          "esriGeometryEnvelope",
          "should send esriGeometryEnvelope"
        );
        expect(geoms.length).toEqual(1, "should only send one geometry");
        expect(url.indexOf("arcgisonline")).toBeGreaterThan(
          -1,
          "should use public ago server"
        );
        done();
      });
    });

    it("should use portal geometryService if portal passed", done => {
      const opts = {
        extent,
        portal: {
          helperServices: {
            geometry: {
              url: "https://some.other.server.com/Geometry/GeometryServer"
            }
          }
        }
      };
      const projSpy = spyOn(geometryService, "project").and.callFake(() => {
        const result = {
          geometries: [{ xmin: -77, ymin: 38, xmax: -76, ymax: 39 }]
        };
        return Promise.resolve(result);
      });
      getProjectedExtentAsBBOXString(opts, MOCK_REQUEST_OPTIONS).then(bbox => {
        expect(projSpy.calls.count()).toEqual(
          1,
          "should make one call to geometry.project"
        );
        const [url] = projSpy.calls.argsFor(0);
        expect(url.indexOf("arcgisonline")).toBe(
          -1,
          "should not use public ago server"
        );
        expect(url.indexOf("some.other.server.com")).toBeGreaterThan(
          -1,
          "should portal helper services url"
        );
        done();
      });
    });
  });
});
