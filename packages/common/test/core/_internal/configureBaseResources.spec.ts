import {
  describe,
  it,
  expect,
} from "vitest";
import { configureBaseResources } from "../../../src/core/_internal/configureBaseResources";
import { EntityResourceMap } from "../../../src/core/types/types";

describe("configureBaseResources:", () => {
  it("takes a resources object and returns an array of objects with a filename and resource", () => {
    const resources = {
      location: {},
      test: {},
    };
    const resp = configureBaseResources(resources, EntityResourceMap);
    expect(resp).toEqual([{ filename: "location.json", resource: {} }]);
  });
});
