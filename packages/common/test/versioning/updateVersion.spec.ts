import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  MockInstance,
} from "vitest";
import { IModel } from "../../src/hub-types";
import * as portalModule from "@esri/arcgis-rest-portal";
import { updateVersion } from "../../src/versioning/updateVersion";
import { IHubUserRequestOptions } from "../../src/hub-types";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { VERSION_RESOURCE_NAME } from "../../src/versioning/_internal/constants";
import * as objectToJsonBlobModule from "../../src/resources/object-to-json-blob";
import * as utilModule from "../../src/util";
import { IItemResourceOptions } from "@esri/arcgis-rest-portal";
import * as ResourceResponse from "../mocks/versioning/resource.json";
import { IVersion } from "../../src/versioning/types/IVersion";

vi.mock("@esri/arcgis-rest-portal");

describe("updateVersion", () => {
  let portal: string;
  let hubApiUrl: string;
  let requestOpts: IHubUserRequestOptions;
  let version: IVersion;
  let updateItemResourceSpy: MockInstance;

  const model = {
    item: {
      id: "abc123",
      owner: "paige_pa",
      type: "Hub Site Application",
    },
    data: {
      values: {
        layout: "layout",
      },
    },
  } as unknown as IModel;

  const versionBlob = { size: 123 };

  let options: IItemResourceOptions;

  beforeEach(() => {
    portal = MOCK_AUTH.portal;
    hubApiUrl = "https://hubfake.arcgis.com";
    requestOpts = {
      portal,
      isPortal: false,
      hubApiUrl,
      authentication: MOCK_AUTH,
    };

    options = {
      ...requestOpts,
      id: "abc123",
      name: VERSION_RESOURCE_NAME,
      owner: "paige_pa",
      params: {
        properties: {
          created: 9876543210,
          creator: "casey",
          id: "def456",
          updated: 9876543210,
        },
      },
      prefix: "hubVersion_def456",
      resource: versionBlob,
    };

    version = {
      created: 9876543210,
      creator: "casey",
      data: {
        data: {
          values: {
            layout: "layout",
          },
        },
      },
      id: "def456",
      name: undefined,
      parent: undefined,
      path: "hubVersion_def456/version.json",
      updated: "1675954801031",
      size: 123,
    } as unknown as IVersion;

    updateItemResourceSpy = vi
      .spyOn(portalModule, "updateItemResource")
      .mockReturnValue(Promise.resolve() as any);

    vi.spyOn(portalModule, "getItemResource").mockReturnValue(
      Promise.resolve(ResourceResponse) as any
    );

    vi.spyOn(objectToJsonBlobModule, "objectToJsonBlob").mockReturnValue(
      versionBlob as any
    );
    vi.spyOn(utilModule, "createId").mockReturnValue("def456");
    vi.spyOn(Date, "now").mockReturnValue(9876543210);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should update a version when force=true", async () => {
    await updateVersion(model, version, requestOpts, true);

    expect(updateItemResourceSpy).toHaveBeenCalledTimes(1);
    expect(updateItemResourceSpy).toHaveBeenCalledWith(options);
  });

  it("should update a version that is not stale when force=false", async () => {
    version.updated = 1675954801031;
    await updateVersion(model, version, requestOpts, false);

    expect(updateItemResourceSpy).toHaveBeenCalledTimes(1);
    expect(updateItemResourceSpy).toHaveBeenCalledWith(options);
  });

  it("should throw when attempting to update a stale version", async () => {
    try {
      version.updated = 1;
      await updateVersion(model, version, requestOpts);
      fail("should reject");
    } catch (err) {
      expect((err as Error).message).toBe(
        "Version def456 is stale. Use force to overwrite."
      );
    }
  });
});
