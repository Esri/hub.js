import { searchEvents } from "../src/search";

import { publicEventSearchResponse } from "./mocks/ago_search";

import {
  eventQueryResponse,
  eventQueryResponseEmpty,
  eventResponse,
  eventResponseEmpty,
  siteSearchResponse
} from "./mocks/event_search";

import * as featureService from "@esri/arcgis-rest-feature-service";
import * as item from "@esri/arcgis-rest-items";
import { IQueryFeaturesRequestOptions } from "@esri/arcgis-rest-feature-service";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { ISearchRequestOptions } from "@esri/arcgis-rest-items";

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
        )[0] as IQueryFeaturesRequestOptions;
        const siteOpts = siteParamsSpy.calls.argsFor(
          0
        )[0] as ISearchRequestOptions;

        expect(queryOpts.url).toBe(
          publicEventSearchResponse.results[0].url + "/0"
        );
        expect(siteOpts.searchForm.q).toBe("id:71a58 OR id:7c395");
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
        )[0] as IQueryFeaturesRequestOptions;

        expect(opts.url).toBe(publicEventSearchResponse.results[0].url + "/0");
        expect(response.data.length).toBe(eventResponseEmpty.data.length);
        expect(response.data.length).toBe(eventResponseEmpty.data.length);
        expect(response.included.length).toBe(
          eventResponseEmpty.included.length
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
        )[0] as IQueryFeaturesRequestOptions;
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
        )[0] as IQueryFeaturesRequestOptions;
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
