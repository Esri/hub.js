import { searchEvents } from "../src/search";

import { publicEventSearchResponse } from "./mocks/ago_search";

import {
  eventQueryResponse,
  eventQueryResponseEmpty,
  eventResponse,
  eventResponseEmpty,
  siteSearchResponse,
  eventQueryResponseWithoutSiteId,
  eventResponseWithoutSiteId
} from "./mocks/event_search";

import * as featureService from "@esri/arcgis-rest-feature-layer";
import * as item from "@esri/arcgis-rest-portal";
import { IQueryFeaturesOptions } from "@esri/arcgis-rest-feature-layer";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { ISearchOptions } from "@esri/arcgis-rest-portal";

describe("searchEvents", () => {
  const ro = {
    authentication: {
      portal: "https://some.portal.com/arcgis/sharing/rest",
      getToken() {
        return Promise.resolve("FAKE-TOKEN");
      }
    }
  } as IRequestOptions;

  it("should query for events when no parameters are passed", done => {
    const queryParamsSpy = spyOn(
      featureService,
      "queryFeatures"
    ).and.returnValue(
      new Promise(resolve => {
        resolve(eventQueryResponse);
      })
    );

    // stub searchItems
    const siteParamsSpy = spyOn(item, "searchItems").and.returnValues(
      new Promise(resolve => {
        resolve(siteSearchResponse);
      })
    );

    searchEvents({
      url: publicEventSearchResponse.results[0].url + "/0",
      ...ro
    })
      .then(() => {
        expect(queryParamsSpy.calls.count()).toEqual(1);
        expect(siteParamsSpy.calls.count()).toEqual(1);
        const queryOpts = queryParamsSpy.calls.argsFor(
          0
        )[0] as IQueryFeaturesOptions;
        const siteOpts = siteParamsSpy.calls.argsFor(0)[0] as ISearchOptions;

        expect(queryOpts.url).toBe(
          publicEventSearchResponse.results[0].url + "/0"
        );
        expect(siteOpts.q).toBe("id:71a58 OR id:7c395");
        done();
      })
      .catch(() => fail());
  });

  it("should not fetch site info if no features are returned from search", done => {
    const queryParamsSpy = spyOn(
      featureService,
      "queryFeatures"
    ).and.returnValue(
      new Promise(resolve => {
        resolve(eventQueryResponseEmpty);
      })
    );

    const siteParamsSpy = spyOn(item, "searchItems");

    searchEvents({
      url: publicEventSearchResponse.results[0].url + "/0",
      ...ro
    })
      .then(response => {
        expect(queryParamsSpy.calls.count()).toEqual(1);
        expect(siteParamsSpy.calls.count()).toEqual(0);

        const opts = queryParamsSpy.calls.argsFor(
          0
        )[0] as IQueryFeaturesOptions;

        expect(opts.url).toBe(publicEventSearchResponse.results[0].url + "/0");
        expect(response.data.length).toBe(eventResponseEmpty.data.length);
        expect(response.included.length).toBe(
          eventResponseEmpty.included.length
        );
        done();
      })
      .catch(() => fail());
  });

  it("should not fetch site info if features don't have siteId set", done => {
    const queryParamsSpy = spyOn(
      featureService,
      "queryFeatures"
    ).and.returnValue(
      new Promise(resolve => {
        resolve(eventQueryResponseWithoutSiteId);
      })
    );

    const siteParamsSpy = spyOn(item, "searchItems");

    searchEvents({
      url: publicEventSearchResponse.results[0].url + "/0",
      ...ro
    })
      .then(response => {
        expect(queryParamsSpy.calls.count()).toEqual(1);
        expect(siteParamsSpy.calls.count()).toEqual(0);

        const opts = queryParamsSpy.calls.argsFor(
          0
        )[0] as IQueryFeaturesOptions;

        expect(opts.url).toBe(publicEventSearchResponse.results[0].url + "/0");
        expect(response.data.length).toBe(
          eventResponseWithoutSiteId.data.length
        );
        expect(response.included.length).toBe(
          eventResponseWithoutSiteId.included.length
        );
        done();
      })
      .catch(() => fail());
  });

  it("should allow users to fetch without geometry", done => {
    const queryParamsSpy = spyOn(
      featureService,
      "queryFeatures"
    ).and.returnValue(
      new Promise(resolve => {
        resolve(eventQueryResponse);
      })
    );

    const siteParamsSpy = spyOn(item, "searchItems").and.returnValues(
      new Promise(resolve => {
        resolve(siteSearchResponse);
      })
    );

    searchEvents({
      url: publicEventSearchResponse.results[0].url + "/0",
      returnGeometry: false,
      ...ro
    })
      .then(response => {
        expect(queryParamsSpy.calls.count()).toEqual(1);
        expect(siteParamsSpy.calls.count()).toEqual(1);
        const queryOpts = queryParamsSpy.calls.argsFor(
          0
        )[0] as IQueryFeaturesOptions;
        expect(queryOpts.url).toBe(
          publicEventSearchResponse.results[0].url + "/0"
        );
        expect(response.data.length).toBe(eventResponse.data.length);
        expect(response.included).toEqual(eventResponse.included);
        done();
      })
      .catch(() => fail());
  });

  it("should allow users to fetch without passing authenication", done => {
    const queryParamsSpy = spyOn(
      featureService,
      "queryFeatures"
    ).and.returnValue(
      new Promise(resolve => {
        resolve(eventQueryResponse);
      })
    );

    const siteParamsSpy = spyOn(item, "searchItems").and.returnValues(
      new Promise(resolve => {
        resolve(siteSearchResponse);
      })
    );

    searchEvents({
      url: publicEventSearchResponse.results[0].url + "/0"
    })
      .then(response => {
        expect(queryParamsSpy.calls.count()).toEqual(1);
        expect(siteParamsSpy.calls.count()).toEqual(1);
        const queryOpts = queryParamsSpy.calls.argsFor(
          0
        )[0] as IQueryFeaturesOptions;
        expect(queryOpts.url).toBe(
          publicEventSearchResponse.results[0].url + "/0"
        );
        expect(response.data.length).toBe(eventResponse.data.length);
        expect(response.included).toEqual(eventResponse.included);
        done();
      })
      .catch(() => fail());
  });
});
