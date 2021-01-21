import { getAnnotationServiceUrl, checkResults } from "../src/util";
import {
  annoSearchResponse,
  emptyAnnoSearchResponse
} from "./mocks/ago_search";

import * as portal from "@esri/arcgis-rest-portal";

import { ISearchOptions } from "@esri/arcgis-rest-portal";

describe("getAnnotationServiceUrl", () => {
  it("should return an annotation service url", done => {
    // stub searchItems
    const paramsSpy = spyOn(portal, "searchItems").and.returnValue(
      new Promise(resolve => {
        resolve(annoSearchResponse);
      })
    );

    getAnnotationServiceUrl("5bc")
      .then(() => {
        expect(paramsSpy.calls.count()).toEqual(1);
        const opts = paramsSpy.calls.argsFor(0)[0] as ISearchOptions;
        expect(opts.q).toEqual("typekeywords:hubAnnotationLayer AND orgid:5bc");
        done();
      })
      .catch(() => fail());
  });

  it("should throw if no annotation layer is found", done => {
    // stub searchItems
    const paramsSpy = spyOn(portal, "searchItems").and.returnValue(
      new Promise(resolve => {
        resolve(emptyAnnoSearchResponse);
      })
    );

    getAnnotationServiceUrl("v8b").catch(error => {
      expect(paramsSpy.calls.count()).toEqual(1);
      const opts = paramsSpy.calls.argsFor(0)[0] as ISearchOptions;
      expect(opts.q).toEqual("typekeywords:hubAnnotationLayer AND orgid:v8b");
      expect(error.message).toBe(
        "No annotation service found. Commenting is likely not enabled."
      );
      done();
    });
  });
});

describe("checkResults", () => {
  it("should return original results when some are successful", () => {
    const results = [
      {
        objectId: 617,
        success: true
      },
      {
        success: false,
        error: {
          code: -2147217395,
          description: "Setting of Value for depth failed."
        }
      }
    ];
    const acutal = checkResults(results);
    expect(acutal).toBe(results);
  });
  it("should throw specific error when all failed with same description", () => {
    const description = "Setting of Value for depth failed.";
    const results = [
      {
        success: false,
        error: {
          code: -2147217395,
          description
        }
      }
    ];
    expect(() => checkResults(results)).toThrowError(description);
  });
  it("should throw default error when all failed w/ different descriptions", () => {
    const description = "Setting of Value for depth failed.";
    const results = [
      {
        success: false,
        error: {
          code: -2147217394,
          description: "Another error."
        }
      },
      {
        success: false,
        error: {
          code: -2147217395,
          description: "Setting of Value for depth failed."
        }
      }
    ];
    expect(() => checkResults(results)).toThrowError(
      "All attempted edits failed"
    );
  });
});
