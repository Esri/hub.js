/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { updateInitiativeSiteId } from "../src/update-initiative-site-id";
import { MOCK_HUB_REQOPTS } from "./mocks/fake-session";
import * as fetchMock from "fetch-mock";
import { IItem } from "@esri/arcgis-rest-portal";
import { IModel } from "@esri/hub-common";
const apiBaseUrl = "https://www.arcgis.com/sharing/rest";
const itemBaseUrl = `${apiBaseUrl}/content/items`;
const userItemBaseUrl = `${apiBaseUrl}/content/users`;

function bodyToJson(body: string): any {
  return body.split("&").reduce((acc: any, entry: string) => {
    const [key, val] = entry.split("=");
    if (key && val) {
      if (!acc.hasOwnProperty(key)) {
        acc[key] = decodeURIComponent(val);
      }
    }
    return acc;
  }, {});
}

describe("update-initiative-site-id ::", () => {
  afterEach(fetchMock.restore);
  describe("accepts a string ::", () => {
    it("should throw if string is not a guid", done => {
      return updateInitiativeSiteId("bargle", "3ef", MOCK_HUB_REQOPTS).catch(
        ex => {
          expect(ex.message).toBe(
            "updateInitiativeSiteId was passed a string that is not a GUID.",
            "should throw when non-guid passed"
          );
          done();
        }
      );
    });
    it("should fetch the item and update it", () => {
      const m = {
        item: {
          id: "c90c8745f1854420b1c23e407941fd45",
          title: "Fake initiative 1",
          type: "Hub Initiative"
        },
        data: {
          source: "bc3",
          values: {}
        }
      };

      fetchMock
        .once(
          `${itemBaseUrl}/c90c8745f1854420b1c23e407941fd45?f=json&token=fake-token`,
          m.item
        )
        .post(
          `${userItemBaseUrl}/vader/items/c90c8745f1854420b1c23e407941fd45/update`,
          { success: true, itemId: "c90c8745f1854420b1c23e407941fd45" }
        );

      return updateInitiativeSiteId(
        "c90c8745f1854420b1c23e407941fd45",
        "3ef",
        MOCK_HUB_REQOPTS
      ).then(result => {
        expect(result.success).toBeTruthy(
          "should return the update xhr result"
        );
        expect(fetchMock.done()).toBeTruthy();
        const getCall = fetchMock.lastCall(
          `${itemBaseUrl}/c90c8745f1854420b1c23e407941fd45?f=json&token=fake-token`
        );
        const getUrl = getCall[0];
        expect(getUrl).toContain("f=json");
        expect(getUrl).toContain("items/c90c8745f1854420b1c23e407941fd45");

        const updateCall = fetchMock.lastCall(
          `${userItemBaseUrl}/vader/items/c90c8745f1854420b1c23e407941fd45/update`
        );
        const updateOptions = updateCall[1];
        expect(updateOptions.method).toBe("POST");
        expect(updateOptions.body).toContain("f=json");
        expect(updateOptions.body).toContain("token=fake-token");
        const bodyJson = bodyToJson(updateOptions.body as string);

        if (bodyJson.properties) {
          const props = JSON.parse(bodyJson.properties);
          expect(props.siteId).toBe("3ef", "properties.siteId should be set");
        }
      });
    });
  });

  describe("accepts a IItem ::", () => {
    it("should just update the item", () => {
      const i = {
        id: "c90c8745f1854420b1c23e407941fd45",
        title: "Fake initiative 1",
        type: "Hub Initiative",
        properties: {
          otherProp: "present"
        }
      } as IItem;
      fetchMock.post(
        `${userItemBaseUrl}/vader/items/c90c8745f1854420b1c23e407941fd45/update`,
        { success: true, itemId: "c90c8745f1854420b1c23e407941fd45" }
      );

      return updateInitiativeSiteId(i, "3ef", MOCK_HUB_REQOPTS).then(result => {
        expect(result.success).toBeTruthy(
          "should return the update xhr result"
        );
        expect(fetchMock.done()).toBeTruthy();

        const updateCall = fetchMock.lastCall(
          `${userItemBaseUrl}/vader/items/c90c8745f1854420b1c23e407941fd45/update`
        );
        const updateOptions = updateCall[1];
        expect(updateOptions.method).toBe("POST");
        expect(updateOptions.body).toContain("f=json");
        expect(updateOptions.body).toContain("token=fake-token");
        const bodyJson = bodyToJson(updateOptions.body as string);
        if (bodyJson.properties) {
          const props = JSON.parse(bodyJson.properties);
          expect(props.siteId).toBe("3ef", "properties.siteId should be set");
          expect(props.otherProp).toBe(
            "present",
            "existing properties should be kept"
          );
        }
      });
    });
  });

  describe("accepts a IModel ::", () => {
    it("should extract the item and update it", () => {
      const m = {
        item: {
          id: "c90c8745f1854420b1c23e407941fd45",
          title: "Fake initiative 1",
          type: "Hub Initiative"
        } as IItem,
        data: {
          source: "bc3",
          values: {}
        }
      } as IModel;

      fetchMock.post(
        `${userItemBaseUrl}/vader/items/c90c8745f1854420b1c23e407941fd45/update`,
        { success: true, itemId: "c90c8745f1854420b1c23e407941fd45" }
      );

      return updateInitiativeSiteId(m, "3ef", MOCK_HUB_REQOPTS).then(result => {
        expect(result.success).toBeTruthy(
          "should return the update xhr result"
        );
        expect(fetchMock.done()).toBeTruthy();

        const updateCall = fetchMock.lastCall(
          `${userItemBaseUrl}/vader/items/c90c8745f1854420b1c23e407941fd45/update`
        );
        const updateOptions = updateCall[1];
        expect(updateOptions.method).toBe("POST");
        expect(updateOptions.body).toContain("f=json");
        expect(updateOptions.body).toContain("token=fake-token");
        const bodyJson = bodyToJson(updateOptions.body as string);
        if (bodyJson.properties) {
          const props = JSON.parse(bodyJson.properties);
          expect(props.siteId).toBe("3ef", "properties.siteId should be set");
        }
      });
    });
  });
});
