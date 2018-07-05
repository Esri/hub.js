import {
  addAnnotations,
  updateAnnotations,
  deleteAnnotations
} from "../src/index";

import { UserSession } from "@esri/arcgis-rest-auth";

// import { addFeatures } from "@esri/arcgis-rest-feature-service";

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
  afterEach(fetchMock.restore);

  it("should add an annotation and append a few helpful default parameters", done => {
    fetchMock.once("*", addFeaturesResponse);

    // stubbing addFeatures would be better than the current duplicative tests
    // let paramsSpy: jasmine.spy;
    // paramsSpy = spyOn(?, addFeatures).and.callThrough();

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
      // expect(paramsSpy).toHaveBeenCalled();
      const [url, options]: [string, RequestInit] = fetchMock.lastCall();

      expect(url).toEqual(`${annoUrl}/addFeatures`);
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain(
        "features=" + encodeURIComponent('[{"attributes":{"')
      );
      expect(options.body).toContain(encodeURIComponent(`"author":"casey"`));
      expect(options.body).toContain(
        encodeURIComponent(
          `"description":"what do we want? bike lanes! when do we want them? now!"`
        )
      );
      expect(options.body).toContain(encodeURIComponent(`"status":"pending"`));
      expect(options.body).toContain(encodeURIComponent(`"source":"hub.js"`));
      // needs to be flexible ~10ms
      // expect(options.body).toContain(
      //   encodeURIComponent(`"created_at":`) + new Date().getTime()
      // );
      expect(response.addResults[0].success).toEqual(true);
      done();
    });
  });

  it("should add an annotation when no authentication is passed", done => {
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
