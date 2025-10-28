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
import { createVersion } from "../../src/versioning/createVersion";
import { IHubUserRequestOptions } from "../../src/hub-types";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { VERSION_RESOURCE_NAME } from "../../src/versioning/_internal/constants";
import * as objectToJsonBlobModule from "../../src/resources/object-to-json-blob";
import * as utilModule from "../../src/util";
import { IItemResourceOptions } from "@esri/arcgis-rest-portal";
import { IVersion } from "../../src/versioning/types/IVersion";

vi.mock("@esri/arcgis-rest-portal");

describe("createVersion", () => {
  let portal: string;
  let hubApiUrl: string;
  let requestOpts: IHubUserRequestOptions;
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

  let expectedRequestOpts: IItemResourceOptions;

  const expectedVersionResult: IVersion = {
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
    description: undefined,
    parent: undefined,
    path: "hubVersion_def456/version.json",
    updated: 9876543210,
    size: 123,
  } as unknown as IVersion;

  const versionBlob = { size: 123 };

  let addItemResourceSpy: MockInstance;

  beforeEach(() => {
    portal = MOCK_AUTH.portal;
    hubApiUrl = "https://hubfake.arcgis.com";
    requestOpts = {
      portal,
      isPortal: false,
      hubApiUrl,
      authentication: MOCK_AUTH,
    };

    expectedRequestOpts = {
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

    addItemResourceSpy = vi
      .spyOn(portalModule, "addItemResource")
      .mockReturnValue(Promise.resolve() as any);
    vi.spyOn(objectToJsonBlobModule, "objectToJsonBlob").mockReturnValue(
      versionBlob as any
    );
    vi.spyOn(utilModule, "createId").mockReturnValue("def456");
    vi.spyOn(Date, "now").mockReturnValue(9876543210);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should create a version with default options", async () => {
    const result = await createVersion(model, requestOpts);

    expect(addItemResourceSpy).toHaveBeenCalledTimes(1);
    expect(addItemResourceSpy).toHaveBeenCalledWith(expectedRequestOpts);
    expect(result).toEqual(expectedVersionResult);
  });

  it("should create a version when provided options object", async () => {
    const result = await createVersion(model, requestOpts, {
      description: "this is the description",
      name: "my special version",
      parentId: "ghi789",
    });

    const versionResult: IVersion = {
      ...expectedVersionResult,
      description: "this is the description",
      name: "my special version",
      parent: "ghi789",
    } as unknown as IVersion;

    const options = {
      ...expectedRequestOpts,
      params: {
        properties: {
          created: 9876543210,
          creator: "casey",
          description: "this is the description",
          id: "def456",
          name: "my special version",
          parent: "ghi789",
          updated: 9876543210,
        },
      },
    };

    expect(addItemResourceSpy).toHaveBeenCalledTimes(1);
    expect(addItemResourceSpy).toHaveBeenCalledWith(options);
    expect(result).toEqual(versionResult);
  });
});
