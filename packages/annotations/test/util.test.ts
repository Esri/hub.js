import { getAnnotationServiceUrl } from "../src/util";
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
