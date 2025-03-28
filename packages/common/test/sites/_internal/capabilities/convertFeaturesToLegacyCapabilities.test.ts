import type { IItem } from "@esri/arcgis-rest-portal";
import { IModel } from "../../../../src";
import { convertFeaturesToLegacyCapabilities } from "../../../../src/sites/_internal/capabilities/convertFeaturesToLegacyCapabilities";

describe("convertFeaturesToLegacyCapabilities", () => {
  it("adds relevant features to the site's legacy capabilities array", () => {
    const modelToUpdate = {
      item: {} as IItem,
      data: {
        settings: {
          features: {
            "hub:site:content": true,
            "hub:site:feature:follow": false,
            "hub:site:feature:discussions": false,
          },
        },
        values: {
          capabilities: [],
        },
      },
    } as IModel;
    const currentModel = {
      item: {} as IItem,
      data: {
        settings: {
          features: {
            "hub:site:content": true,
          },
        },
        values: {
          capabilities: [],
        },
      },
    } as IModel;

    const chk = convertFeaturesToLegacyCapabilities(
      modelToUpdate,
      currentModel
    );

    expect(chk.data?.values.capabilities).toEqual([
      "hideFollow",
      "disableDiscussions",
    ]);
  });

  it("removes relevant features from the site's legacy capabilities array", () => {
    const modelToUpdate = {
      item: {} as IItem,
      data: {
        settings: {
          features: {
            "hub:site:content": true,
            "hub:site:feature:follow": true,
            "hub:site:feature:discussions": true,
          },
        },
        values: {
          capabilities: [],
        },
      },
    } as IModel;
    const currentModel = {
      item: {} as IItem,
      data: {
        settings: {
          features: {
            "hub:site:content": true,
          },
        },
        values: {
          capabilities: ["hideFollow", "disableDiscussions"],
        },
      },
    } as IModel;

    const chk = convertFeaturesToLegacyCapabilities(
      modelToUpdate,
      currentModel
    );

    expect(chk.data?.values.capabilities).toEqual([]);
  });
});
