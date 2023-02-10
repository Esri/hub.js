import * as portalModule from "@esri/arcgis-rest-portal";
import { deleteVersion } from "../../src/versioning/deleteVersion";
import { IHubUserRequestOptions } from "../../src/types";
import { MOCK_AUTH } from "../mocks/mock-auth";

describe("deleteVersion", () => {
  let portal: string;
  let hubApiUrl: string;
  let requestOpts: IHubUserRequestOptions;
  beforeEach(() => {
    portal = MOCK_AUTH.portal;
    hubApiUrl = "https://hubfake.arcgis.com";
    requestOpts = {
      portal,
      isPortal: false,
      hubApiUrl,
      authentication: MOCK_AUTH,
    };
  });

  it("should delete the version", async () => {
    const id = "abc123";
    const versionId = "def456";
    const owner = "paige_pa";

    const removeItemResourceSpy = spyOn(
      portalModule,
      "removeItemResource"
    ).and.returnValue(Promise.resolve({ success: true }));

    const result = await deleteVersion(id, versionId, owner, requestOpts);

    const options = {
      ...requestOpts,
      id,
      owner,
      resource: "hubVersion_def456/version.json",
    };

    expect(removeItemResourceSpy).toHaveBeenCalledTimes(1);
    expect(removeItemResourceSpy).toHaveBeenCalledWith(options);
    expect(result).toEqual({ success: true });
  });
});
