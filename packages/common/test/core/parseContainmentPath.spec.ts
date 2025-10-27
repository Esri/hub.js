import {
  describe,
  it,
  expect,
} from "vitest";
import {
  getHubEntityTypeFromPath,
  getPathForHubEntityType,
  parseContainmentPath,
} from "../../src/core/parseContainmentPath";
import { HubEntityType } from "../../src/core/types/HubEntityType";

describe("parseContainmentPath:", () => {
  it("path needs even number of parts", () => {
    const path = "/sites/00b/initiatives";

    const result = parseContainmentPath(path);
    expect(result.valid).toBeFalsy();
    expect(result.reason).toBe(
      "Path does not contain an even number of parts."
    );
  });

  it("path needs less than 10 parts", () => {
    const path =
      "sites/00a/initiatives/00b/projects/00c/content/00d/content/00c/content/00e";

    const result = parseContainmentPath(path);
    expect(result.valid).toBeFalsy();
    expect(result.reason).toBe("Path is > 5 entities deep.");
  });

  it("path needs valid paths", () => {
    const path = "sites/00a/initiatives/00b/projects/00c/wallaby/00d";

    const result = parseContainmentPath(path);
    expect(result.valid).toBeFalsy();
    expect(result.reason).toBe("Path contains invalid segment: wallaby.");
  });

  it("good path parses clean", () => {
    const path = "sites/00a/initiatives/00b/projects/00c";
    const result = parseContainmentPath(path);
    expect(result.valid).toBeTruthy();
    expect(result.reason).toBe("");
    expect(result.parts).toEqual(path.split("/"));
  });
});

describe("getPathForHubEntitType:", () => {
  it("returns the path for a given HubEntityType", () => {
    expect(getPathForHubEntityType("site")).toBe("sites");
    expect(getPathForHubEntityType("project")).toBe("projects");
    expect(getPathForHubEntityType("content")).toBe("content");
    expect(getPathForHubEntityType("invalid" as unknown as HubEntityType)).toBe(
      ""
    );
  });
});

describe("getHubEntityTypeFromPath:", () => {
  it("returns the HubEntityType for a given path", () => {
    expect(getHubEntityTypeFromPath("sites")).toBe("site");
    expect(getHubEntityTypeFromPath("projects")).toBe("project");
    expect(getHubEntityTypeFromPath("content")).toBe("content");
  });
});
