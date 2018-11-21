import { searchEvents } from "../src/search";

import { publicEventSearchResponse } from "./mocks/ago_search";

import {
  eventQueryResponse,
  eventQueryResponseEmpty,
  eventResponse,
  eventResponseEmpty,
  siteResponse71a58,
  siteResponse7c395
} from "./mocks/event_search";

import * as featureService from "@esri/arcgis-rest-feature-service";
import * as item from "@esri/arcgis-rest-items";
import { IQueryFeaturesRequestOptions } from "@esri/arcgis-rest-feature-service";
import * as token from "@esri/arcgis-rest-auth";
import { IRequestOptions } from "@esri/arcgis-rest-request";

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

    // stub getItem
    const siteParamsSpy = spyOn(item, "getItem").and.returnValues(
      new Promise(resolve => {
        resolve(siteResponse71a58);
      }),
      new Promise(resolve => {
        resolve(siteResponse7c395);
      })
    );

    searchEvents({
      url: publicEventSearchResponse.results[0].url + "/0",
      ...ro
    }).then(response => {
      expect(queryParamsSpy.calls.count()).toEqual(1);
      expect(siteParamsSpy.calls.count()).toEqual(2);
      const queryOpts = queryParamsSpy.calls.argsFor(
        0
      )[0] as IQueryFeaturesRequestOptions;
      const site1Opts = siteParamsSpy.calls.argsFor(0)[0] as string;
      const site2Opts = siteParamsSpy.calls.argsFor(1)[0] as string;

      expect(queryOpts.url).toBe(
        publicEventSearchResponse.results[0].url + "/0"
      );
      expect(site1Opts).toBe("71a58");
      expect(site2Opts).toBe("7c395");
      done();
    });
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

    const siteParamsSpy = spyOn(item, "getItem");

    searchEvents({
      url: publicEventSearchResponse.results[0].url + "/0",
      ...ro
    }).then(response => {
      expect(queryParamsSpy.calls.count()).toEqual(1);
      expect(siteParamsSpy.calls.count()).toEqual(0);

      const opts = queryParamsSpy.calls.argsFor(
        0
      )[0] as IQueryFeaturesRequestOptions;

      expect(opts.url).toBe(publicEventSearchResponse.results[0].url + "/0");
      expect(response.data.length).toBe(eventResponseEmpty.data.length);
      expect(response.data.length).toBe(eventResponseEmpty.data.length);
      expect(response.included.length).toBe(eventResponseEmpty.included.length);
      done();
    });
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

    const siteParamsSpy = spyOn(item, "getItem").and.returnValues(
      new Promise(resolve => {
        resolve(siteResponse71a58);
      }),
      new Promise(resolve => {
        resolve(siteResponse7c395);
      })
    );

    searchEvents({
      url: publicEventSearchResponse.results[0].url + "/0",
      returnGeometry: false,
      ...ro
    }).then(response => {
      expect(queryParamsSpy.calls.count()).toEqual(1);
      expect(siteParamsSpy.calls.count()).toEqual(2);
      const queryOpts = queryParamsSpy.calls.argsFor(
        0
      )[0] as IQueryFeaturesRequestOptions;
      expect(queryOpts.url).toBe(
        publicEventSearchResponse.results[0].url + "/0"
      );
      expect(response.data.length).toBe(eventResponse.data.length);
      expect(response.included).toEqual(eventResponse.included);
      done();
    });
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

    const siteParamsSpy = spyOn(item, "getItem").and.returnValues(
      new Promise(resolve => {
        resolve(siteResponse71a58);
      }),
      new Promise(resolve => {
        resolve(siteResponse7c395);
      })
    );

    searchEvents({
      url: publicEventSearchResponse.results[0].url + "/0"
    }).then(response => {
      expect(queryParamsSpy.calls.count()).toEqual(1);
      expect(siteParamsSpy.calls.count()).toEqual(2);
      const queryOpts = queryParamsSpy.calls.argsFor(
        0
      )[0] as IQueryFeaturesRequestOptions;
      expect(queryOpts.url).toBe(
        publicEventSearchResponse.results[0].url + "/0"
      );
      expect(response.data.length).toBe(eventResponse.data.length);
      expect(response.included).toEqual(eventResponse.included);
      done();
    });
  });
});
