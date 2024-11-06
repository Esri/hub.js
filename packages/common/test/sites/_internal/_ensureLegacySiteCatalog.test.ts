import { _ensureLegacySiteCatalog } from "../../../src/sites/_internal/_ensureLegacySiteCatalog";
import { IModel } from "../../../src/types";

describe("_ensureLegacySiteCatalog:", () => {
  it("skips if model > 1.8", () => {
    const model = {
      item: {
        properties: {
          schemaVersion: 1.9,
        },
      },
      data: {
        catalog: {
          groups: [],
        },
      },
    } as unknown as IModel;
    const chk = _ensureLegacySiteCatalog(model);
    expect(chk).toBe(model);
  });
  it("skips if model has legacy format", () => {
    const model = {
      item: {
        properties: {
          schemaVersion: 1.8,
        },
      },
      data: {
        catalog: {
          groups: [],
        },
      },
    } as unknown as IModel;
    const chk = _ensureLegacySiteCatalog(model);
    expect(chk).toBe(model);
  });
  it("return legacy format if catalog not defined", () => {
    const model = {
      item: {
        properties: {
          schemaVersion: 1.8,
        },
      },
      data: {},
    } as unknown as IModel;

    const chk = _ensureLegacySiteCatalog(model);
    expect(chk.data?.catalog?.groups).toEqual([]);
  });
  it("converts to legacy format if present", () => {
    const model = {
      item: {
        properties: {
          schemaVersion: 1.8,
        },
      },
      data: {
        catalog: {
          schemaVersion: 1,
          scopes: {
            item: {
              targetEntity: "item",
              filters: [
                {
                  predicates: [
                    {
                      group: ["9001"],
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    } as unknown as IModel;

    const chk = _ensureLegacySiteCatalog(model);
    expect(chk.data?.catalog?.groups).toEqual(["9001"]);
  });
});
