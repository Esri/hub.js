import {
  describe,
  it,
  expect,
  vi,
} from "vitest";
import { getRelativeWorkspaceUrl } from "../../src/core/getRelativeWorkspaceUrl";
import * as getTypeFromEntityModule from "../../src/core/getTypeFromEntity";
import * as isValidEntityTypeModule from "../../src/core/isValidEntityType";

describe("getRelativeWorkspaceUrl", () => {
  let result;

  it("returns the relative workspace url if provided a valid entity type", () => {
    const getTypeFromEntitySpy = vi
      .spyOn(getTypeFromEntityModule, "getTypeFromEntity")
      .mockReturnValue("project");
    const isValidEntityTypeSpy = vi
      .spyOn(isValidEntityTypeModule, "isValidEntityType")
      .mockReturnValue(true);

    result = getRelativeWorkspaceUrl("Hub Project", "123");

    expect(getTypeFromEntitySpy).toHaveBeenCalledTimes(1);
    expect(isValidEntityTypeSpy).toHaveBeenCalledTimes(1);
    expect(result).toBe("/workspace/projects/123");
  });
  it("returns the relative workspace url if provided entity type content", () => {
    const getTypeFromEntitySpy = vi
      .spyOn(getTypeFromEntityModule, "getTypeFromEntity")
      .mockReturnValue("content");
    const isValidEntityTypeSpy = vi
      .spyOn(isValidEntityTypeModule, "isValidEntityType")
      .mockReturnValue(true);

    result = getRelativeWorkspaceUrl("Web Mapping Application", "123");

    expect(getTypeFromEntitySpy).toHaveBeenCalledTimes(1);
    expect(isValidEntityTypeSpy).toHaveBeenCalledTimes(1);
    expect(result).toBe("/workspace/content/123");
  });
  it('returns "/" if provided an invalid entity type', () => {
    const getTypeFromEntitySpy = vi
      .spyOn(getTypeFromEntityModule, "getTypeFromEntity")
      .mockReturnValue("project");
    const isValidEntityTypeSpy = vi
      .spyOn(isValidEntityTypeModule, "isValidEntityType")
      .mockReturnValue(false);

    result = getRelativeWorkspaceUrl("Hub Project", "123");

    expect(getTypeFromEntitySpy).toHaveBeenCalledTimes(1);
    expect(isValidEntityTypeSpy).toHaveBeenCalledTimes(1);
    expect(result).toBe("/");
  });
  it("returns url with workspace pane when provided", () => {
    const getTypeFromEntitySpy = vi
      .spyOn(getTypeFromEntityModule, "getTypeFromEntity")
      .mockReturnValue("project");
    const isValidEntityTypeSpy = vi
      .spyOn(isValidEntityTypeModule, "isValidEntityType")
      .mockReturnValue(true);

    result = getRelativeWorkspaceUrl("Hub Project", "123", "details");

    expect(getTypeFromEntitySpy).toHaveBeenCalledTimes(1);
    expect(isValidEntityTypeSpy).toHaveBeenCalledTimes(1);
    expect(result).toBe("/workspace/projects/123/details");
  });
});
