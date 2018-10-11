import { getEventServiceUrl } from "../src/util";
import {
  adminEventSearchResponse,
  adminOnlyEventSearchResponse,
  orgEventSearchResponse,
  publicEventSearchResponse,
  emptyEventSearchResponse
} from "./mocks/ago_search";

import * as items from "@esri/arcgis-rest-items";

import { ISearchRequestOptions } from "@esri/arcgis-rest-items";

describe("getEventServiceUrl", () => {
  it("should return admin event service url", done => {
    // stub searchItems
    const paramsSpy = spyOn(items, "searchItems").and.returnValue(
      new Promise(resolve => {
        resolve(adminEventSearchResponse);
      })
    );

    getEventServiceUrl("5bc").then(() => {
      expect(paramsSpy.calls.count()).toEqual(1);
      const opts = paramsSpy.calls.argsFor(0)[0] as ISearchRequestOptions;
      expect(opts.searchForm.q).toEqual(
        "typekeywords:hubEventsLayer AND orgid:5bc"
      );
      done();
    });
  });

  it("should return an admin event service url", done => {
    // stub searchItems
    const paramsSpy = spyOn(items, "searchItems").and.returnValue(
      new Promise(resolve => {
        resolve(adminOnlyEventSearchResponse);
      })
    );

    getEventServiceUrl("5bc").then(() => {
      expect(paramsSpy.calls.count()).toEqual(1);
      const opts = paramsSpy.calls.argsFor(0)[0] as ISearchRequestOptions;
      expect(opts.searchForm.q).toEqual(
        "typekeywords:hubEventsLayer AND orgid:5bc"
      );
      done();
    });
  });

  it("should return org event service url", done => {
    // stub searchItems
    const paramsSpy = spyOn(items, "searchItems").and.returnValue(
      new Promise(resolve => {
        resolve(orgEventSearchResponse);
      })
    );

    getEventServiceUrl("5bc").then(() => {
      expect(paramsSpy.calls.count()).toEqual(1);
      const opts = paramsSpy.calls.argsFor(0)[0] as ISearchRequestOptions;
      expect(opts.searchForm.q).toEqual(
        "typekeywords:hubEventsLayer AND orgid:5bc"
      );
      done();
    });
  });

  it("should return the public event service url", done => {
    // stub searchItems
    const paramsSpy = spyOn(items, "searchItems").and.returnValue(
      new Promise(resolve => {
        resolve(publicEventSearchResponse);
      })
    );

    getEventServiceUrl("5bc").then(() => {
      expect(paramsSpy.calls.count()).toEqual(1);
      const opts = paramsSpy.calls.argsFor(0)[0] as ISearchRequestOptions;
      expect(opts.searchForm.q).toEqual(
        "typekeywords:hubEventsLayer AND orgid:5bc"
      );
      done();
    });
  });

  it("should throw if no event layer is found", done => {
    // stub searchItems
    const paramsSpy = spyOn(items, "searchItems").and.returnValue(
      new Promise(resolve => {
        resolve(emptyEventSearchResponse);
      })
    );

    getEventServiceUrl("v8b").catch(error => {
      expect(paramsSpy.calls.count()).toEqual(1);
      const opts = paramsSpy.calls.argsFor(0)[0] as ISearchRequestOptions;
      expect(opts.searchForm.q).toEqual(
        "typekeywords:hubEventsLayer AND orgid:v8b"
      );
      expect(error.message).toBe(
        "No events service found. Events are likely not enabled."
      );
      done();
    });
  });
});
