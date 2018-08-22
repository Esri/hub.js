/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { IInitiativeModel, cloneObject } from "@esri/hub-common";
import {
  upgradeToOneDotOne,
  getResourceUrl
} from "../../src/migrations/upgrade-one-dot-one";
import { initiativeVersionOne } from "../mocks/initiative-versionOne";

describe("Applying v1.1 Initiative Schema ::", () => {
  const model = cloneObject(initiativeVersionOne) as IInitiativeModel;
  // There is no template specific logic for this upgrade

  describe("Upgrade Instance ::", () => {
    it("should return the model if its at 1.1", done => {
      const instance = cloneObject(model) as IInitiativeModel;
      instance.item.properties.schemaVersion = 1.1;
      const chk = upgradeToOneDotOne(instance);
      expect(chk).toBe(instance, "should return the same object");
      done();
    });
    it("should add the schema version and assets", done => {
      const instance = cloneObject(model) as IInitiativeModel;
      const chk = upgradeToOneDotOne(instance);
      expect(chk).not.toBe(instance, "should return a new object");
      expect(chk.item.properties.schemaVersion).toBeDefined("schema version");
      expect(chk.item.properties.schemaVersion).toEqual(
        1.1,
        "should set version to 1.1"
      );
      expect(chk.data.assets).toBeDefined("assets should be defined");
      expect(chk.data.assets.length).toBe(3, "should add 3 assets");
      expect(chk.data.assets[0].url.includes("www.arcgis.com")).toBeTruthy(
        "should use www.arcgis.com"
      );
      expect(chk.data.values.bannerImage).toBeDefined("should add bannerImage");
      done();
    });
    it("should add assets with urls using passed in portalUrl", done => {
      const instance = cloneObject(model) as IInitiativeModel;
      const portalUrl = "http://somefoo.com";
      const chk = upgradeToOneDotOne(instance, portalUrl);
      expect(chk).not.toBe(instance, "should return a new object");
      expect(chk.data.assets).toBeDefined("assets should be defined");
      expect(chk.data.assets.length).toBe(3, "should add 3 assets");
      expect(chk.data.assets[0].url.includes(portalUrl)).toBeTruthy(
        "should use passed in url"
      );
      done();
    });
    it("should not add bannerImage if it exists", done => {
      const instance = cloneObject(model) as IInitiativeModel;
      instance.data.values.bannerImage = {
        source: "bannerImageOther",
        display: {
          position: { x: "50%", y: "10%" }
        }
      };
      const chk = upgradeToOneDotOne(instance);
      expect(chk).not.toBe(instance, "should return a new object");
      expect(chk.data.values.bannerImage).toBeDefined(
        "bannerImage should be defined"
      );
      expect(chk.data.values.bannerImage.source).toEqual(
        "bannerImageOther",
        "should keep existing bannerImage"
      );
      done();
    });
    it("should not add assets if it exists", done => {
      const instance = cloneObject(model) as IInitiativeModel;
      instance.data.assets = [];
      const chk = upgradeToOneDotOne(instance);
      expect(chk).not.toBe(instance, "should return a new object");
      expect(chk.data.assets).toBeDefined("assets should be defined");
      expect(chk.data.assets.length).toBe(0, "should add 0 assets");
      done();
    });
  });

  describe("utils :: getResourceUrl", () => {
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
