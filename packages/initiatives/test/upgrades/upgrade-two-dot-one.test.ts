/* Copyright (c) 2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { IInitiativeModel, cloneObject } from "@esri/hub-common";
import { upgradeToTwoDotOne } from "../../src/migrations/upgrade-two-dot-one";
import { initiativeVersionTwo } from "../mocks/initiative-versionTwo";

describe("Applying v2.1 Initiative Schema ::", () => {
  const model = cloneObject(initiativeVersionTwo) as IInitiativeModel;

  describe("Upgrade Instance ::", () => {
    it("should return the model if it is at 2.1", done => {
      const instance = cloneObject(model) as IInitiativeModel;
      instance.item.properties.schemaVersion = 2.1;
      const chk = upgradeToTwoDotOne(instance);
      expect(chk).toBe(instance, "should return the same object");
      done();
    });
    it("should change groupId to collaborationGroupId", done => {
      const instance = cloneObject(model) as IInitiativeModel;
      expect(instance.item.properties.groupId).toBeDefined(
        "groupId is defined"
      );
      const chk = upgradeToTwoDotOne(instance);
      expect(chk).not.toBe(instance, "should return a new object");
      expect(chk.item.properties.schemaVersion).toBeDefined("schema version");
      expect(chk.item.properties.schemaVersion).toEqual(
        2.1,
        "should set version to 2.1"
      );
      expect(chk.item.properties.collaborationGroupId).toBeDefined(
        "collaborationGroupId should be defined"
      );
      expect(chk.item.properties.collaborationGroupId).toEqual(
        "4ef",
        "sets correct collaborationGroupId"
      );
      expect(chk.item.properties.groupId).toBeUndefined(
        "groupId no longer defined"
      );
      done();
    });
  });
});
