import { voteOnAnnotation } from "../src/vote";
import {
  annoQueryVoteResponse,
  annoQueryResponseEmpty
} from "./mocks/anno_search";
import { UserSession } from "@esri/arcgis-rest-auth";
import {
  IQueryFeaturesRequestOptions,
  IAddFeaturesRequestOptions,
  IDeleteFeaturesRequestOptions
} from "@esri/arcgis-rest-feature-service";
import * as featureService from "@esri/arcgis-rest-feature-service";

export const addFeaturesResponse = {
  addResults: [
    {
      objectId: 1001,
      success: true
    }
  ]
};

export const deleteFeaturesResponse = {
  deleteResults: [
    {
      objectId: 2,
      success: true
    }
  ]
};

const TOMORROW = (function() {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  return now;
})();

const MOCK_USER_SESSION = new UserSession({
  username: "casey",
  password: "123456",
  token: "fake-token",
  tokenExpires: TOMORROW
});

const annoUrl =
  "https://services.arcgis.com/xyz/arcgis/rest/services/hub_annotations/FeatureServer/0";

describe("voteOnAnnotation", () => {
  it("should do upvoting", done => {
    const queryParamsSpy = spyOn(
      featureService,
      "queryFeatures"
    ).and.returnValue(
      new Promise(resolve => {
        resolve(annoQueryResponseEmpty);
      })
    );

    // stub add features
    const addParamsSpy = spyOn(featureService, "addFeatures").and.returnValue(
      new Promise(resolve => {
        resolve(addFeaturesResponse);
      })
    );

    const options = {
      url: annoUrl,
      annotation: {
        attributes: {
          OBJECTID: 123,
          description:
            "what do we want? bike lanes! when do we want them? now!",
          target:
            "https://services.arcgis.com/xyz/arcgis/rest/services/CityX_bikeshare_locations/FeatureServer/0",
          source: "hub.js",
          author: "otherguy"
        }
      },
      authentication: MOCK_USER_SESSION
    };

    voteOnAnnotation(options)
      .then(() => {
        expect(queryParamsSpy.calls.count()).toEqual(1);
        expect(addParamsSpy.calls.count()).toEqual(1);
        const queryOpts = queryParamsSpy.calls.argsFor(
          0
        )[0] as IQueryFeaturesRequestOptions;
        const addOpts = addParamsSpy.calls.argsFor(
          0
        )[0] as IAddFeaturesRequestOptions;
        expect(queryOpts.url).toBe(annoUrl);
        expect(queryOpts.where).toBe("parent_id = 123 AND author = 'casey'");
        expect(addOpts.url).toBe(annoUrl);
        expect(addOpts.features).toEqual([
          {
            attributes: {
              vote: 1,
              parent_id: 123,
              target:
                "https://services.arcgis.com/xyz/arcgis/rest/services/CityX_bikeshare_locations/FeatureServer/0",
              description: "this is a vote.",
              status: "approved",
              source: "hub.js"
            }
          }
        ]);
        done();
      })
      .catch(() => {
        fail();
      });
  });

  it("should do downvoting", done => {
    const queryParamsSpy = spyOn(
      featureService,
      "queryFeatures"
    ).and.returnValue(
      new Promise(resolve => {
        resolve(annoQueryResponseEmpty);
      })
    );

    // stub add features
    const addParamsSpy = spyOn(featureService, "addFeatures").and.returnValue(
      new Promise(resolve => {
        resolve(addFeaturesResponse);
      })
    );

    const options = {
      url: annoUrl,
      downVote: true,
      annotation: {
        attributes: {
          OBJECTID: 123,
          description:
            "what do we want? bike lanes! when do we want them? now!",
          target:
            "https://services.arcgis.com/xyz/arcgis/rest/services/CityX_bikeshare_locations/FeatureServer/0",
          source: "hub.js",
          author: "otherguy"
        }
      },
      authentication: MOCK_USER_SESSION
    };

    voteOnAnnotation(options)
      .then(() => {
        expect(queryParamsSpy.calls.count()).toEqual(1);
        expect(addParamsSpy.calls.count()).toEqual(1);
        const queryOpts = queryParamsSpy.calls.argsFor(
          0
        )[0] as IQueryFeaturesRequestOptions;
        const addOpts = addParamsSpy.calls.argsFor(
          0
        )[0] as IAddFeaturesRequestOptions;
        expect(queryOpts.url).toBe(annoUrl);
        expect(queryOpts.where).toBe("parent_id = 123 AND author = 'casey'");
        expect(addOpts.url).toBe(annoUrl);
        expect(addOpts.features).toEqual([
          {
            attributes: {
              vote: -1,
              parent_id: 123,
              target:
                "https://services.arcgis.com/xyz/arcgis/rest/services/CityX_bikeshare_locations/FeatureServer/0",
              description: "this is a vote.",
              status: "approved",
              source: "hub.js"
            }
          }
        ]);
        done();
      })
      .catch(() => {
        fail();
      });
  });

  it("should allow a user to switch their vote", done => {
    const queryParamsSpy = spyOn(
      featureService,
      "queryFeatures"
    ).and.returnValue(
      new Promise(resolve => {
        resolve(annoQueryVoteResponse);
      })
    );

    // stub add features
    const deleteParamsSpy = spyOn(
      featureService,
      "deleteFeatures"
    ).and.returnValue(
      new Promise(resolve => {
        resolve(deleteFeaturesResponse);
      })
    );

    const options = {
      url: annoUrl,
      annotation: {
        attributes: {
          OBJECTID: 123,
          description:
            "what do we want? bike lanes! when do we want them? now!",
          target:
            "https://services.arcgis.com/xyz/arcgis/rest/services/CityX_bikeshare_locations/FeatureServer/0",
          source: "hub.js",
          author: "otherguy"
        }
      },
      authentication: MOCK_USER_SESSION
    };

    voteOnAnnotation(options)
      .then(() => {
        expect(queryParamsSpy.calls.count()).toEqual(1);
        expect(deleteParamsSpy.calls.count()).toEqual(1);
        const queryOpts = queryParamsSpy.calls.argsFor(
          0
        )[0] as IQueryFeaturesRequestOptions;
        const deleteOpts = deleteParamsSpy.calls.argsFor(
          0
        )[0] as IDeleteFeaturesRequestOptions;
        expect(queryOpts.url).toBe(annoUrl);
        expect(queryOpts.where).toBe("parent_id = 123 AND author = 'casey'");
        expect(deleteOpts.url).toBe(annoUrl);
        expect(deleteOpts.objectIds).toEqual([2]);
        done();
      })
      .catch(() => {
        fail();
      });
  });

  it("should throw an error if no auth is passed", done => {
    const options = {
      url: annoUrl,
      annotation: {
        attributes: {
          OBJECTID: 123,
          description:
            "what do we want? bike lanes! when do we want them? now!",
          target:
            "https://services.arcgis.com/xyz/arcgis/rest/services/CityX_bikeshare_locations/FeatureServer/0",
          source: "hub.js",
          author: "otherguy"
        }
      },
      authentication: null as any
    };

    voteOnAnnotation(options).catch(err => {
      expect(err.message).toEqual(
        "Voting by anonymous users is not supported."
      );
      done();
    });
  });

  it("throw an error instead of helping a user upvote their own idea", done => {
    const options = {
      url: annoUrl,
      annotation: {
        attributes: {
          OBJECTID: 123,
          description:
            "what do we want? bike lanes! when do we want them? now!",
          target:
            "https://services.arcgis.com/xyz/arcgis/rest/services/CityX_bikeshare_locations/FeatureServer/0",
          source: "hub.js",
          author: "casey"
        }
      },
      authentication: MOCK_USER_SESSION
    };

    voteOnAnnotation(options).catch(err => {
      expect(err.message).toEqual(
        "Users may not vote on their own comment/idea."
      );
      done();
    });
  });

  it("throw an error instead of logging duplicate votes for a user", done => {
    const queryParamsSpy = spyOn(
      featureService,
      "queryFeatures"
    ).and.returnValue(
      new Promise(resolve => {
        resolve(annoQueryVoteResponse);
      })
    );

    const options = {
      url: annoUrl,
      downVote: true,
      annotation: {
        attributes: {
          OBJECTID: 123,
          description:
            "what do we want? bike lanes! when do we want them? now!",
          target:
            "https://services.arcgis.com/xyz/arcgis/rest/services/CityX_bikeshare_locations/FeatureServer/0",
          source: "hub.js",
          author: "jones"
        }
      },
      authentication: MOCK_USER_SESSION
    };

    voteOnAnnotation(options).catch(err => {
      expect(queryParamsSpy.calls.count()).toEqual(1);
      expect(err.message).toEqual(
        "Users may only vote on a comment/idea once."
      );
      done();
    });
  });
});
