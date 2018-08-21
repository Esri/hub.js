/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { IInitiativeModel, cloneObject } from "@esri/hub-common";
import { applyInitialSchema } from "../../src/migrations/apply-schema";

describe("Applying Initial Initiative Schema", () => {
  describe("apply schema", () => {
    const model: IInitiativeModel = {
      item: {
        id: "3ef",
        title: "fake",
        owner: "vader",
        type: "Hub Initiative",
        typeKeywords: [],
        properties: {}
      },
      data: {
        source: "bc34",
        configurationSettings: [
          {
            category: "Steps",
            fields: [
              {
                type: "item",
                multipleSelection: true,
                fieldName: "listenTools",
                label: "Listen to the Public",
                tooltip:
                  "Create ways to gather citizen feedback to help inform your city officials.",
                supportedTypes: [
                  "Web Mapping Application",
                  "Mobile Application",
                  "Form"
                ]
              }
            ]
          }
        ],
        values: {
          listenTools: {
            items: [
              {
                title: "Vision Zero Website",
                id: "54b",
                type: "Web Mapping Application"
              },
              {
                title: "Collision Lens",
                id: "c47",
                type: "Web Mapping Application"
              },
              {
                title: "Invasive Collisions",
                id: "776",
                type: "Web Mapping Application"
              }
            ]
          }
        }
      }
    };
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
      // console.debug(`------- INSTANCE ---------`);
      // console.debug(JSON.stringify(instance, null, 2));
      // console.debug(`------- INSTANCE ---------`);
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
      expect(chk.data.values.listenTools.title).toEqual(
        "Listen to the Public",
        "should move title"
      );
      expect(chk.data.values.steps).toBeDefined(
        "data values steps should be defined"
      );
      expect(chk.data.values.listenTools.items).toBeDefined(
        "step items should be preserved"
      );
      expect(chk.data.values.listenTools.items.length).toEqual(
        3,
        "should have 3 entries"
      );
      done();
    });
    it("should add the schema to a template", done => {
      const tmpl = cloneObject(model) as IInitiativeModel;
      tmpl.item.typeKeywords.push("hubInitiativeTemplate");
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
      expect(chk.data.values.listenTools.items).not.toBeDefined(
        "step items should be removed"
      );
      expect(chk.data.values.listenTools.templates).toBeDefined(
        "step templates should be defined"
      );
      expect(chk.data.values.listenTools.templates.length).toEqual(
        3,
        "should have 3 entries"
      );
      done();
    });
    it("should create values entry if it does not exist", done => {
      const m = cloneObject(model) as IInitiativeModel;
      delete m.data.values.listenTools;
      const chk = applyInitialSchema(m);
      expect(chk.data.values.listenTools).toBeDefined(
        "listenTools should be defined"
      );
      done();
    });
  });
});
