import { updatePage } from "../../src";
import * as commonModule from "@esri/hub-common";
import { IModel, IHubUserRequestOptions, cloneObject } from "@esri/hub-common";

describe("updatePage", () => {
  const model = {
    item: {
      id: "page-id",
      url: "to-be-deleted",
      someOtherProp: "new version",
      title: "new title",
    },
    data: {
      values: {
        layout: "new-layout",
        updatedAt: "some-past-ISO",
        updatedBy: "chewie",
      },
    },
  } as unknown as IModel;

  const ro = {
    authentication: {
      username: "tate",
    },
  } as IHubUserRequestOptions;

  let updateSpy: jasmine.Spy;
  beforeEach(() => {
    updateSpy = spyOn(commonModule, "updateItem").and.returnValue(
      Promise.resolve({ success: true })
    );
  });

  it("updates the page", async () => {
    const getModelSpy = spyOn(commonModule, "getModel");

    const updateSiteOptions = {
      ...ro,
      allowList: [] as string[],
    };

    await updatePage(cloneObject(model), updateSiteOptions);

    // model not fetched from ago when patchList empty
    expect(getModelSpy).not.toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();

    const updatedItem = updateSpy.calls.argsFor(0)[0].item;
    expect(updatedItem.url).toBe("", "should stamp out url");

    const updatedData = JSON.parse(updatedItem.text);
    expect(updatedData.values.updatedAt).not.toBe(
      "some-past-ISO",
      "replace updatedAt"
    );
    expect(updatedData.values.updatedBy).toBe(
      "tate",
      "should replace updatedBy"
    );
  });

  it("handles a patch-list", async () => {
    const modelInAGO = {
      item: {
        url: "old url",
        title: "old title",
        someOtherProp: "old version",
        id: "page-id",
      },
      data: {
        values: {
          layout: "old-layout",
          updatedAt: "some-past-ISO",
          updatedBy: "chewie",
        },
      },
    };

    const getModelSpy = spyOn(commonModule, "getModel").and.returnValue(
      Promise.resolve(modelInAGO)
    );

    const updateSiteOptions = {
      ...ro,
      allowList: ["item.title"],
    };

    await updatePage(cloneObject(model), updateSiteOptions);

    // model fetched from ago when patchList not empty
    expect(getModelSpy).toHaveBeenCalledWith("page-id", updateSiteOptions);
    expect(updateSpy).toHaveBeenCalled();

    const savedItem = updateSpy.calls.argsFor(0)[0].item;
    expect(savedItem.title).toBe("new title", "title updated");
    expect(savedItem.url).toBe("old url", "url NOT updated");
    expect(savedItem.someOtherProp).toBe(
      "old version",
      "other prop NOT updated"
    );
  });

  it("doesnt remove unused resources if update failed", async () => {
    updateSpy.and.returnValue(Promise.resolve({ success: false }));

    await updatePage(cloneObject(model), ro);

    expect(updateSpy).toHaveBeenCalled();
  });
});
