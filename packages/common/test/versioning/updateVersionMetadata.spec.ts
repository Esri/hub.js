import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as portalModule from "@esri/arcgis-rest-portal";
import { updateVersionMetadata } from "../../src/versioning/updateVersionMetadata";
import { IHubUserRequestOptions } from "../../src/hub-types";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as ResourceResponse from "../mocks/versioning/resource.json";
import * as objectToJsonBlobModule from "../../src/resources/object-to-json-blob";
import { IVersionMetadata } from "../../src/versioning/types/IVersionMetadata";
import { cloneObject } from "../../src/util";

vi.mock("@esri/arcgis-rest-portal");

describe("updateVersionMetadata", () => {
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

  it("should update the version metadata", async () => {
    const version: IVersionMetadata = {
      id: "def456",
      created: 123,
      creator: "jupe",
      name: "my special version",
      path: "",
      updated: 456,
    };
    const id = "abc123";

    const getItemResourceSpy = vi
      .spyOn(portalModule, "getItemResource")
      .mockReturnValue(Promise.resolve(cloneObject(ResourceResponse)) as any);

    const updateItemResourceSpy = vi
      .spyOn(portalModule, "updateItemResource")
      .mockReturnValue(Promise.resolve(version) as any);

    const versionBlob = { size: 123 };

    vi.spyOn(objectToJsonBlobModule, "objectToJsonBlob").mockReturnValue(
      versionBlob as any
    );

    const result = await updateVersionMetadata(
      id,
      version,
      "casey",
      requestOpts
    );

    const options = {
      ...requestOpts,
      id,
      name: "version.json",
      params: {
        properties: {
          created: 123,
          creator: "jupe",
          id: "def456",
          name: "my special version",
          updated: 456,
        },
      },
      owner: "casey",
      prefix: "hubVersion_def456",
      resource: versionBlob,
    };

    expect(getItemResourceSpy).toHaveBeenCalledTimes(1);
    expect(updateItemResourceSpy).toHaveBeenCalledTimes(1);
    expect(updateItemResourceSpy).toHaveBeenCalledWith(options);
    expect(result).toEqual(version);
  });
});
