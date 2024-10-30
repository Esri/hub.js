import { addDynamicSlugValidation } from "../../../../src/core/schemas/internal/addDynamicSlugValidation";

describe("addDynamicSlugValidation", () => {
  it("returns the original schema if no slug is present on properties", () => {
    const schema = {
      properties: {},
    };
    const options = {};
    const result = addDynamicSlugValidation(schema, options);
    expect(result).toBe(schema);
  });
  it("returns the original schema if no properties", () => {
    const schema = {};
    const options = {};
    const result = addDynamicSlugValidation(schema, options);
    expect(result).toBe(schema);
  });
  it("adds the dynamic validation", () => {
    const schema = {
      properties: {
        _slug: {
          pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
        },
      },
      // allOf: [],
    } as any;
    const options = {
      orgUrlKey: "orgUrlKey",
      id: "id",
    } as any;
    const result = addDynamicSlugValidation(schema, options);
    expect(result).toEqual({
      properties: {
        _slug: {
          pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
          maxLength: 256 - ("slug".length + 1) - (options.orgUrlKey.length + 1),
        },
      },
      allOf: [
        {
          if: {
            properties: {
              _slug: {
                pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
              },
            },
          },
          then: {
            properties: {
              _slug: {
                isUniqueSlug: {
                  id: "id",
                  orgUrlKey: "orgUrlKey",
                },
              } as any,
            },
          },
        },
      ],
    });
  });
});
