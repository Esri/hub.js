import { searchAnnotations } from "../src/search";

import { annoSearchResponse } from "./mocks/ago_search";

import {
  annoQueryResponse,
  annoQueryResponseEmpty,
  annoResponse,
  annoResponseEmpty,
  userResponseCasey,
  userResponseJones
} from "./mocks/anno_search";

import * as featureService from "@esri/arcgis-rest-feature-service";
import * as user from "@esri/arcgis-rest-users";
import { IQueryFeaturesRequestOptions } from "@esri/arcgis-rest-feature-service";

describe("searchAnnotations", () => {
  it("should query for annotations when no parameters are passed", done => {
    const queryParamsSpy = spyOn(
      featureService,
      "queryFeatures"
    ).and.returnValue(
      new Promise(resolve => {
        resolve(annoQueryResponse);
      })
    );

    const userParamsSpy = spyOn(user, "getUser").and.returnValues(
      new Promise(resolve => {
        resolve(userResponseCasey);
      }),
      new Promise(resolve => {
        resolve(userResponseJones);
      })
    );

    searchAnnotations({
      url: annoSearchResponse.results[0].url + "/0"
    }).then(response => {
      expect(queryParamsSpy.calls.count()).toEqual(1);
      expect(userParamsSpy.calls.count()).toEqual(2);
      const queryOpts = queryParamsSpy.calls.argsFor(
        0
      )[0] as IQueryFeaturesRequestOptions;
      const caseyOpts = userParamsSpy.calls.argsFor(0)[0] as string;
      const jonesOpts = userParamsSpy.calls.argsFor(1)[0] as string;

      expect(queryOpts.url).toBe(annoSearchResponse.results[0].url + "/0");
      expect(queryOpts.outFields).toEqual([
        "OBJECTID",
        "author",
        "description",
        "source",
        "status",
        "target",
        "dataset_id",
        "created_at",
        "updated_at"
      ]);
      expect(caseyOpts).toBe("casey");
      expect(jonesOpts).toBe("jones");
      expect(response).toEqual(annoResponse);
      done();
    });
  });

  it("should not fetch user info if no features are returned from search", done => {
    const queryParamsSpy = spyOn(
      featureService,
      "queryFeatures"
    ).and.returnValue(
      new Promise(resolve => {
        resolve(annoQueryResponseEmpty);
      })
    );

    const userParamsSpy = spyOn(user, "getUser");

    searchAnnotations({
      url: annoSearchResponse.results[0].url + "/0",
      where: "1=0"
    }).then(response => {
      expect(queryParamsSpy.calls.count()).toEqual(1);
      expect(userParamsSpy.calls.count()).toEqual(0);

      const opts = queryParamsSpy.calls.argsFor(
        0
      )[0] as IQueryFeaturesRequestOptions;

      expect(opts.url).toBe(annoSearchResponse.results[0].url + "/0");
      expect(opts.where).toBe("1=0");
      expect(opts.outFields).toEqual([
        "OBJECTID",
        "author",
        "description",
        "source",
        "status",
        "target",
        "dataset_id",
        "created_at",
        "updated_at"
      ]);
      expect(response).toEqual(annoResponseEmpty);
      done();
    });
  });

  it("should allow users to fetch whatever fields they want", done => {
    const queryParamsSpy = spyOn(
      featureService,
      "queryFeatures"
    ).and.returnValue(
      new Promise(resolve => {
        resolve(annoQueryResponse);
      })
    );

    const userParamsSpy = spyOn(user, "getUser").and.returnValues(
      new Promise(resolve => {
        resolve(userResponseCasey);
      }),
      new Promise(resolve => {
        resolve(userResponseJones);
      })
    );

    searchAnnotations({
      url: annoSearchResponse.results[0].url + "/0",
      outFields: ["*"]
    }).then(response => {
      expect(queryParamsSpy.calls.count()).toEqual(1);
      expect(userParamsSpy.calls.count()).toEqual(2);
      const queryOpts = queryParamsSpy.calls.argsFor(
        0
      )[0] as IQueryFeaturesRequestOptions;
      expect(queryOpts.url).toBe(annoSearchResponse.results[0].url + "/0");
      expect(queryOpts.outFields).toEqual(["*"]);
      expect(response).toEqual(annoResponse);
      done();
    });
  });
});
