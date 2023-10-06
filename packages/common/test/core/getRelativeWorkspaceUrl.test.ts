import { getRelativeWorkspaceUrl } from "../../src/core/getRelativeWorkspaceUrl";
import * as getTypeFromEntityModule from "../../src/core/getTypeFromEntity";
import * as isValidEntityTypeModule from "../../src/core/isValidEntityType";
import * as urlsModule from "../../src/urls";

describe("getRelativeWorkspaceUrl", () => {
  let result;

  describe("valid entity types", () => {
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
    describe("templates", () => {
      let getTypeFromEntitySpy: jasmine.Spy;
      let isValidEntityTypeSpy: jasmine.Spy;
      beforeEach(() => {
        getTypeFromEntitySpy = spyOn(
          getTypeFromEntityModule,
          "getTypeFromEntity"
        ).and.returnValue("template");
        isValidEntityTypeSpy = spyOn(
          isValidEntityTypeModule,
          "isValidEntityType"
        ).and.returnValue(true);
      });

      it("returns the relative workspace url for a solution template", () => {
        result = getRelativeWorkspaceUrl("template", "123");

        expect(getTypeFromEntitySpy).toHaveBeenCalledTimes(1);
        expect(isValidEntityTypeSpy).toHaveBeenCalledTimes(1);
        expect(result).toBe("/workspace/templates/123");
      });
      it("returns the AGO item home url for a deployed solution template", () => {
        const getItemHomeUrlSpy = spyOn(
          urlsModule,
          "getItemHomeUrl"
        ).and.returnValue("/some-item-home-url");

        result = getRelativeWorkspaceUrl("template", "123", ["Deployed"], {});

        expect(getTypeFromEntitySpy).toHaveBeenCalledTimes(1);
        expect(isValidEntityTypeSpy).toHaveBeenCalledTimes(1);
        expect(getItemHomeUrlSpy).toHaveBeenCalledTimes(1);
        expect(result).toBe("/some-item-home-url");
      });
    });
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
