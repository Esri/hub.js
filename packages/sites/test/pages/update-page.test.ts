import { updatePage } from "../../src";
import * as portalModule from "@esri/arcgis-rest-portal";
import * as removeResourcesModule from "../../src/layout/remove-unused-resources";
import { IModel, IHubRequestOptions, cloneObject } from "@esri/hub-common";

describe("updatePage", () => {
  const model = ({
    item: {
      url: "to-be-removed"
    },
    data: {
      values: {
        updatedAt: "some-past-ISO",
        updatedBy: "chewie"
      }
    }
  } as unknown) as IModel;

  const ro = {
    authentication: {
      username: "tate"
    }
  } as IHubRequestOptions;

  let updateSpy: jasmine.Spy;
  let removeResourcesSpy: jasmine.Spy;
  beforeEach(() => {
    updateSpy = spyOn(portalModule, "updateItem").and.returnValue(
      Promise.resolve({ success: true })
    );

    removeResourcesSpy = spyOn(
      removeResourcesModule,
      "removeUnusedResources"
    ).and.returnValue(Promise.resolve({ success: true }));
  });

  it("updates the page", async () => {
    await updatePage(cloneObject(model), ro);

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

    expect(removeResourcesSpy).toHaveBeenCalled();
  });

  it("doesnt remove unused resources if update failed", async () => {
    updateSpy.and.returnValue(Promise.resolve({ success: false }));

    await updatePage(cloneObject(model), ro);

    expect(updateSpy).toHaveBeenCalled();
    expect(removeResourcesSpy).not.toHaveBeenCalled();
  });
});
