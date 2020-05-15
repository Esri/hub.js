import { ensureOptionalGroupsTemplating } from "../src";

describe("ensureOptionalGroupsTemplating", () => {
  it("ensures optional templating and removes non-templated values", () => {
    const template = {
      properties: {
        collaborationGroupId: "{{another.attr:optional}}",
        contentGroupId: "{{an.attr}}",
        followersGroupId: "foobarbaz"
      }
    };

    expect(ensureOptionalGroupsTemplating(template)).toEqual({
      properties: {
        collaborationGroupId: "{{another.attr:optional}}",
        contentGroupId: "{{an.attr:optional}}"
      }
    });
  });

  it("doesnt blow up when things dont exist", () => {
    const template = {
      properties: {
        collaborationGroupId: "{{another.attr:optional}}"
      }
    };

    expect(ensureOptionalGroupsTemplating(template)).toEqual({
      properties: {
        collaborationGroupId: "{{another.attr:optional}}"
      }
    });
  });
});
