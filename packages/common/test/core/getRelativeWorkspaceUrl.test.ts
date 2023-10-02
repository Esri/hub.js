import { getRelativeWorkspaceUrl } from "../../src/core/getRelativeWorkspaceUrl";
import * as getTypeFromEntityModule from "../../src/core/getTypeFromEntity";
import * as isValidEntityTypeModule from "../../src/core/isValidEntityType";

describe("getRelativeWorkspaceUrl", () => {
  let result;

  it("returns the relative workspace url if provided a valid entity type", () => {
    const getTypeFromEntitySpy = spyOn(
      getTypeFromEntityModule,
      "getTypeFromEntity"
    ).and.returnValue("project");
    const isValidEntityTypeSpy = spyOn(
      isValidEntityTypeModule,
      "isValidEntityType"
    ).and.returnValue(true);

    result = getRelativeWorkspaceUrl("Hub Project", "123");

    expect(getTypeFromEntitySpy).toHaveBeenCalledTimes(1);
    expect(isValidEntityTypeSpy).toHaveBeenCalledTimes(1);
    expect(result).toBe("/workspace/projects/123");
  });
  it("returns the relative workspace url if provided entity type content", () => {
    const getTypeFromEntitySpy = spyOn(
      getTypeFromEntityModule,
      "getTypeFromEntity"
    ).and.returnValue("content");
    const isValidEntityTypeSpy = spyOn(
      isValidEntityTypeModule,
      "isValidEntityType"
    ).and.returnValue(true);

    result = getRelativeWorkspaceUrl("Web Mapping Application", "123");

    expect(getTypeFromEntitySpy).toHaveBeenCalledTimes(1);
    expect(isValidEntityTypeSpy).toHaveBeenCalledTimes(1);
    expect(result).toBe("/workspace/content/123");
  });
  it('returns "/" if provided an invalid entity type', () => {
    const getTypeFromEntitySpy = spyOn(
      getTypeFromEntityModule,
      "getTypeFromEntity"
    ).and.returnValue("project");
    const isValidEntityTypeSpy = spyOn(
      isValidEntityTypeModule,
      "isValidEntityType"
    ).and.returnValue(false);

    result = getRelativeWorkspaceUrl("Hub Project", "123");

    expect(getTypeFromEntitySpy).toHaveBeenCalledTimes(1);
    expect(isValidEntityTypeSpy).toHaveBeenCalledTimes(1);
    expect(result).toBe("/");
  });
});
