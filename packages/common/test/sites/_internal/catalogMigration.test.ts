import { IItem } from "@esri/arcgis-rest-portal";
import { catalogMigration } from "../../../src/sites/_internal/catalogMigration";
import { IModel } from "../../../src";

describe("catalogMigration:", () => {
  it("skips if schema >= 1.7", () => {
    const model = {
      item: { properties: { schemaVersion: 1.7 } } as IItem,
      data: {},
    } as IModel;
    const chk = catalogMigration(model);
    expect(chk).toBe(model, "should return the same model");
  });

  it("adds a catalog if schema < 1.7", () => {
    const model = {
      item: {
        properties: {
          schemaVersion: 1.6,
        },
      } as IItem,
      data: {
        catalog: { groups: ["00c", "00d"] },
      },
    } as IModel;
    const chk = catalogMigration(model);

    expect(chk.item.properties.schemaVersion).toBe(
      1.7,
      "should set schemaVersion"
    );
    expect(chk.data?.catalogv2).toBeDefined("should add catalogv2");
    expect(chk.data?.catalog).toEqual(
      model.data?.catalog,
      "should not modify catalog"
    );
  });
  it("handles no catalog.groups", () => {
    const model = {
      item: {
        properties: {
          schemaVersion: 1.6,
        },
      } as IItem,
      data: {
        catalog: {},
      },
    } as IModel;
    const chk = catalogMigration(model);

    expect(chk.item.properties.schemaVersion).toBe(
      1.7,
      "should set schemaVersion"
    );
    expect(chk.data?.catalogv2).toBeDefined("should add catalogv2");
    expect(chk.data?.catalog).toEqual(
      model.data?.catalog,
      "should not modify catalog"
    );
  });
  it("handles no catalog", () => {
    const model = {
      item: {
        properties: {
          schemaVersion: 1.6,
        },
      } as IItem,
      data: {},
    } as IModel;
    const chk = catalogMigration(model);

    expect(chk.item.properties.schemaVersion).toBe(
      1.7,
      "should set schemaVersion"
    );
    expect(chk.data?.catalogv2).toBeDefined("should add catalogv2");
    expect(chk.data?.catalog).not.toBeDefined();
  });
  it("leaves existing catalog with schema", () => {
    const model = {
      item: {
        properties: {
          schemaVersion: 1.6,
        },
      } as IItem,
      data: {
        catalog: {
          schemaVersion: 1,
        },
      },
    } as IModel;
    const chk = catalogMigration(model);

    expect(chk.item.properties.schemaVersion).toBe(
      1.7,
      "should set schemaVersion"
    );
    expect(chk.data?.catalogv2).not.toBeDefined("should not add catalogv2");
    expect(chk.data?.catalog).toBeDefined();
  });
});
