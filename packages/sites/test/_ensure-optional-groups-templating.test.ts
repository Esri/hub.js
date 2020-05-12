import { _ensureOptionalGroupsTemplating } from "../src";
import { IItemTemplate } from "@esri/hub-common";

describe("_ensureOptionalGroupsTemplating", () => {
  it("ensures templating", () => {
    const tmpl = {
      properties: {
        collaborationGroupId: "{{foobar}}",
        contentGroupId: "{{foobar:optional}}",
        followersGroupId: "scooby"
      }
    } as IItemTemplate;

    expect(_ensureOptionalGroupsTemplating(tmpl)).toEqual({
      properties: {
        collaborationGroupId: "{{foobar:optional}}",
        contentGroupId: "{{foobar:optional}}"
      }
    });
  });

  it("ignores non-existant values", () => {
    const tmpl = {
      properties: {
        collaborationGroupId: "{{foobar}}",
        contentGroupId: "{{foobar:optional}}",
        followersGroupId: undefined
      }
    } as IItemTemplate;

    expect(
      _ensureOptionalGroupsTemplating(tmpl).properties.followersGroupId
    ).toBeUndefined();
  });
});
