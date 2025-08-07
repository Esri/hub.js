import { IItem } from "@esri/arcgis-rest-portal";
import { IModel, getProp } from "../../../src";
import {
  applyInitiativeMigrations,
  INITIATIVE_SCHEMA_VERSION,
} from "../../../src/initiatives/_internal/applyInitiativeMigrations";

describe("initiative migrations:", () => {
  it("skips if on current version", async () => {
    const m: IModel = {
      item: {
        id: "00c",
        type: "Hub Initiative",
        owner: "Bob",
        created: 123,
        properties: {
          contentGroupId: "abc",
          schemaVersion: INITIATIVE_SCHEMA_VERSION,
        },
      } as unknown as IItem,
      data: {},
    };
    const c = await applyInitiativeMigrations(m, {});
    expect(c).toBe(m);
  });

  it("skip on schema version >= 2.1", async () => {
    const m: IModel = {
      item: {
        id: "00c",
        type: "Hub Initiative",
        owner: "Bob",
        created: 123,
        properties: {
          contentGroupId: "abc",
          schemaVersion: 2.1,
        },
      } as unknown as IItem,
      data: {},
    };
    const c = await applyInitiativeMigrations(m, {});
    expect(c).toBe(m);
  });

  describe("invalid timeline migration:", () => {
    it("removes single stage with no title and updates schemaVersion to 2.1", async () => {
      const m: IModel = {
        item: {
          id: "00c",
          type: "Hub Initiative",
          owner: "Bob",
          created: 123,
          properties: {
            schemaVersion: 1.1,
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
      const c = await applyInitiativeMigrations(m, {});
      expect(c).not.toBe(m);
      expect(c.data?.view?.timeline?.stages).toEqual([]);
      expect(c.item.properties.schemaVersion).toBe(2.1);
    });
  });

  describe("default catalog:", () => {
    it("add default catalog", async () => {
      const m: IModel = {
        item: {
          id: "00c",
          type: "Hub Initiative",
          owner: "Bob",
          created: 123,
          properties: {
            contentGroupId: "abc",
            schemaVersion: 1.0,
          },
        } as unknown as IItem,
        data: {},
      };
      const c = await applyInitiativeMigrations(m, {});
      expect(c).not.toBe(m);
      expect(c.data?.catalog).toBeDefined();
      const groups = getProp(
        c,
        "data.catalog.scopes.item.filters[0].predicates[0].group"
      );
      expect(groups).toEqual(["abc"]);
    });

    it("add default catalog handles no contentGroupId", async () => {
      const m: IModel = {
        item: {
          id: "00c",
          type: "Hub Initiative",
          owner: "Bob",
          created: 123,
        } as unknown as IItem,
        data: {},
      };
      const c = await applyInitiativeMigrations(m, {});
      expect(c).not.toBe(m);
      expect(c.data?.catalog).toBeDefined();
      const groups = getProp(
        c,
        "data.catalog.scopes.item.filters[0].predicates[0].group"
      );
      expect(groups).toEqual([]);
    });
  });
});
