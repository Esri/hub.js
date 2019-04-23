import {
  getEventServiceUrl,
  getEventFeatureServiceUrl,
  getEventQueryFromType
} from "../src/util";
import {
  adminEventSearchResponse,
  orgEventSearchResponse,
  publicEventSearchResponse,
  emptyEventSearchResponse
} from "./mocks/ago_search";
import * as items from "@esri/arcgis-rest-items";

import { ISearchRequestOptions } from "@esri/arcgis-rest-items";
import { IQueryFeaturesRequestOptions } from "@esri/arcgis-rest-feature-service";
import { UserSession } from "@esri/arcgis-rest-auth";

describe("getEventServiceUrl", () => {
  it("should return admin event service url", done => {
    // stub searchItems
    const paramsSpy = spyOn(items, "searchItems").and.returnValue(
      new Promise(resolve => {
        resolve(adminEventSearchResponse);
      })
    );

    getEventServiceUrl("5bc")
      .then(result => {
        expect(paramsSpy.calls.count()).toEqual(1);
        const opts = paramsSpy.calls.argsFor(0)[0] as ISearchRequestOptions;
        expect(opts.searchForm.q).toContain(
          "typekeywords:hubEventsLayer AND orgid:5bc"
        );
        expect(result).toBe(
          "https://hub.arcgis.com/api/v3/events/5bc/Hub Events/FeatureServer/0"
        );
        done();
      })
      .catch(() => fail());
  });

  it("should return org event service url", done => {
    // stub searchItems
    const paramsSpy = spyOn(items, "searchItems").and.returnValue(
      new Promise(resolve => {
        resolve(orgEventSearchResponse);
      })
    );

    getEventServiceUrl("5bc")
      .then(result => {
        expect(paramsSpy.calls.count()).toEqual(1);
        const opts = paramsSpy.calls.argsFor(0)[0] as ISearchRequestOptions;
        expect(opts.searchForm.q).toContain(
          "typekeywords:hubEventsLayer AND orgid:5bc"
        );
        expect(result).toBe(
          "https://hub.arcgis.com/api/v3/events/5bc/Hub Events (org)/FeatureServer/0"
        );
        done();
      })
      .catch(() => fail());
  });

  it("should return the public event service url", done => {
    // stub searchItems
    const paramsSpy = spyOn(items, "searchItems").and.returnValue(
      new Promise(resolve => {
        resolve(publicEventSearchResponse);
      })
    );

    getEventServiceUrl("5bc")
      .then(result => {
        expect(paramsSpy.calls.count()).toEqual(1);
        const opts = paramsSpy.calls.argsFor(0)[0] as ISearchRequestOptions;
        expect(opts.searchForm.q).toContain(
          "typekeywords:hubEventsLayer AND orgid:5bc"
        );
        expect(result).toBe(
          "https://hub.arcgis.com/api/v3/events/5bc/Hub Events (public)/FeatureServer/0"
        );
        done();
      })
      .catch(() => fail());
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
      expect(opts.searchForm.q).toContain(
        "typekeywords:hubEventsLayer AND orgid:v8b"
      );
      expect(error.message).toBe(
        "No events service found. Events are likely not enabled."
      );
      done();
    });
  });
});

describe("getEventFeatureServiceUrl", () => {
  it("should return admin event service url", done => {
    // stub searchItems
    const paramsSpy = spyOn(items, "searchItems").and.returnValue(
      new Promise(resolve => {
        resolve(adminEventSearchResponse);
      })
    );

    getEventFeatureServiceUrl("5bc")
      .then(result => {
        expect(paramsSpy.calls.count()).toEqual(1);
        const opts = paramsSpy.calls.argsFor(0)[0] as ISearchRequestOptions;
        expect(opts.searchForm.q).toContain(
          "typekeywords:hubEventsLayer AND orgid:5bc"
        );
        expect(result).toBe(
          "https://services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/Hub Events/FeatureServer/0"
        );
        done();
      })
      .catch(() => fail());
  });

  it("should return org event service url", done => {
    // stub searchItems
    const paramsSpy = spyOn(items, "searchItems").and.returnValue(
      new Promise(resolve => {
        resolve(orgEventSearchResponse);
      })
    );

    getEventFeatureServiceUrl("5bc")
      .then(result => {
        expect(paramsSpy.calls.count()).toEqual(1);
        const opts = paramsSpy.calls.argsFor(0)[0] as ISearchRequestOptions;
        expect(opts.searchForm.q).toContain(
          "typekeywords:hubEventsLayer AND orgid:5bc"
        );
        expect(result).toBe(
          "https://services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/Hub Events (org)/FeatureServer/0"
        );
        done();
      })
      .catch(() => fail());
  });

  it("should return the public event service url", done => {
    // stub searchItems
    const paramsSpy = spyOn(items, "searchItems").and.returnValue(
      new Promise(resolve => {
        resolve(publicEventSearchResponse);
      })
    );

    getEventFeatureServiceUrl("5bc")
      .then(result => {
        expect(paramsSpy.calls.count()).toEqual(1);
        const opts = paramsSpy.calls.argsFor(0)[0] as ISearchRequestOptions;
        expect(opts.searchForm.q).toContain(
          "typekeywords:hubEventsLayer AND orgid:5bc"
        );
        expect(result).toBe(
          "https://services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/Hub Events (public)/FeatureServer/0"
        );
        done();
      })
      .catch(() => fail());
  });

  it("should throw if no event layer is found", done => {
    // stub searchItems
    const paramsSpy = spyOn(items, "searchItems").and.returnValue(
      new Promise(resolve => {
        resolve(emptyEventSearchResponse);
      })
    );

    getEventFeatureServiceUrl("v8b").catch(error => {
      expect(paramsSpy.calls.count()).toEqual(1);
      const opts = paramsSpy.calls.argsFor(0)[0] as ISearchRequestOptions;
      expect(opts.searchForm.q).toContain(
        "typekeywords:hubEventsLayer AND orgid:v8b"
      );
      expect(error.message).toBe(
        "No events service found. Events are likely not enabled."
      );
      done();
    });
  });
});

describe("getEventQueryFromType", () => {
  const authentication = new UserSession({
    username: "vader"
  });

  it("should return the event where clause for 'upcoming' type", () => {
    const requestOptions = {
      outFields: "*"
    } as IQueryFeaturesRequestOptions;
    const newRequestOptions = getEventQueryFromType("upcoming", requestOptions);
    expect(newRequestOptions.where).toEqual(
      "endDate>CURRENT_TIMESTAMP AND (isCancelled<>1 OR isCancelled IS NULL) AND status<>'draft'"
    );
    expect(newRequestOptions.orderByFields).toEqual("startDate ASC");
  });

  it("should return the modified event where clause for 'upcoming' type and orderByFields is not set", () => {
    const requestOptions = {
      where: "1=1",
      outFields: "*"
    } as IQueryFeaturesRequestOptions;

    const newRequestOptions = getEventQueryFromType("upcoming", requestOptions);
    expect(newRequestOptions.where).toContain(
      "AND endDate>CURRENT_TIMESTAMP AND (isCancelled<>1 OR isCancelled IS NULL) AND status<>'draft'"
    );
    expect(newRequestOptions.orderByFields).toEqual("startDate ASC");
  });

  it("should return the modified event where clause for 'upcoming' type and orderByFields is set", () => {
    const requestOptions = {
      outFields: "*",
      orderByFields: "startDate ASC"
    } as IQueryFeaturesRequestOptions;
    const newRequestOptions = getEventQueryFromType("upcoming", requestOptions);
    expect(newRequestOptions.where).toEqual(
      "endDate>CURRENT_TIMESTAMP AND (isCancelled<>1 OR isCancelled IS NULL) AND status<>'draft'"
    );
    expect(newRequestOptions.orderByFields).toEqual(
      requestOptions.orderByFields
    );
  });

  it("should return the event where clause for 'past' type", () => {
    const requestOptions = {
      outFields: "*"
    } as IQueryFeaturesRequestOptions;
    const newRequestOptions = getEventQueryFromType("past", requestOptions);
    expect(newRequestOptions.where).toEqual(
      "endDate<=CURRENT_TIMESTAMP AND (isCancelled<>1 OR isCancelled IS NULL) AND status<>'draft'"
    );
    expect(newRequestOptions.orderByFields).toEqual("startDate DESC");
  });

  it("should return the modified event where clause for 'past' type and orderByFields is not set", () => {
    const requestOptions = {
      where: "1=1",
      outFields: "*"
    } as IQueryFeaturesRequestOptions;
    const newRequestOptions = getEventQueryFromType("past", requestOptions);
    expect(newRequestOptions.where).toContain(
      "AND endDate<=CURRENT_TIMESTAMP AND (isCancelled<>1 OR isCancelled IS NULL) AND status<>'draft'"
    );
    expect(requestOptions.where).toEqual("1=1");
    expect(newRequestOptions.orderByFields).toEqual("startDate DESC");
  });

  it("should return the modified event where clause for 'past' type and orderByFields is set", () => {
    const requestOptions = {
      outFields: "*",
      orderByFields: "startDate ASC"
    } as IQueryFeaturesRequestOptions;
    const newRequestOptions = getEventQueryFromType("past", requestOptions);
    expect(newRequestOptions.where).toEqual(
      "endDate<=CURRENT_TIMESTAMP AND (isCancelled<>1 OR isCancelled IS NULL) AND status<>'draft'"
    );
    expect(newRequestOptions.orderByFields).toEqual(
      requestOptions.orderByFields
    );
  });

  it("should return the event where clause for 'cancelled' type", () => {
    const requestOptions = {
      outFields: "*"
    } as IQueryFeaturesRequestOptions;
    const newRequestOptions = getEventQueryFromType(
      "cancelled",
      requestOptions
    );
    expect(newRequestOptions.where).toEqual(
      "isCancelled=1 AND status<>'draft'"
    );
    expect(newRequestOptions.orderByFields).toEqual("EditDate DESC");
  });

  it("should return the modified event where clause for 'cancelled' type and orderByFields is not set", () => {
    const requestOptions = {
      where: "1=1",
      outFields: "*"
    } as IQueryFeaturesRequestOptions;
    const newRequestOptions = getEventQueryFromType(
      "cancelled",
      requestOptions
    );
    expect(newRequestOptions.where).toContain(
      "AND isCancelled=1 AND status<>'draft'"
    );
    expect(newRequestOptions.orderByFields).toEqual("EditDate DESC");
  });

  it("should return the modified event where clause for 'cancelled' type and orderByFields is set", () => {
    const requestOptions = {
      outFields: "*",
      orderByFields: "startDate ASC"
    } as IQueryFeaturesRequestOptions;
    const newRequestOptions = getEventQueryFromType(
      "cancelled",
      requestOptions
    );
    expect(newRequestOptions.where).toEqual(
      "isCancelled=1 AND status<>'draft'"
    );
    expect(newRequestOptions.orderByFields).toEqual(
      requestOptions.orderByFields
    );
  });

  it("should return the event where clause for 'draft' type", () => {
    const requestOptions = {
      outFields: "*"
    } as IQueryFeaturesRequestOptions;
    requestOptions.authentication = authentication;
    const newRequestOptions = getEventQueryFromType("draft", requestOptions);
    const user = (requestOptions.authentication as UserSession).username;
    expect(newRequestOptions.where).toEqual(
      `Creator = '${user}' AND status = 'draft'`
    );
    expect(newRequestOptions.orderByFields).toEqual("EditDate DESC");
  });

  it("should return the event where clause for 'draft' type when no user is set", () => {
    const requestOptions = {
      outFields: "*"
    } as IQueryFeaturesRequestOptions;
    const newRequestOptions = getEventQueryFromType("draft", requestOptions);
    expect(newRequestOptions.where).toEqual(
      `Creator = 'null' AND status = 'draft'`
    );
    expect(newRequestOptions.orderByFields).toEqual("EditDate DESC");
  });

  it("should return the modified event where clause for 'draft' type and orderByFields is not set", () => {
    const requestOptions = {
      where: "1=1",
      outFields: "*"
    } as IQueryFeaturesRequestOptions;
    requestOptions.authentication = authentication;
    const newRequestOptions = getEventQueryFromType("draft", requestOptions);
    const user = (requestOptions.authentication as UserSession).username;
    expect(newRequestOptions.where).toContain(
      `AND Creator = '${user}' AND status = 'draft'`
    );
    expect(newRequestOptions.orderByFields).toEqual("EditDate DESC");
  });

  it("should return the modified event where clause for 'draft' type and orderByFields is set", () => {
    const requestOptions = {
      outFields: "*",
      orderByFields: "startDate ASC"
    } as IQueryFeaturesRequestOptions;
    requestOptions.authentication = authentication;
    const newRequestOptions = getEventQueryFromType("draft", requestOptions);
    const user = (requestOptions.authentication as UserSession).username;
    expect(newRequestOptions.where).toEqual(
      `Creator = '${user}' AND status = 'draft'`
    );
    expect(newRequestOptions.orderByFields).toEqual(
      requestOptions.orderByFields
    );
  });
});
