/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { IInitiativeModel, cloneObject } from "@esri/hub-common";
import { applyInitialSchema } from "../../src/migrations/apply-schema";
import {
  initiativeVersionZero,
  initiativeVersionZeroTemplate,
  customInitiative
} from "../mocks/initiative-versionZero";

describe("Applying Initial Initiative Schema ::", () => {
  const model = cloneObject(initiativeVersionZero) as IInitiativeModel;
  const modelTmpl = cloneObject(
    initiativeVersionZeroTemplate
  ) as IInitiativeModel;
  const custom = cloneObject(customInitiative) as IInitiativeModel;

  describe("Apply schema to an Instance ::", () => {
    it("should return the model if it is already 1 or higher", done => {
      const instance = cloneObject(model) as IInitiativeModel;
      instance.item.properties.schemaVersion = 1;
      const chk = applyInitialSchema(instance);
      expect(chk).toBe(instance, "should return the same instance");
      done();
    });

    it("should ensure properties", done => {
      const instance = cloneObject(model) as IInitiativeModel;
      delete instance.item.properties;
      delete instance.data.values;
      const chk = applyInitialSchema(instance);
      expect(chk.item.properties).toBeDefined(
        "item properties should be defined"
      );
      expect(chk.data.values).toBeDefined("data.values should be defined");
      done();
    });
    it("should add the schema to an instance", done => {
      const instance = cloneObject(model) as IInitiativeModel;
      const chk = applyInitialSchema(instance);
      expect(chk.item.properties.schemaVersion).toBeDefined("schema version");
      expect(chk.data.configurationSettings).not.toBeDefined(
        "should remove config settings"
      );
      expect(chk.data.source).toEqual(
        chk.item.properties.source,
        "source should be copied to item props"
      );
      done();
    });
  });

  describe("Apply Schema to a Template ::", () => {
    it("should add the schema to a template", done => {
      const tmpl = cloneObject(modelTmpl) as IInitiativeModel;
      const chk = applyInitialSchema(tmpl);
      expect(chk.item.properties.schemaVersion).toBeDefined("schema version");
      expect(chk.data.configurationSettings).not.toBeDefined(
        "should remove config settings"
      );
      expect(chk.data.source).toEqual(
        chk.item.properties.source,
        "source should be copied to item props"
      );
      expect(chk.data.values.listenTools.title).toEqual(
        "Listen to the Public",
        "should move title"
      );
      expect(chk.data.values.steps).toBeDefined(
        "data values steps should be defined"
      );
      expect(chk.data.values.steps).toEqual(
        ["informTools", "listenTools", "monitorTools"],
        "all three steps should be in steps array"
      );
      expect(chk.data.values.listenTools.items).not.toBeDefined(
        "step items should be removed"
      );
      expect(chk.data.values.listenTools.templates).toBeDefined(
        "step templates should be defined"
      );
      expect(chk.data.values.listenTools.templates.length).toEqual(
        1,
        "should have 1 entries"
      );
      done();
    });
    it("should create values entry if it does not exist", done => {
      const m = cloneObject(modelTmpl) as IInitiativeModel;
      delete m.data.values.informTools;
      const chk = applyInitialSchema(m);
      expect(chk.data.values.informTools).toBeDefined(
        "informTools should be defined"
      );
      done();
    });
  });

  describe("Apply Schema to a Custom Initiative ::", () => {
    it("should add the schema to a custom initiative", done => {
      const customClone = cloneObject(custom) as IInitiativeModel;
      const chk = applyInitialSchema(customClone);
      expect(chk.item.properties.schemaVersion).toBeDefined("schema version");
      expect(chk.data.configurationSettings).not.toBeDefined(
        "should remove config settings"
      );
      expect(chk.data.source).toEqual(
        chk.item.properties.source,
        "source should be copied to item props"
      );
      expect(chk.data.values.listenTools.title).toEqual(
        "Listen to the Public",
        "should move title"
      );
      expect(chk.data.values.steps).toBeDefined(
        "data values steps should be defined"
      );
      expect(chk.data.values.steps).toEqual(
        ["informTools", "listenTools", "monitorTools"],
        "all three steps should be in steps array"
      );
      expect(chk.data.values.listenTools.items).toBeDefined(
        "step items should remain"
      );
      expect(chk.data.values.listenTools.templates).not.toBeDefined(
        "step templates should not be defined"
      );
      expect(chk.data.values.listenTools.items.length).toEqual(
        1,
        "should have 1 entries"
      );
      done();
    });
  });
});
