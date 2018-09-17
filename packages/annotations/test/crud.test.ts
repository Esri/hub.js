import {
  addAnnotations,
  updateAnnotations,
  deleteAnnotations
} from "../src/index";

import { UserSession, ApplicationSession } from "@esri/arcgis-rest-auth";
import * as featureService from "@esri/arcgis-rest-feature-service";
import {
  IAddFeaturesRequestOptions,
  IUpdateFeaturesRequestOptions,
  IDeleteFeaturesRequestOptions
} from "@esri/arcgis-rest-feature-service";
import { IFeature } from "../node_modules/@esri/arcgis-rest-common-types";

export const addFeaturesResponse = {
  addResults: [
    {
      objectId: 1001,
      success: true
    }
  ]
};

export const updateFeaturesResponse = {
  updateResults: [
    {
      objectId: 1001,
      success: true
    }
  ]
};

export const deleteFeaturesResponse = {
  deleteResults: [
    {
      objectId: 1001,
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

const MOCK_APP_SESSION = new ApplicationSession({
  clientId: "casey",
  clientSecret: "123456"
});

const annoUrl =
  "https://services.arcgis.com/xyz/arcgis/rest/services/Hub%20Annotations/FeatureServer/0";

describe("add/update/deleteAnnotations", () => {
  it("should add an annotation and append a few helpful default parameters", done => {
    // stub add features
    const paramsSpy = spyOn(featureService, "addFeatures").and.returnValue(
      new Promise(resolve => {
        resolve(addFeaturesResponse);
      })
    );

    addAnnotations({
      url: annoUrl,
      authentication: MOCK_USER_SESSION,
      adds: [
        {
          attributes: {
            description:
              "what do we want? bike lanes! when do we want them? now!",
            target:
              "https://services.arcgis.com/xyz/arcgis/rest/services/CityX_bikeshare_locations/FeatureServer/0"
          }
        }
      ]
    }).then(() => {
      expect(paramsSpy.calls.count()).toEqual(1);
      const opts = paramsSpy.calls.argsFor(0)[0] as IAddFeaturesRequestOptions;
      expect(opts.url).toEqual(annoUrl);
      const anno = opts.adds[0] as IFeature;
      expect(anno.attributes.description).toEqual(
        "what do we want? bike lanes! when do we want them? now!"
      );
      expect(anno.attributes.status).toEqual("pending");
      expect(anno.attributes.author).toEqual("casey");
      expect(anno.attributes.source).toEqual("hub.js");
      // flexible ~100ms
      expect(anno.attributes.created_at).toBeCloseTo(new Date().getTime(), -2);
      done();
    });
  });

  it("when application authentication is passed, behavior should be the same as if no authentication was passed at all", done => {
    // stub add features
    const paramsSpy = spyOn(featureService, "addFeatures").and.returnValue(
      new Promise(resolve => {
        resolve(addFeaturesResponse);
      })
    );

    addAnnotations({
      url: annoUrl,
      adds: [
        {
          attributes: {
            description:
              "what do we want? bike lanes! when do we want them? now!",
            author: "casey",
            target:
              "https://services.arcgis.com/xyz/arcgis/rest/services/CityX_bikeshare_locations/FeatureServer/0"
          }
        }
      ],
      authentication: MOCK_APP_SESSION
    }).then(() => {
      expect(paramsSpy.calls.count()).toEqual(1);
      const opts = paramsSpy.calls.argsFor(0)[0] as IAddFeaturesRequestOptions;

      expect(opts.url).toEqual(annoUrl);
      const anno = opts.adds[0] as IFeature;
      expect(anno.attributes.author).toEqual("casey");
      expect(anno.attributes.description).toEqual(
        "what do we want? bike lanes! when do we want them? now!"
      );
      expect(anno.attributes.status).toEqual("pending");
      expect(anno.attributes.source).toEqual("hub.js");
      // flexible ~100ms
      expect(anno.attributes.created_at).toBeCloseTo(new Date().getTime(), -1);
      done();
    });
  });

  it("should add an annotation when no authentication is passed", done => {
    // stub add features
    const paramsSpy = spyOn(featureService, "addFeatures").and.returnValue(
      new Promise(resolve => {
        resolve(addFeaturesResponse);
      })
    );

    addAnnotations({
      url: annoUrl,
      adds: [
        {
          attributes: {
            description:
              "what do we want? bike lanes! when do we want them? now!",
            target:
              "https://services.arcgis.com/xyz/arcgis/rest/services/CityX_bikeshare_locations/FeatureServer/0"
          }
        }
      ]
    }).then(() => {
      expect(paramsSpy.calls.count()).toEqual(1);
      const opts = paramsSpy.calls.argsFor(0)[0] as IAddFeaturesRequestOptions;

      expect(opts.url).toEqual(annoUrl);
      const anno = opts.adds[0] as IFeature;
      expect(anno.attributes.author).toEqual(null);
      expect(anno.attributes.description).toEqual(
        "what do we want? bike lanes! when do we want them? now!"
      );
      expect(anno.attributes.status).toEqual("pending");
      expect(anno.attributes.source).toEqual("hub.js");
      // flexible ~100ms
      expect(anno.attributes.created_at).toBeCloseTo(new Date().getTime(), -2);
      done();
    });
  });

  it("should preserve developer supplied attributes when adding an annotation", done => {
    // stub add features
    const paramsSpy = spyOn(featureService, "addFeatures").and.returnValue(
      new Promise(resolve => {
        resolve(addFeaturesResponse);
      })
    );

    addAnnotations({
      url: annoUrl,
      adds: [
        {
          attributes: {
            description:
              "what do we want? bike lanes! when do we want them? now!",
            status: "URGENT!",
            source: "somewhere else",
            target:
              "https://services.arcgis.com/xyz/arcgis/rest/services/CityX_bikeshare_locations/FeatureServer/0"
          }
        }
      ]
    }).then(() => {
      expect(paramsSpy.calls.count()).toEqual(1);
      const opts = paramsSpy.calls.argsFor(0)[0] as IAddFeaturesRequestOptions;

      expect(opts.url).toEqual(annoUrl);
      const anno = opts.adds[0] as IFeature;

      expect(anno.attributes.author).toEqual(null);
      expect(anno.attributes.description).toEqual(
        "what do we want? bike lanes! when do we want them? now!"
      );
      expect(anno.attributes.status).toEqual("URGENT!");
      expect(anno.attributes.source).toEqual("somewhere else");
      // flexible ~100ms
      expect(anno.attributes.created_at).toBeCloseTo(new Date().getTime(), -2);
      done();
    });
  });

  it("should update an annotation", done => {
    // stub add features
    const paramsSpy = spyOn(featureService, "updateFeatures").and.returnValue(
      new Promise(resolve => {
        resolve(updateFeaturesResponse);
      })
    );

    updateAnnotations({
      url: annoUrl,
      annotations: [
        {
          attributes: {
            OBJECTID: 1001,
            description: "i changed my mind, we can wait a lil while."
          }
        }
      ]
    }).then(() => {
      expect(paramsSpy.calls.count()).toEqual(1);
      const opts = paramsSpy.calls.argsFor(
        0
      )[0] as IUpdateFeaturesRequestOptions;

      expect(opts.url).toEqual(annoUrl);
      const anno = opts.updates[0] as IFeature;
      expect(anno.attributes.description).toEqual(
        "i changed my mind, we can wait a lil while."
      );
      // flexible ~100ms
      expect(anno.attributes.updated_at).toBeCloseTo(new Date().getTime(), -1);
      done();
    });
  });

  it("should update an annotation the old way", done => {
    // stub add features
    const paramsSpy = spyOn(featureService, "updateFeatures").and.returnValue(
      new Promise(resolve => {
        resolve(updateFeaturesResponse);
      })
    );

    updateAnnotations({
      url: annoUrl,
      updates: [
        {
          attributes: {
            OBJECTID: 1001,
            description: "i changed my mind, we can wait a lil while."
          }
        }
      ]
    }).then(() => {
      expect(paramsSpy.calls.count()).toEqual(1);
      const opts = paramsSpy.calls.argsFor(
        0
      )[0] as IUpdateFeaturesRequestOptions;

      expect(opts.url).toEqual(annoUrl);
      const anno = opts.updates[0] as IFeature;
      expect(anno.attributes.description).toEqual(
        "i changed my mind, we can wait a lil while."
      );
      // flexible ~100ms
      expect(anno.attributes.updated_at).toBeCloseTo(new Date().getTime(), -1);
      done();
    });
  });

  it("should delete an annotation", done => {
    const paramsSpy = spyOn(featureService, "deleteFeatures").and.returnValue(
      new Promise(resolve => {
        resolve(deleteFeaturesResponse);
      })
    );

    deleteAnnotations({
      url: annoUrl,
      deletes: [1001]
    }).then(() => {
      expect(paramsSpy.calls.count()).toEqual(1);
      const opts = paramsSpy.calls.argsFor(
        0
      )[0] as IDeleteFeaturesRequestOptions;

      expect(opts.url).toEqual(annoUrl);
      const anno = opts.deletes[0] as number;
      expect(anno).toEqual(1001);
      done();
    });
  });
});
