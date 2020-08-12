import {
  addSolutionResourceUrlToAssets,
  IModelTemplate,
  IHubRequestOptions
} from "../../src";

describe("addSolutionResourceUrlToAssets", () => {
  it("attaches solution assets when bundle item id", async () => {
    const tmpl = ({
      bundleItemId: "123",
      itemId: "item-id",
      assets: [
        {
          mimeType: "image/png",
          name: "thumbnail.png",
          type: "thumbnail"
        },
        {
          mimeType: "image/png",
          name: "kitten.png"
        }
      ]
    } as unknown) as IModelTemplate;

    const ro = ({
      portalSelf: {
        portalHostname: "foo-bar",
        isPortal: true
      }
    } as unknown) as IHubRequestOptions;

    const res = addSolutionResourceUrlToAssets(tmpl, ro);

    expect(res).toEqual([
      {
        name: "thumbnail.png",
        type: "thumbnail",
        url:
          "https://foo-bar/sharing/rest/content/items/123/resources/item-id-thumbnail.png"
      },
      {
        name: "kitten.png",
        type: "resource",
        url:
          "https://foo-bar/sharing/rest/content/items/123/resources/item-id-kitten.png"
      }
    ]);
  });

  it("does nothing when no bundle item id", async () => {
    const tmpl = ({
      itemId: "item-id",
      assets: [
        {
          mimeType: "image/png",
          name: "thumbnail.png",
          type: "thumbnail"
        }
      ]
    } as unknown) as IModelTemplate;

    const ro = ({
      portalSelf: {
        portalHostname: "foo-bar",
        isPortal: true
      }
    } as unknown) as IHubRequestOptions;

    const res = addSolutionResourceUrlToAssets(tmpl, ro);

    expect(res).toEqual([
      {
        mimeType: "image/png",
        name: "thumbnail.png",
        type: "thumbnail"
      }
    ]);
  });
});
