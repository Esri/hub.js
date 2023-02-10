import * as portalModule from "@esri/arcgis-rest-portal";
import { getVersion } from "../../src/versioning/getVersion";
import { IHubUserRequestOptions } from "../../src/types";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as ResourceResponse from "../mocks/versioning/resource.json";

describe("getVersion", () => {
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

  it("should get the version", async () => {
    const id = "abc123";
    const versionId = "def456";

    const getItemResourceSpy = spyOn(
      portalModule,
      "getItemResource"
    ).and.returnValue(Promise.resolve(ResourceResponse));

    const result = await getVersion(id, versionId, requestOpts);

    const options = {
      ...requestOpts,
      fileName: "hubVersion_def456/version.json",
      readAs: "json",
    };

    expect(getItemResourceSpy).toHaveBeenCalledTimes(1);
    expect(getItemResourceSpy).toHaveBeenCalledWith(id, options);
    expect(result).toEqual(ResourceResponse);
  });
});
