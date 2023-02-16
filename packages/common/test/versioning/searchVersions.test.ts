import * as portalModule from "@esri/arcgis-rest-portal";
import { searchVersions } from "../../src/versioning/searchVersions";
import { IHubUserRequestOptions } from "../../src/types";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as ResourcesResponse from "../mocks/versioning/resources.json";

describe("searchVersions", () => {
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

  it("should fetch item resources then map them through versionMetadataFromResource", async () => {
    const id = "abc123";

    const getItemResourcesSpy = spyOn(
      portalModule,
      "getItemResources"
    ).and.returnValue(Promise.resolve(ResourcesResponse));

    const result = await searchVersions(id, requestOpts);

    const options = {
      ...requestOpts,
      params: {
        sortField: "created",
        sortOrder: "desc",
      },
    };
    expect(getItemResourcesSpy).toHaveBeenCalledTimes(1);
    expect(getItemResourcesSpy).toHaveBeenCalledWith(id, options);
    expect(result.length).toEqual(7);
  });
});
