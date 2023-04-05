import { IVersionMetadata } from "../../src/versioning/types";
import { versionMetadataFromResource } from "../../src/versioning/_internal/versionMetadataFromResource";

describe("versionMetadataFromResource", () => {
  const baseResource = {
    access: "private",
    created: 1675967213000,
    resource: "hubVersion_abc123/version.json",
    size: 123,
  };

  const baseExpected = {
    access: "private",
    path: "hubVersion_abc123/version.json",
    size: 123,
  } as IVersionMetadata;

  it("handles expected resource structure", async () => {
    const resource = {
      ...baseResource,
      properties:
        '{"created":1675967213542,"creator":"paige_pa","id":"abc123","updated":1675967213542}',
    };
    const result = versionMetadataFromResource(resource);
    const expected = {
      ...baseExpected,
      created: 1675967213542,
      creator: "paige_pa",
      id: "abc123",
      updated: 1675967213542,
    };
    expect(result).toEqual(expected);
  });

  it("handles expected resource structure with name and description", async () => {
    const resource = {
      ...baseResource,
      properties:
        '{"created":1675967213542,"creator":"paige_pa","description":"this is the description","id":"abc123","name":"this is the name","updated":1675967213542}',
    };
    const result = versionMetadataFromResource(resource);
    const expected = {
      ...baseExpected,
      created: 1675967213542,
      creator: "paige_pa",
      description: "this is the description",
      id: "abc123",
      name: "this is the name",
      updated: 1675967213542,
    };
    expect(result).toEqual(expected);
  });

  it("handles missing properties key", async () => {
    const result = versionMetadataFromResource(baseResource);
    expect(result).toEqual(baseExpected);
  });

  it("handles properties key as object", async () => {
    // NOTE: today this is not an object but it could be in the future
    const resource = {
      ...baseResource,
      properties: { foo: "bar" },
    };
    const result = versionMetadataFromResource(resource);
    expect(result).toEqual(baseExpected);
  });
});
