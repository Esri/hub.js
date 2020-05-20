import { _getSiteDataById } from "../src";
import * as portalModule from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "@esri/hub-common";

describe("_getSiteDataById", () => {
  it("gets site data", async () => {
    spyOn(portalModule, "getItemData").and.returnValue(
      Promise.resolve({
        values: {
          collaborationGroupId: "foobarbaz"
        }
      })
    );

    const data = await _getSiteDataById("some-id", {} as IHubRequestOptions);

    expect(data.values.collaborationGroupId).toBe("foobarbaz");
  });

  it("applies groupId upgrade when necessary", async () => {
    spyOn(portalModule, "getItemData").and.returnValue(
      Promise.resolve({
        values: {
          groupId: "foobarbaz"
        }
      })
    );

    const data = await _getSiteDataById("some-id", {} as IHubRequestOptions);

    expect(data.values.groupId).not.toBeDefined();
    expect(data.values.collaborationGroupId).toBe("foobarbaz");
  });
});
