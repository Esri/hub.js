/* Copyright (c) 2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { IInitiativeModel, cloneObject } from "@esri/hub-common";
import { upgradeToTwoDotTwo } from "../../src/migrations/upgrade-two-dot-two";
import { initiativeVersionTwoDotOne } from "../mocks/initiative-versionTwoDotOne";

describe("Applying v2.2 Initiative Schema ::", () => {
  const model = cloneObject(initiativeVersionTwoDotOne) as IInitiativeModel;

  describe("Upgrade Instance ::", () => {
    it("should return the model if it is at 2.1", done => {
      const instance = cloneObject(model) as IInitiativeModel;
      instance.item.properties.schemaVersion = 2.2;
      const chk = upgradeToTwoDotTwo(instance);
      expect(chk).toBe(instance, "should return the same object");
      done();
    });

    it("should create recommendedTemplates array", done => {
      const instance = cloneObject(model) as IInitiativeModel;
      const chk = upgradeToTwoDotTwo(instance);
      expect(chk).not.toBe(instance, "should return a new object");
      expect(chk.item.properties.schemaVersion).toBeDefined("schema version");
      expect(chk.item.properties.schemaVersion).toEqual(
        2.2,
        "should set version to 2.2"
      );
      expect(chk.data.recommendedTemplates).toBeDefined(
        "should set recommendedTemplates array"
      );
      expect(chk.data.recommendedTemplates.length).toEqual(
        3,
        "should add all template ids"
      );
      done();
    });
  });
});
