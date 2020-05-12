import { _removeParentInitiative } from "../src";
import * as commonModule from "@esri/hub-common";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";

describe("_removeParentInitiative", () => {
  it("removes the groups", async () => {
    const removeSpy = spyOn(
      commonModule,
      "_unprotectAndRemoveItem"
    ).and.returnValue(Promise.resolve({}));

    const siteModel = {
      item: {
        properties: {
          parentInitiativeId: "parent"
        }
      }
    } as commonModule.IModel;

    await _removeParentInitiative(siteModel, {} as IUserRequestOptions);

    expect(removeSpy.calls.count()).toBe(1);
    expect(removeSpy.calls.argsFor(0)[0].id).toBe("parent");
  });

  it("removes the groups", async () => {
    const removeSpy = spyOn(
      commonModule,
      "_unprotectAndRemoveItem"
    ).and.returnValue(Promise.resolve({}));

    const siteModel = {
      item: {
        properties: {
          parentInitiativeId: null
        }
      }
    } as commonModule.IModel;

    await _removeParentInitiative(siteModel, {} as IUserRequestOptions);

    expect(removeSpy.calls.count()).toBe(
      0,
      "_removeParentInitiative not called when no id"
    );
  });
});
