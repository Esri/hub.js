import { IItem } from "@esri/arcgis-rest-portal";
import { IModel } from "../../../src";
import {
  applyProjectMigrations,
  PROJECT_SCHEMA_VERSION,
} from "../../../src/projects/_internal/applyProjectMigrations";

describe("project migrations:", () => {
  it("skips if on current version", async () => {
    const m: IModel = {
      item: {
        id: "00c",
        type: "Hub Project",
        owner: "Alice",
        created: 456,
        properties: {
          schemaVersion: PROJECT_SCHEMA_VERSION,
        },
      } as unknown as IItem,
      data: {},
    };
    const c = await applyProjectMigrations(m, {});
    expect(c).toBe(m);
  });

  it("skip on schema version >= 1.1", async () => {
    const m: IModel = {
      item: {
        id: "00c",
        type: "Hub Project",
        owner: "Alice",
        created: 456,
        properties: {
          schemaVersion: 1.1,
        },
      } as unknown as IItem,
      data: {},
    };
    const c = await applyProjectMigrations(m, {});
    expect(c).toBe(m);
  });

  describe("invalid timeline migration:", () => {
    it("removes single stage with no title and updates schemaVersion to 1.1", async () => {
      const m: IModel = {
        item: {
          id: "00c",
          type: "Hub Project",
          owner: "Alice",
          created: 456,
          properties: {
            schemaVersion: 1.0,
          },
        } as unknown as IItem,
        data: {
          view: {
            timeline: {
              stages: [
                {
                  // an invalid stage - no title
                },
              ],
            },
          },
        },
      };
      const c = await applyProjectMigrations(m, {});
      expect(c).not.toBe(m);
      expect(c.data?.view?.timeline?.stages).toEqual([]);
      expect(c.item.properties.schemaVersion).toBe(1.1);
    });
  });
});
