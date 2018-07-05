import {
  addAnnotations,
  updateAnnotations,
  deleteAnnotations
} from "../src/index";

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

const annoUrl =
  "https://services.arcgis.com/xyz/arcgis/rest/services/Hub%20Annotations/FeatureServer/0";

describe("add/update/deleteAnnotations", () => {
  afterEach(fetchMock.restore);

  it("should add an annotation", done => {
    fetchMock.once("*", addFeaturesResponse);

    addAnnotations({
      url: annoUrl,
      adds: [
        {
          attributes: {
            author: "casey",
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
        "adds=" +
          encodeURIComponent(
            '[{"attributes":{"author":"casey","description":"what do we want? bike lanes! when do we want them? now!"}}]'
          )
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
        "updates=" +
          encodeURIComponent(
            '[{"attributes":{"OBJECTID":1001,"description":"i changed my mind, we can wait a lil while."}}]'
          )
      );
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
