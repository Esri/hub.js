import { IItem } from "@esri/arcgis-rest-types";
import { IModel } from "../../../src";
import { convertFeaturesToLegacyCapabilities } from "../../../src/sites/_internal/convertFeaturesToLegacyCapabilities";

describe("convertFeaturesToLegacyCapabilities", () => {
  it("adds relevant features to the site's legacy capabilities array", () => {
    const modelToUpdate = {
      item: {} as IItem,
      data: {
        settings: {
          features: {
            "hub:site:content": true,
            "hub:site:followers:action": false,
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

    expect(chk.data?.values.capabilities).toEqual(["hideFollow"]);
  });

  it("removes relevant features from the site's legacy capabilities array", () => {
    const modelToUpdate = {
      item: {} as IItem,
      data: {
        settings: {
          features: {
            "hub:site:content": true,
            "hub:site:followers:action": true,
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
          capabilities: ["hideFollow"],
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
