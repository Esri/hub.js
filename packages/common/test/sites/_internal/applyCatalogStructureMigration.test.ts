import { IItem } from "@esri/arcgis-rest-portal";
import { applyCatalogStructureMigration } from "../../../src/sites/_internal/applyCatalogStructureMigration";
import { IModel } from "../../../src/hub-types";

describe("applyCatalogStructureMigration:", () => {
  it("adds a catalog based off the old structure", () => {
    const model = {
      item: {} as IItem,
      data: {
        catalog: { groups: ["00c", "00d"] },
      },
    } as IModel;
    const chk = applyCatalogStructureMigration(model);

    expect(chk.data?.catalog).toEqual({
      schemaVersion: 1,
      title: "Default Site Catalog",
      scopes: {
        item: {
          targetEntity: "item",
          filters: [
            {
              predicates: [
                {
                  group: ["00c", "00d"],
                },
              ],
            },
          ],
        },
        event: {
          targetEntity: "event",
          filters: [
            {
              predicates: [
                {
                  group: ["00c", "00d"],
                },
              ],
            },
          ],
        },
      },
      collections: [],
    });
  });
  it("adds a catalog to the umbrella site", () => {
    const model = {
      item: {} as IItem,
      data: {
        // The groups will be ignored for the umbrella site
        catalog: { groups: ["00c", "00d"] },
        values: {
          isUmbrella: true,
        },
      },
    } as IModel;
    const chk = applyCatalogStructureMigration(model);

    expect(chk.data?.catalog).toEqual({
      schemaVersion: 1,
      title: "Default Site Catalog",
      scopes: {
        item: {
          targetEntity: "item",
          filters: [
            {
              predicates: [
                {
                  openData: true,
                },
              ],
            },
          ],
        },
        // There is no openData predicate for the other scopes for now
      },
      collections: [],
    });
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
    const chk = applyCatalogStructureMigration(model);
    expect(chk.data?.catalog).toBeDefined("should add data.catalog");
  });
  it("leaves existing catalog with schema", () => {
    const model = {
      item: {} as IItem,
      data: {
        catalog: {
          schemaVersion: 1,
        },
      },
    } as IModel;
    const chk = applyCatalogStructureMigration(model);

    expect(chk.data?.catalog).toBe(
      model.data.catalog,
      "data.catalog should not be modified"
    );
  });
});
