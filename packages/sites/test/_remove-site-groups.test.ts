import * as commonModule from "@esri/hub-common";
import { _removeSiteGroups } from "../src";
import { IUserRequestOptions } from "@esri/hub-common/node_modules/@esri/arcgis-rest-auth";

describe("_removeSiteGroups", () => {
  it("removes the groups", async () => {
    const removeSpy = spyOn(
      commonModule,
      "_unprotectAndRemoveGroup"
    ).and.returnValue(Promise.resolve({}));

    const siteModel = {
      item: {
        properties: {
          collaborationGroupId: "abc",
          contentGroupId: "123"
        }
      }
    } as commonModule.IModel;

    const res = await _removeSiteGroups(siteModel, {} as IUserRequestOptions);

    expect(res.length).toBe(2);
    expect(removeSpy.calls.count()).toBe(2);
    expect(removeSpy.calls.argsFor(0)[0].id).toBe("abc");
    expect(removeSpy.calls.argsFor(1)[0].id).toBe("123");
  });
});
