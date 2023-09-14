import { IItem } from "@esri/arcgis-rest-types";
import { IModel } from "../../../../src";
import { migrateLegacyCapabilitiesToFeatures } from "../../../../src/sites/_internal/capabilities/migrateLegacyCapabilitiesToFeatures";

describe("migrateLegacyCapabilitiesToFeatures", () => {
  it("adds legacy capabilities to old sites without features", () => {
    const model = {
      item: {} as IItem,
      data: {
        settings: {},
        values: {
          capabilities: ["hideFollow"],
        },
      },
    } as IModel;

    const chk = migrateLegacyCapabilitiesToFeatures(model);

    expect(chk.data?.settings.features).toEqual({
      "hub:site:feature:follow": false,
    });
  });
  it("adds legacy capabilities to existing features on a site", () => {
    const model = {
      item: {} as IItem,
      data: {
        settings: {
          features: {
            "hub:site:events": true,
          },
        },
        values: {
          capabilities: ["hideFollow"],
        },
      },
    } as IModel;

    const chk = migrateLegacyCapabilitiesToFeatures(model);

    expect(chk.data?.settings.features).toEqual({
      "hub:site:events": true,
      "hub:site:feature:follow": false,
    });
  });
});
