import { getAnnotationServiceUrl, searchAnnotations } from "../src/index";
import {
  annoSearchResponse,
  emptyAnnoSearchResponse
} from "./mocks/ago_search";
import { annoQueryResponse } from "./mocks/anno_search";

import * as fetchMock from "fetch-mock";
import { IQueryFeaturesResponse } from "@esri/arcgis-rest-feature-service";

describe("getAnnotationServiceUrl", () => {
  afterEach(fetchMock.restore);

  it("should return an annotation service url", done => {
    // i'd prefer to mock the specific request, but thats not working
    // https://www.arcgis.com/sharing/rest/search?f=json&q=hubAnnotationLayer%20AND%20orgid%3A5bc
    fetchMock.once("*", annoSearchResponse);

    getAnnotationServiceUrl("5bc").then(response => {
      const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
      expect(options.method).toBe("GET");
      expect(url).toContain(
        "q=typekeywords%3AhubAnnotationLayer%20AND%20orgid%3A5bc"
      );
      expect(response).toBe(annoSearchResponse.results[0].url);
      done();
    });
  });

  it("should throw if no annotation layer is found", done => {
    fetchMock.once("*", emptyAnnoSearchResponse);

    getAnnotationServiceUrl("v8b").catch(error => {
      const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
      expect(options.method).toBe("GET");
      expect(url).toContain(
        "q=typekeywords%3AhubAnnotationLayer%20AND%20orgid%3Av8b"
      );
      expect(error).toBe(
        "No annotation service found. Commenting is likely not enabled."
      );
      done();
    });
  });
});

describe("searchAnnotations", () => {
  afterEach(fetchMock.restore);

  it("should query for annotations when no parameters are passed", done => {
    fetchMock.once("*", annoQueryResponse);

    searchAnnotations({
      url: annoSearchResponse.results[0].url
    }).then(response => {
      const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
      expect(options.method).toBe("GET");
      expect(url).toContain("f=json&where=1%3D1&outFields=*");
      expect(response).toEqual(annoQueryResponse as IQueryFeaturesResponse);
      done();
    });
  });
});
