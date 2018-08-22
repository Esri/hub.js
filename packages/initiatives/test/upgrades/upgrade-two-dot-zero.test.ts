/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { IInitiativeModel, cloneObject, findBy } from "@esri/hub-common";
import {
  upgradeToTwoDotZero,
  convertStep,
  convertSteps,
  isIndicator,
  extractIndicators,
  convertIndicator,
  convertIndicatorToDefinition,
  convertIndicatorField,
  convertIndicatorsToDefinitions,
  convertInitiativeIndicators
} from "../../src/migrations/upgrade-two-dot-zero";

import { initiativeVersionOneDotOne } from "../mocks/initiative-versionOneDotOne";

describe("Apply upgrade 2.0 ::", () => {
  const model = cloneObject(initiativeVersionOneDotOne) as IInitiativeModel;
  describe("Upgrade Instance ::", () => {
    it("returns a model", done => {
      const chk = upgradeToTwoDotZero(model);
      expect(chk.item).toBeDefined("Should return the item");
      expect(chk.data).toBeDefined("Should return the data");
      done();
    });
    it("removes old data.values props", done => {
      const chk = upgradeToTwoDotZero(model);
      expect(chk.item).toBeDefined("Should return the item");
      expect(chk.data).toBeDefined("Should return the data");
      expect(chk.data.values.steps).not.toBeDefined(
        "Should remove the data.values.steps"
      );
      expect(chk.data.values.informTools).not.toBeDefined(
        "Should remove the data.values.informTools"
      );
      done();
    });
    it("adds data.indicators prop", done => {
      const chk = upgradeToTwoDotZero(model);
      expect(chk.item).toBeDefined("Should return the item");
      expect(chk.data.indicators).toBeDefined(
        "Should return the data.indicators"
      );
      expect(chk.data.steps).toBeDefined("Should return the data.steps");
      expect(chk.data.steps.length).toEqual(5, "Should have 5 steps");
      done();
    });
    it("returns the model if it is already 2.0", done => {
      const m = cloneObject(model) as IInitiativeModel;
      m.item.properties.schemaVersion = 2;
      const chk = upgradeToTwoDotZero(m);

      expect(chk.item).toBeDefined("Should return the item");
      expect(chk.data).toBeDefined("Should return the data");
      expect(chk).toBe(m, "should return the same instance");
      done();
    });
  });
  describe("helper functions", () => {
    it("can convert a step without templates or items", done => {
      const step = {
        title: "App testing here",
        description:
          "Share your data with the public so people can easily find, download and use your data in different formats.",
        id: "informTools"
      } as any;
      const chk = convertStep(step);
      expect(chk).not.toBe(step, "should return a different object");
      expect(chk.title).toEqual(step.title, "title should match");
      expect(chk.description).toEqual(
        step.description,
        "description should match"
      );
      expect(chk.id).toEqual(step.id, "id should match");
      expect(chk.templateIds.length).toEqual(0, "should have 0 templates");
      expect(chk.itemIds.length).toEqual(0, "should have 0 items");
      done();
    });
    it("can convert a step", done => {
      const step = {
        title: "App testing here",
        description:
          "Share your data with the public so people can easily find, download and use your data in different formats.",
        id: "informTools",
        templates: [
          {
            title: "Gold Standard App",
            id: "2dc1b35134c1403697d5fc4fe3e6b906",
            type: "web mapping application"
          },
          {
            title: "Gold Standard Optional App",
            id: "4ca3c6422eeb40c58494c8678621318c",
            type: "web mapping application"
          },
          {
            title: "Gold Standard Private Solution",
            id: "8c4f2be8e417441c8245eb249250a577",
            type: "web mapping application"
          },
          {
            title: "Gold Standard Optional Defaulting App",
            id: "b19646d59698485da418e5cf44456a0d",
            type: "web mapping application"
          },
          {
            title: "Gold Standard Webmap",
            id: "efd37089716a4647aab12e83f2f79fc3",
            type: "webmap"
          }
        ],
        templateItemIds: [
          "2dc1b35134c1403697d5fc4fe3e6b906",
          "4ca3c6422eeb40c58494c8678621318c",
          "8c4f2be8e417441c8245eb249250a577",
          "b19646d59698485da418e5cf44456a0d"
        ],
        configuredItemIds: [],
        items: [
          {
            title: "Gold Standard Webmap",
            id: "b19646d59698485da418e5cf44456a0d",
            type: "webmap"
          }
        ] as any[]
      } as any;
      const chk = convertStep(step);
      expect(chk).not.toBe(step, "should return a different object");
      expect(chk.title).toEqual(step.title, "title should match");
      expect(chk.description).toEqual(
        step.description,
        "description should match"
      );
      expect(chk.id).toEqual(step.id, "id should match");
      expect(chk.templateIds.length).toEqual(5, "should have 5 templates");
      expect(typeof chk.templateIds[0]).toEqual(
        "string",
        "templateIds array should contain strings"
      );
      expect(typeof chk.itemIds[0]).toEqual(
        "string",
        "itemIds array should contain strings"
      );
      done();
    });
    it("can convert steps", done => {
      const values = {
        steps: ["one", "two"],
        two: {
          title: "Survey Testing One",
          description: "Just for a test",
          id: "one",
          templates: [
            {
              title: "Gold Standard Survey",
              id: "0585fd3f92534cc1b266de4caec1912a",
              type: "Form"
            }
          ],
          items: [] as any
        },
        notStep: {
          foo: 23
        },
        one: {
          title: "App Testing One",
          description: "Just for a test",
          id: "one",
          templates: [
            {
              title: "Gold Standard Optional Defaulting App",
              id: "b19646d59698485da418e5cf44456a0d",
              type: "web mapping application"
            }
          ],
          items: [
            {
              title: "Gold Standard Webmap",
              id: "b19646d59698485da418e5cf44456a0d",
              type: "webmap"
            }
          ]
        }
      };
      const s = convertSteps(values.steps, values);
      expect(s.length).toEqual(2, "should have two steps");
      expect(s[0].id).toEqual("one", "should preserve steps array order");
      done();
    });

    it("isIndicator returns true for obj with fields array", done => {
      const obj = {
        url:
          "https://servicesqa.arcgis.com/97KLIFOSt5CxbiRI/arcgis/rest/services/Collisions_Indicator",
        layerId: 0,
        itemId: "e05e89d83552497bba267a20ca4cea74",
        name: "Collisions_Indicator",
        fields: [
          {
            id: "numInjuries",
            field: {
              name: "MAJORINJURIES",
              alias: "MAJORINJURIES",
              type: "esriFieldTypeInteger"
            }
          }
        ]
      } as any;
      const s = isIndicator(obj);
      expect(s).toBeTruthy("should return true");
      done();
    });
    it("isIndicator returns false for obj with empty fields array", done => {
      const obj = {
        url:
          "https://servicesqa.arcgis.com/97KLIFOSt5CxbiRI/arcgis/rest/services/Collisions_Indicator",
        layerId: 0,
        itemId: "e05e89d83552497bba267a20ca4cea74",
        name: "Collisions_Indicator",
        fields: []
      } as any;
      const s = isIndicator(obj);
      expect(s).toBeFalsy("should return false if fields array is empty");
      done();
    });
    it("isIndicator returns false for obj with fields obj", done => {
      const obj = {
        url:
          "https://servicesqa.arcgis.com/97KLIFOSt5CxbiRI/arcgis/rest/services/Collisions_Indicator",
        layerId: 0,
        itemId: "e05e89d83552497bba267a20ca4cea74",
        name: "Collisions_Indicator",
        fields: {
          foo: {
            id: "numInjuries",
            field: {
              name: "MAJORINJURIES",
              alias: "MAJORINJURIES",
              type: "esriFieldTypeInteger"
            }
          }
        }
      };
      const s = isIndicator(obj);
      expect(s).toBeFalsy("should return false");
      done();
    });
    it("can extract indicators from values hash", done => {
      const values = {
        notIndicator: {
          key: "some value"
        },
        collisionLayer: {
          url:
            "https://servicesqa.arcgis.com/97KLIFOSt5CxbiRI/arcgis/rest/services/Collisions_Indicator",
          layerId: 0,
          itemId: "e05e89d83552497bba267a20ca4cea74",
          name: "Collisions_Indicator",
          fields: [
            {
              id: "numInjuries",
              field: {
                name: "MAJORINJURIES",
                alias: "MAJORINJURIES",
                type: "esriFieldTypeInteger"
              }
            }
          ]
        }
      } as any;
      const c = extractIndicators(values);
      expect(Array.isArray(c)).toBeTruthy("Should return an array");
      expect(c.length).toEqual(1, "Should have one entry");
      const entry = c[0];
      const orig = values.collisionLayer;
      expect(entry.id).toEqual("collisionLayer", "prop should become the id");
      ["url", "layerId", "itemId", "name"].map((prop: string) => {
        expect(entry[prop] as any).toEqual(
          orig[prop] as any,
          `clone should have same ${prop}`
        );
      });
      // make sure the fields entry is a clone
      expect(entry.fields[0]).not.toBe(
        orig.fields[0],
        "field entries should not be same ref"
      );
      done();
    });
    it("can convert cas indicator to definition", done => {
      const ind = {
        label: "Collision Data",
        type: "layerAndFieldSelector",
        fieldName: "collisionLayer",
        layerOptions: {
          geometryTypes: [
            "esriGeometryPoint",
            "esriGeometryLine",
            "esriGeometryPolygon"
          ],
          supportedTypes: ["FeatureLayer", "FeatureCollection"]
        },
        fields: [
          {
            tooltip: "Count of people…",
            label: "Number of Injuries",
            fieldName: "numInjuries",
            supportedTypes: ["esriFieldTypeInteger"]
          },
          {
            tooltip: "Count of deaths…",
            label: "Number of Fatalities",
            fieldName: "numFatalities",
            supportedTypes: ["esriFieldTypeInteger"]
          }
        ]
      } as any;
      const c = convertIndicatorToDefinition(ind);
      expect(c).not.toBe(ind, "returned field should not be the same object");
      expect(c.id).toEqual(ind.fieldName, "fieldName becomes id");
      expect(c.name).toEqual(ind.label, "label becomes name");
      expect(c.definition.description).toEqual(
        ind.label,
        "label becomes description"
      );
      expect(c.definition.supportedTypes.length).toEqual(
        ind.layerOptions.supportedTypes.length,
        "supported types have same contents"
      );
      expect(c.definition.geometryTypes).not.toBe(
        ind.layerOptions.geometryTypes,
        "geometryTypes should not be same instance"
      );
      expect(c.definition.geometryTypes.length).toEqual(
        ind.layerOptions.geometryTypes.length,
        "geometryTypes have same contents"
      );
      expect(c.definition.fields.length).toEqual(
        ind.fields.length,
        "fields have same contents"
      );
      done();
    });
    it("can convert cas indicator without label to definition", done => {
      const ind = {
        // label: "Collision Data",
        type: "layerAndFieldSelector",
        fieldName: "collisionLayer",
        layerOptions: {
          geometryTypes: [
            "esriGeometryPoint",
            "esriGeometryLine",
            "esriGeometryPolygon"
          ],
          supportedTypes: ["FeatureLayer", "FeatureCollection"]
        },
        fields: [
          {
            tooltip: "Count of people…",
            label: "Number of Injuries",
            fieldName: "numInjuries",
            supportedTypes: ["esriFieldTypeInteger"]
          },
          {
            tooltip: "Count of deaths…",
            label: "Number of Fatalities",
            fieldName: "numFatalities",
            supportedTypes: ["esriFieldTypeInteger"]
          }
        ]
      } as any;
      const c = convertIndicatorToDefinition(ind);
      expect(c).not.toBe(ind, "returned field should not be the same object");
      expect(c.id).toEqual(ind.fieldName, "fieldName becomes id");
      expect(c.name).toEqual(
        ind.fieldName,
        "fieldName becomes name if not label"
      );
      expect(c.definition.description).toEqual(
        ind.fieldName,
        "field becomes description if no label"
      );
      expect(c.definition.supportedTypes.length).toEqual(
        ind.layerOptions.supportedTypes.length,
        "supported types have same contents"
      );
      expect(c.definition.geometryTypes).not.toBe(
        ind.layerOptions.geometryTypes,
        "geometryTypes should not be same instance"
      );
      expect(c.definition.geometryTypes.length).toEqual(
        ind.layerOptions.geometryTypes.length,
        "geometryTypes have same contents"
      );
      expect(c.definition.fields.length).toEqual(
        ind.fields.length,
        "fields have same contents"
      );
      done();
    });
    it("can convert cas field to definition field", done => {
      const fld = {
        tooltip: "Count of people…",
        label: "Number of Injuries",
        fieldName: "numInjuries",
        supportedTypes: ["esriFieldTypeInteger"]
      } as any;
      const c = convertIndicatorField(fld);
      expect(c).not.toEqual(
        fld,
        "returned field should not be the same object"
      );
      expect(c.id).toEqual(fld.fieldName, "fieldName becomes id");
      expect(c.name).toEqual(fld.label, "label becomes name");
      expect(c.supportedTypes).not.toBe(
        fld.supportedTypes,
        "supported types should not be same instance"
      );
      expect(c.supportedTypes.length).toEqual(
        fld.supportedTypes.length,
        "supported types have same contents"
      );
      done();
    });
    it("can convert configSettings indicator structure to indicators hash", done => {
      const cs = {
        category: "Indicators",
        fields: [
          {
            fieldName: "collisionLayer",
            label: "Collision Data",
            type: "layerAndFieldSelector",
            layerOptions: {
              geometryTypes: [
                "esriGeometryPoint",
                "esriGeometryLine",
                "esriGeometryPolygon"
              ],
              supportedTypes: ["FeatureLayer", "FeatureCollection"]
            },
            fields: [
              {
                tooltip: "Count of people…",
                label: "Number of Injuries",
                fieldName: "numInjuries",
                supportedTypes: ["esriFieldTypeInteger"]
              },
              {
                tooltip: "Count of deaths…",
                label: "Number of Fatalities",
                fieldName: "numFatalities",
                supportedTypes: ["esriFieldTypeInteger"]
              }
            ]
          }
        ]
      } as any;

      // now pass this into the converter...
      const c = convertIndicatorsToDefinitions(cs);
      expect(Array.isArray(c)).toBeTruthy("should return an array");
      expect(c[0].id).toEqual(
        "collisionLayer",
        "collisionLayer should be the id of the first entry"
      );
      done();
    });
    it("handles configSettings with no fields", done => {
      const cs = {
        category: "Indicators"
      } as any;

      // now pass this into the converter...
      const c = convertIndicatorsToDefinitions(cs);
      expect(Array.isArray(c)).toBeTruthy("should return an array");
      expect(c.length).toEqual(0, "should have no entries");
      done();
    });
    it("can convert indicator entry into definition and source", done => {
      const v = {
        id: "collisionLayer",
        url:
          "https://servicesqa.arcgis.com/97KLIFOSt5CxbiRI/arcgis/rest/services/Collisions_Indicator",
        layerId: 0,
        itemId: "e05e89d83552497bba267a20ca4cea74",
        name: "Collisions_Indicator",
        fields: [
          {
            id: "numInjuries",
            field: {
              name: "MAJORINJURIES",
              alias: "MAJORINJURIES",
              type: "esriFieldTypeInteger"
            }
          }
        ]
      } as any;
      const c = convertIndicator(v) as any;
      expect(c).not.toBe(v, "should return a new object");
      expect(c.definition).toBeTruthy("should return a definiton property");
      expect(c.id).toEqual(v.id, "object should have id");
      expect(c.name).toEqual(v.name, "object should have name");
      expect(c.definition.description).toEqual(
        v.name,
        "definition should have description, filled with name"
      );
      expect(c.source).toBeTruthy("should return a source property");
      ["url", "layerId", "itemId", "name"].map((prop: string) => {
        expect(c.source[prop] as any).toEqual(
          v[prop] as any,
          `clone should have same ${prop}`
        );
      });
      expect(Array.isArray(c.source.mappings)).toBeTruthy(
        "mappings should be an array"
      );
      const fld = c.source.mappings[0];
      const orig = v.fields[0].field;
      expect(fld.id).toEqual(v.fields[0].id, "field should have same id");
      ["name", "alias", "type"].map((prop: string) => {
        expect(fld[prop]).toEqual(orig[prop], `field should have same ${prop}`);
      });
      done();
    });
    it("can convert indicator entry with no name", done => {
      const v = {
        id: "collisionLayer",
        url: "https://servicesqa.arcgis.com/Collisions_Indicator",
        layerId: 0,
        itemId: "e05e89d83552497bba267a20ca4cea74",
        fields: [
          {
            id: "numInjuries",
            field: {
              name: "MAJORINJURIES",
              alias: "MAJORINJURIES",
              type: "esriFieldTypeInteger"
            }
          }
        ]
      } as any;
      const c = convertIndicator(v) as any;
      expect(c).not.toBe(v, "should return a new object");
      expect(c.id).toEqual(v.id, "object should have id");
      expect(c.name).toEqual(v.id, "name is id if no name present");
      expect(c.definition).toBeDefined("should return a definiton property");
      expect(c.definition.description).toEqual(
        v.id,
        "definition should be the id if no name present"
      );
      done();
    });

    it("can extract and convert indicators from an initiative values hash", done => {
      const v = {
        notIndicator: {
          foo: "prop"
        },
        collisionLayer: {
          url:
            "https://servicesqa.arcgis.com/97KLIFOSt5CxbiRI/arcgis/rest/services/Collisions_Indicator",
          layerId: 0,
          itemId: "e05e89d83552497bba267a20ca4cea74",
          name: "Collisions_Indicator",
          fields: [
            {
              id: "numInjuries",
              field: {
                name: "MAJORINJURIES",
                alias: "MAJORINJURIES",
                type: "esriFieldTypeInteger"
              }
            }
          ]
        },
        alsoNotIndicator: {
          stuff: [1, 2, 4]
        },
        maleOverdoses: {
          url:
            "https://services6.arcgis.com/7THfVfoNJu2Ftu4Q/arcgis/rest/services/Male_Overdoses/FeatureServer/0",
          layerId: 0,
          itemId: "8d601537e61c4f0cb3ac3826241a66fb",
          name: "Male_Overdoses_M",
          fields: [
            {
              id: "count",
              field: {
                name: "Point_Count",
                alias: "Count of Points",
                type: "esriFieldTypeInteger"
              }
            }
          ]
        },
        femaleOverdoses: {
          url:
            "https://services6.arcgis.com/7THfVfoNJu2Ftu4Q/arcgis/rest/services/Male_Overdoses/FeatureServer/0",
          layerId: 0,
          itemId: "8d601537e61c4f0cb3ac3826241a66fb",
          name: "Male_Overdoses_M",
          fields: [
            {
              id: "count",
              field: {
                name: "Point_Count",
                alias: "Count of Points",
                type: "esriFieldTypeInteger"
              }
            }
          ]
        }
      } as any;
      const result = convertInitiativeIndicators(v);
      expect(Array.isArray(result)).toBeTruthy("should return an array");
      ["collisionLayer", "maleOverdoses", "femaleOverdoses"].map(prop => {
        const entry = findBy(result, "id", prop);
        expect(entry.id).toEqual(prop, `should have ${prop} as ${prop}.id`);
        expect(entry.definition).toBeTruthy(
          `should have prop ${prop}.definition`
        );
        expect(entry.source).toBeTruthy(`should have prop ${prop}.source`);
      });
      done();
    });
  });
});
