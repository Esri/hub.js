import * as PortalModule from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { sharedWith } from "../../../src/core/_internal/sharedWith";
describe("sharedWith:", () => {
  it("gets groups and re-formats response", async () => {
    const spy = spyOn(PortalModule, "getItemGroups").and.callFake(() => {
      return Promise.resolve({
        admin: [{ id: "3ef", name: "Test Group 1" }],
        member: [{ id: "5ef", name: "Test Group 2" }],
        other: [{ id: "6ef", name: "Test Group 3" }],
      });
    });

    const groups = await sharedWith("00c", {} as IRequestOptions);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(groups.length).toEqual(3);
  });
});
