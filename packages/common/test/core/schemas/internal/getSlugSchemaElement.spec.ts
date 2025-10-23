import {
  describe,
  it,
  expect,
} from "vitest";
import { getSlugSchemaElement } from "../../../../src/core/schemas/internal/getSlugSchemaElement";

describe("getSlugSchemaElement", () => {
  it("returns a slug schema element", () => {
    const element = getSlugSchemaElement("some.scope");
    expect(element).toEqual({
      labelKey: "some.scope.fields.slug.label",
      scope: "/properties/_slug",
      type: "Control",
      options: {
        control: "hub-field-input-input",
        messages: [
          {
            type: "ERROR",
            keyword: "pattern",
            icon: true,
            labelKey: "some.scope.fields.slug.patternError",
          },
          {
            type: "ERROR",
            keyword: "isUniqueSlug",
            icon: true,
            labelKey: "some.scope.fields.slug.isUniqueError",
          },
        ],
      },
    });
  });
});
