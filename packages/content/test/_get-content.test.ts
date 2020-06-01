import { getContent } from "../src";
import * as portalModule from "@esri/arcgis-rest-portal";
import * as hubModule from "@esri/hub-common";

describe("getContent", () => {
  it("get content data from portal", async () => {
    spyOn(hubModule, "getModel").and.returnValue(
      Promise.resolve({
        description: "Content from Portal"
      })
    );

    const content = await getContent("some-id", {isPortal: true} as hubModule.IHubRequestOptions);

    expect(content.description).toBe("Content from Portal");
  });

  it("get content data from Hub", async () => {
    spyOn(hubModule, "getFromHubAPI").and.returnValue(
      Promise.resolve({
        description: "Content from Hub"
      })
    );

    const content = await getContent("some-id", {isPortal: false} as hubModule.IHubRequestOptions);

    expect(content.description).toBe("Content from Hub");
  });
});
