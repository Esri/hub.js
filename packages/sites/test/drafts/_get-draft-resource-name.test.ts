import { _getDraftResourceName } from "../../src/drafts";
import * as portalModule from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "@esri/hub-common";

describe("_getDraftResourceName", () => {
  const responseWithDraft = {
    resources: [
      { resource: "foo-bar-baz.png" },
      { resource: "somephoto.jpeg" },
      { resource: "draft-123456789.json" }
    ]
  };

  const responseWithoutDraft = {
    resources: [{ resource: "foo-bar-baz.png" }, { resource: "somephoto.jpeg" }]
  };

  it("gets the resource name, or returns falsey if no draft found", async () => {
    const resourcesSpy = spyOn(
      portalModule,
      "getItemResources"
    ).and.returnValue(Promise.resolve(responseWithDraft));
    const ro = ({
      portal: "my-portal",
      authentication: "my-auth"
    } as unknown) as IHubRequestOptions;

    const chk = await _getDraftResourceName("1234", ro);

    expect(resourcesSpy).toHaveBeenCalledWith("1234", {
      portal: ro.portal,
      authentication: ro.authentication
    });
    expect(chk).toBe("draft-123456789.json");

    // no draft
    resourcesSpy.and.returnValue(Promise.resolve(responseWithoutDraft));
    const chk2 = await _getDraftResourceName("1234", ro);
    expect(chk2).toBeFalsy();
  });
});
