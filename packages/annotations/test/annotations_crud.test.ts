import {
  addAnnotations,
  updateAnnotations,
  deleteAnnotations
} from "../src/index";

import { UserSession } from "@esri/arcgis-rest-auth";

import * as featureService from "@esri/arcgis-rest-feature-service";

import { IAddFeaturesRequestOptions } from "@esri/arcgis-rest-feature-service";
import { IFeature } from "../node_modules/@esri/arcgis-rest-common-types";

// TODO: remove this after switching all tests to spies
import * as fetchMock from "fetch-mock";

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

const annoUrl =
  "https://services.arcgis.com/xyz/arcgis/rest/services/Hub%20Annotations/FeatureServer/0";

describe("add/update/deleteAnnotations", () => {
  // TODO: remove this after switching all tests to spies
  afterEach(fetchMock.restore);

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
              "what do we want? bike lanes! when do we want them? now!"
          }
        }
      ]
    }).then(response => {
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
      // TODO: created_at needs to be flexible ~10ms
      // expect(anno.attributes.created_at).toEqual(new Date().getTime());
      done();
    });
  });

  it("should add an annotation when no authentication is passed", done => {
    // TODO: spyify
    fetchMock.once("*", addFeaturesResponse);

    addAnnotations({
      url: annoUrl,
      adds: [
        {
          attributes: {
            description:
              "what do we want? bike lanes! when do we want them? now!"
          }
        }
      ]
    }).then(response => {
      const [url, options]: [string, RequestInit] = fetchMock.lastCall();

      expect(url).toEqual(`${annoUrl}/addFeatures`);
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain(
        "features=" + encodeURIComponent('[{"attributes":{"')
      );
      expect(options.body).toContain(encodeURIComponent(`"author":null`));
      expect(options.body).toContain(
        encodeURIComponent(
          `"description":"what do we want? bike lanes! when do we want them? now!"`
        )
      );
      expect(options.body).toContain(encodeURIComponent(`"status":"pending"`));
      expect(options.body).toContain(encodeURIComponent(`"source":"hub.js"`));
      expect(response.addResults[0].success).toEqual(true);
      done();
    });
  });

  it("should preserve developer supplied attributes when adding an annotation", done => {
    // TODO: spyify
    fetchMock.once("*", addFeaturesResponse);

    addAnnotations({
      url: annoUrl,
      adds: [
        {
          attributes: {
            description:
              "what do we want? bike lanes! when do we want them? now!",
            status: "URGENT!",
            source: "somewhere else"
          }
        }
      ]
    }).then(response => {
      const [url, options]: [string, RequestInit] = fetchMock.lastCall();

      expect(url).toEqual(`${annoUrl}/addFeatures`);
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain(
        "features=" + encodeURIComponent('[{"attributes":{"')
      );
      expect(options.body).toContain(encodeURIComponent(`"author":null`));
      expect(options.body).toContain(
        encodeURIComponent(
          `"description":"what do we want? bike lanes! when do we want them? now!"`
        )
      );
      expect(options.body).toContain(encodeURIComponent(`"status":"URGENT!"`));
      expect(options.body).toContain(
        encodeURIComponent(`"source":"somewhere else"`)
      );
      expect(response.addResults[0].success).toEqual(true);
      done();
    });
  });

  it("should update an annotation", done => {
    // TODO: spyify
    fetchMock.once("*", updateFeaturesResponse);

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
    }).then(response => {
      const [url, options]: [string, RequestInit] = fetchMock.lastCall();

      expect(url).toEqual(`${annoUrl}/updateFeatures`);
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain(
        "features=" + encodeURIComponent('[{"attributes":{"')
      );
      expect(options.body).toContain(
        encodeURIComponent(
          `"description":"i changed my mind, we can wait a lil while."`
        )
      );
      // needs to be flexible ~10ms
      // expect(options.body).toContain(
      //   encodeURIComponent(`"updated_at":`) + new Date().getTime()
      // );
      expect(response.updateResults[0].success).toEqual(true);
      done();
    });
  });

  it("should delete an annotation", done => {
    // TODO: spyify
    fetchMock.once("*", deleteFeaturesResponse);

    deleteAnnotations({
      url: annoUrl,
      deletes: [1001]
    }).then(response => {
      const [url, options]: [string, RequestInit] = fetchMock.lastCall();

      expect(url).toEqual(`${annoUrl}/deleteFeatures`);
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain("objectIds=1001");
      expect(response.deleteResults[0].success).toEqual(true);
      done();
    });
  });
});
