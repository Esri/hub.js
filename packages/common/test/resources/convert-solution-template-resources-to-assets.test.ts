import {
  IModelTemplate,
  IHubRequestOptions,
  convertSolutionTemplateResourcesToAssets
} from "../../src";

describe("convertSolutionTemplateResourceToAsset", function() {
  it("converts the resources to assets", function() {
    const template: IModelTemplate = {
      itemId: "item-id",
      item: {},
      data: {},
      type: "some-type",
      key: "key",
      resources: ["funimage.jpg", "itemthumb.png"],
      bundleItemId: "solutionitemid"
    };

    const ro: IHubRequestOptions = {
      isPortal: false,
      hubApiUrl: "",
      portalSelf: {
        id: "",
        name: "",
        isPortal: true,
        portalHostname: "portal-hostname"
      }
    };

    const assets = convertSolutionTemplateResourcesToAssets(template, ro);

    expect(assets).toEqual([
      {
        name: "funimage.jpg",
        type: "resource",
        url:
          "https://portal-hostname/sharing/rest/content/items/solutionitemid/resources/item-id-funimage.jpg"
      },
      {
        name: "itemthumb.png",
        type: "resource",
        url:
          "https://portal-hostname/sharing/rest/content/items/solutionitemid/resources/item-id-itemthumb.png"
      }
    ]);
  });

  it("returns empty array when resources or bundleItemId missing", function() {
    const templateWithoutBundle: IModelTemplate = {
      itemId: "item-id",
      item: {},
      data: {},
      type: "some-type",
      key: "key",
      resources: ["funimage.jpg", "itemthumb.png"]
      // bundleItemId: 'solutionitemid'
    };

    const ro: IHubRequestOptions = {
      isPortal: false,
      hubApiUrl: ""
    };

    const assets = convertSolutionTemplateResourcesToAssets(
      templateWithoutBundle,
      ro
    );

    expect(assets).toEqual([]);

    const templateWithoutResources: IModelTemplate = {
      itemId: "item-id",
      item: {},
      data: {},
      type: "some-type",
      key: "key",
      // resources: ['funimage.jpg', 'itemthumb.png'],
      bundleItemId: "solutionitemid"
    };

    const assets2 = convertSolutionTemplateResourcesToAssets(
      templateWithoutResources,
      ro
    );

    expect(assets2).toEqual([]);
  });
});
