import { convertPageToTemplate } from "../../src";
import {
  IModel,
  IHubRequestOptions,
  ITemplateAsset,
  cloneObject
} from "@esri/hub-common";
import * as commonModule from "@esri/hub-common";
import { testLayout } from "../mock-layout.test";

describe("convertPageToTemplate", () => {
  const model = ({
    item: {
      id: "page-id",
      title: "Some fun page"
    },
    data: {
      values: {
        sites: [{ id: "site1" }, { id: "site2" }],
        source: "delete",
        updatedAt: "delete",
        updatedBy: "delete",
        folderId: "delete",
        slug: "delete",
        testIdReplacement: "page-id",
        layout: testLayout
      }
    }
  } as unknown) as IModel;

  const ro = {
    isPortal: false
  } as IHubRequestOptions;

  const assets: ITemplateAsset[] = [
    {
      mimeType: "image/png",
      name: "some-name",
      url: "some-url",
      type: "some-type"
    }
  ];

  beforeEach(() => {
    spyOn(commonModule, "getItemAssets").and.returnValue(
      Promise.resolve(assets)
    );
  });

  it("convert page to template", async () => {
    const chk = await convertPageToTemplate(cloneObject(model), ro);

    expect(chk.type).toBe("Hub Page");
    expect(chk.key).toBeDefined();
    expect(chk.itemId).toBe("page-id");
    expect(chk.assets).toBe(assets);
    expect(chk.dependencies).toEqual([
      "cc2",
      "cc3",
      "0ee0b0a435db49969bbd93a7064a321c",
      "eb173fb9d0084c4bbd19b40ee186965f",
      "e8201f104dca4d8d87cb4ce1c7367257",
      "5a14dbb7b2f3417fb4a6ea0506c2eb26"
    ]);
    expect(chk.data.values.sites).toEqual([], "sites are emptied");
    expect(chk.data.values.testIdReplacement).toBe("{{appid}}");
    expect(chk.item.properties).toEqual({}, "properties created");

    // Removed correct attributes
    expect(chk.data.source).not.toBeDefined();
    expect(chk.data.updatedAt).not.toBeDefined();
    expect(chk.data.updatedBy).not.toBeDefined();
    expect(chk.data.folderId).not.toBeDefined();
    expect(chk.data.slug).not.toBeDefined();
  });

  it("preserves existing properties", async () => {
    const localModel = cloneObject(model);
    localModel.item.properties = { foo: "bar" };
    const chk = await convertPageToTemplate(localModel, ro);
    expect(chk.item.properties.foo).toBe("bar");
  });
});
