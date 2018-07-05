import { getAnnotationServiceUrl, searchAnnotations } from "../src/index";
import {
  annoSearchResponse,
  emptyAnnoSearchResponse
} from "./mocks/ago_search";
import {
  annoQueryResponse,
  annoQueryResponseEmpty,
  annoResponse,
  annoResponseEmpty,
  userResponseCasey,
  userResponseJones
} from "./mocks/anno_search";

import * as fetchMock from "fetch-mock";
import { IQueryFeaturesResponse } from "@esri/arcgis-rest-feature-service";

describe("getAnnotationServiceUrl", () => {
  afterEach(fetchMock.restore);

  it("should return an annotation service url", done => {
    fetchMock.once(
      "begin:https://www.arcgis.com/sharing/rest/search",
      annoSearchResponse
    );

    getAnnotationServiceUrl("5bc").then(response => {
      const [url, options]: [string, RequestInit] = fetchMock.lastCall();
      expect(options.method).toBe("GET");
      expect(url).toContain(
        "q=typekeywords%3AhubAnnotationLayer%20AND%20orgid%3A5bc"
      );
      expect(response).toBe(annoSearchResponse.results[0].url);
      done();
    });
  });

  it("should throw if no annotation layer is found", done => {
    fetchMock.once(
      "begin:https://www.arcgis.com/sharing/rest/search",
      emptyAnnoSearchResponse
    );

    getAnnotationServiceUrl("v8b").catch(error => {
      const [url, options]: [string, RequestInit] = fetchMock.lastCall();
      expect(options.method).toBe("GET");
      expect(url).toContain(
        "q=typekeywords%3AhubAnnotationLayer%20AND%20orgid%3Av8b"
      );
      expect(error.message).toBe(
        "No annotation service found. Commenting is likely not enabled."
      );
      done();
    });
  });
});

describe("searchAnnotations", () => {
  afterEach(fetchMock.restore);

  it("should query for annotations when no parameters are passed", done => {
    fetchMock.once(
      "begin:https://services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/Hub Annotations/FeatureServer/0/query",
      annoQueryResponse
    );

    fetchMock.once(
      "begin:http://www.arcgis.com/sharing/rest/community/users/casey?f=json",
      userResponseCasey
    );

    fetchMock.once(
      "begin:http://www.arcgis.com/sharing/rest/community/users/jones?f=json",
      userResponseJones
    );

    searchAnnotations({
      url: annoSearchResponse.results[0].url + "/0"
    }).then(response => {
      const [url, options]: [string, RequestInit] = fetchMock.lastCall(
        "begin:https://services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/Hub Annotations/FeatureServer/0/query"
      );
      expect(options.method).toBe("GET");
      expect(url).toContain("f=json");
      expect(url).toContain("where=1%3D1");
      expect(url).toContain(
        "outFields=OBJECTID%2Cauthor%2Cdescription%2Csource%2Cstatus%2Ctarget%2Cdataset_id%2Ccreated_at%2Cupdated_at"
      );
      expect(response).toEqual(annoResponse);
      done();
    });
  });

  it("should not fetch user info if no features are returned from search", done => {
    fetchMock.once(
      "begin:https://services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/Hub Annotations/FeatureServer/0/query",
      annoQueryResponseEmpty
    );

    searchAnnotations({
      url: annoSearchResponse.results[0].url + "/0",
      where: "1=0"
    }).then(response => {
      const [url, options]: [string, RequestInit] = fetchMock.lastCall(
        "begin:https://services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/Hub Annotations/FeatureServer/0/query"
      );
      expect(options.method).toBe("GET");
      expect(url).toContain("f=json");
      expect(url).toContain("where=1%3D0");
      expect(url).toContain(
        "outFields=OBJECTID%2Cauthor%2Cdescription%2Csource%2Cstatus%2Ctarget%2Cdataset_id%2Ccreated_at%2Cupdated_at"
      );
      expect(response).toEqual(annoResponseEmpty);
      done();
    });
  });

  it("should not fetch user info if no features are returned from search", done => {
    fetchMock.once(
      "begin:https://services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/Hub Annotations/FeatureServer/0/query",
      annoQueryResponse
    );

    fetchMock.once(
      "begin:http://www.arcgis.com/sharing/rest/community/users/casey?f=json",
      userResponseCasey
    );

    fetchMock.once(
      "begin:http://www.arcgis.com/sharing/rest/community/users/jones?f=json",
      userResponseJones
    );

    searchAnnotations({
      url: annoSearchResponse.results[0].url + "/0",
      outFields: ["*"]
    }).then(response => {
      const [url, options]: [string, RequestInit] = fetchMock.lastCall(
        "begin:https://services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/Hub Annotations/FeatureServer/0/query"
      );
      expect(options.method).toBe("GET");
      expect(url).toContain("f=json");
      expect(url).toContain("where=1%3D1");
      expect(url).toContain("outFields=*");
      expect(response).toEqual(annoResponse);
      done();
    });
  });
});
