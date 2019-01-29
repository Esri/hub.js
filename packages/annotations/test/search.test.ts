import {
  searchAnnotations,
  searchAnnotationVotes,
  searchAllAnnotationVotes
} from "../src/search";

import { annoSearchResponse } from "./mocks/ago_search";

import {
  annoQueryResponse,
  annoQueryResponseEmpty,
  annoResponse,
  annoResponseEmpty,
  userResponseCasey,
  userResponseJones,
  annoVoteQueryResponseEmpty,
  annoFeature,
  annoVoteQueryResponse,
  annoVoteResponseEmpty,
  annoVoteResponse,
  allAnnoVoteQueryResponseEmpty,
  allAnnoUpVoteQueryResponse,
  allAnnoDownVoteQueryResponse,
  allAnnoVoteResponseEmpty,
  allAnnoVoteResponse
} from "./mocks/anno_search";

import * as featureService from "@esri/arcgis-rest-feature-service";
import * as user from "@esri/arcgis-rest-users";
import { IQueryFeaturesRequestOptions } from "@esri/arcgis-rest-feature-service";

const mockOutFields = [
  "OBJECTID",
  "author",
  "updater",
  "created_at",
  "updated_at",
  "description",
  "source",
  "status",
  "target",
  "dataset_id"
];

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
      expect(queryOpts.outFields).toEqual(mockOutFields);
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
      expect(opts.outFields).toEqual(mockOutFields);
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

describe("searchAnnotationVotes", () => {
  it("should query for votes when comment has no votes", done => {
    const queryParamsSpy = spyOn(
      featureService,
      "queryFeatures"
    ).and.returnValue(
      new Promise(resolve => {
        resolve(annoVoteQueryResponseEmpty);
      })
    );

    searchAnnotationVotes(
      {
        url: annoSearchResponse.results[0].url + "/0"
      },
      annoFeature
    ).then(response => {
      expect(queryParamsSpy.calls.count()).toEqual(1);
      const queryOpts = queryParamsSpy.calls.argsFor(
        0
      )[0] as IQueryFeaturesRequestOptions;

      expect(queryOpts.url).toBe(annoSearchResponse.results[0].url + "/0");
      expect(response).toEqual(annoVoteResponseEmpty);
      done();
    });
  });

  it("should query for votes when comment has votes", done => {
    const queryParamsSpy = spyOn(
      featureService,
      "queryFeatures"
    ).and.returnValue(
      new Promise(resolve => {
        resolve(annoVoteQueryResponse);
      })
    );

    searchAnnotationVotes(
      {
        url: annoSearchResponse.results[0].url + "/0"
      },
      annoFeature
    ).then(response => {
      expect(queryParamsSpy.calls.count()).toEqual(1);
      const queryOpts = queryParamsSpy.calls.argsFor(
        0
      )[0] as IQueryFeaturesRequestOptions;

      expect(queryOpts.url).toBe(annoSearchResponse.results[0].url + "/0");
      expect(response).toEqual(annoVoteResponse);
      done();
    });
  });

  it("should query for votes when comment has votes and initiative set", done => {
    const queryParamsSpy = spyOn(
      featureService,
      "queryFeatures"
    ).and.returnValue(
      new Promise(resolve => {
        resolve(annoVoteQueryResponse);
      })
    );

    searchAnnotationVotes(
      {
        url: annoSearchResponse.results[0].url + "/0",
        where: "dataset_id=initiative123"
      },
      annoFeature
    ).then(response => {
      expect(queryParamsSpy.calls.count()).toEqual(1);
      const queryOpts = queryParamsSpy.calls.argsFor(
        0
      )[0] as IQueryFeaturesRequestOptions;

      expect(queryOpts.url).toBe(annoSearchResponse.results[0].url + "/0");
      expect(response).toEqual(annoVoteResponse);
      done();
    });
  });
});

describe("searchAllAnnotationVotes", () => {
  it("should query for votes when comment has no votes", done => {
    const queryParamsSpy = spyOn(
      featureService,
      "queryFeatures"
    ).and.returnValue(
      new Promise(resolve => {
        resolve(allAnnoVoteQueryResponseEmpty);
      })
    );

    searchAllAnnotationVotes({
      url: annoSearchResponse.results[0].url + "/0"
    }).then(response => {
      expect(queryParamsSpy.calls.count()).toEqual(2);
      const queryOpts = queryParamsSpy.calls.argsFor(
        0
      )[0] as IQueryFeaturesRequestOptions;
      expect(queryOpts.url).toBe(annoSearchResponse.results[0].url + "/0");
      expect(response).toEqual(allAnnoVoteResponseEmpty);
      done();
    });
  });

  it("should query for votes when comment has no votes", done => {
    const queryParamsSpy = spyOn(
      featureService,
      "queryFeatures"
    ).and.returnValues(
      new Promise(resolve => {
        resolve(allAnnoUpVoteQueryResponse);
      }),
      new Promise(resolve => {
        resolve(allAnnoDownVoteQueryResponse);
      })
    );

    searchAllAnnotationVotes({
      url: annoSearchResponse.results[0].url + "/0"
    }).then(response => {
      expect(queryParamsSpy.calls.count()).toEqual(2);
      const queryOpts = queryParamsSpy.calls.argsFor(
        0
      )[0] as IQueryFeaturesRequestOptions;
      expect(queryOpts.url).toBe(annoSearchResponse.results[0].url + "/0");
      expect(response).toEqual(allAnnoVoteResponse);
      done();
    });
  });

  it("should query for votes when comment has no votes and initiative is set", done => {
    const queryParamsSpy = spyOn(
      featureService,
      "queryFeatures"
    ).and.returnValues(
      new Promise(resolve => {
        resolve(allAnnoUpVoteQueryResponse);
      }),
      new Promise(resolve => {
        resolve(allAnnoDownVoteQueryResponse);
      })
    );

    searchAllAnnotationVotes({
      url: annoSearchResponse.results[0].url + "/0",
      where: "dataset_id=initiative123"
    }).then(response => {
      expect(queryParamsSpy.calls.count()).toEqual(2);
      const queryOpts = queryParamsSpy.calls.argsFor(
        0
      )[0] as IQueryFeaturesRequestOptions;
      expect(queryOpts.url).toBe(annoSearchResponse.results[0].url + "/0");
      expect(response).toEqual(allAnnoVoteResponse);
      done();
    });
  });
});
