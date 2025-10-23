import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as portalModule from "@esri/arcgis-rest-portal";
import { searchVersions } from "../../src/versioning/searchVersions";
import { IHubUserRequestOptions } from "../../src/hub-types";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as ResourcesResponse from "../mocks/versioning/resources.json";

vi.mock("@esri/arcgis-rest-portal");

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
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should fetch item resources then map them through versionMetadataFromResource", async () => {
    const id = "abc123";

    const getItemResourcesSpy = vi
      .spyOn(portalModule, "getItemResources")
      .mockReturnValue(Promise.resolve(ResourcesResponse));

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

    expect(result[0].description).toBe("this is the description");
    expect(result[0].name).toBeUndefined();

    expect(result[1].description).toBeUndefined();
    expect(result[1].name).toBeUndefined();

    expect(result[2].description).toBeUndefined();
    expect(result[2].name).toBe("jupe");
  });
});
