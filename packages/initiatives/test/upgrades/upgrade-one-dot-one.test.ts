/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { IInitiativeModel, cloneObject } from "@esri/hub-common";
import {
  upgradeToOneDotOne,
  getResourceUrl
} from "../../src/migrations/upgrade-one-dot-one";

describe("upgrade 1.1", () => {
  it("should return the model if its at 1.1", done => {
    const m: IInitiativeModel = {
      item: {
        id: "3ef",
        title: "fake",
        owner: "vader",
        type: "Hub Initiative",
        properties: {
          schemaVersion: 1.1
        }
      },
      data: {
        values: {}
      }
    };
    const chk = upgradeToOneDotOne(m);
    expect(chk).toBe(m, "should return the same object");
    done();
  });
  it("should add the schema version and assets", done => {
    const m: IInitiativeModel = {
      item: {
        id: "3ef",
        title: "fake",
        owner: "vader",
        type: "Hub Initiative",
        properties: {
          schemaVersion: 1.0
        }
      },
      data: {
        values: {}
      }
    };
    const chk = upgradeToOneDotOne(m);
    expect(chk).not.toBe(m, "should return a new object");
    expect(chk.item.properties.schemaVersion).toBeDefined("schema version");
    expect(chk.data.assets).toBeDefined("assets should be defined");
    expect(chk.data.assets.length).toBe(3, "should add 3 assets");
    expect(chk.data.values.bannerImage).toBeDefined("should add bannerImage");
    done();
  });
  it("should add assets with urls using passed in portalUrl", done => {
    const m: IInitiativeModel = {
      item: {
        id: "3ef",
        title: "fake",
        owner: "vader",
        type: "Hub Initiative",
        properties: {
          schemaVersion: 1.0
        }
      },
      data: {
        values: {}
      }
    };
    const chk = upgradeToOneDotOne(m);
    expect(chk).not.toBe(m, "should return a new object");
    expect(chk.item.properties.schemaVersion).toBeDefined("schema version");
    expect(chk.data.assets).toBeDefined("assets should be defined");
    expect(chk.data.assets.length).toBe(3, "should add 3 assets");
    expect(chk.data.values.bannerImage).toBeDefined("should add bannerImage");
    done();
  });

  describe("getResourceUrl", () => {
    it("should constuct resource url and default to arcgis.com", done => {
      const url = getResourceUrl("3ef", "test.png");
      expect(url).toEqual(
        "https://www.arcgis.com/sharing/rest/content/items/3ef/resources/test.png"
      );
      done();
    });

    it("should constuct resource url using passed portalUrl", done => {
      const url = getResourceUrl(
        "3ef",
        "test.png",
        "https://someportal.com/arcgis/rest"
      );
      expect(url).toEqual(
        "https://someportal.com/arcgis/rest/content/items/3ef/resources/test.png"
      );
      done();
    });

    it("should constuct resource url using passed folder", done => {
      const url = getResourceUrl(
        "3ef",
        "test.png",
        "https://someportal.com/arcgis/rest",
        "fakefolder"
      );
      expect(url).toEqual(
        "https://someportal.com/arcgis/rest/content/items/3ef/resources/fakefolder/test.png"
      );
      done();
    });
  });
});
