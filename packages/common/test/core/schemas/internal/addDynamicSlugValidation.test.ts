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
          maxLength: 256 - ("slug".length + 1) - (options.orgUrlKey.length + 1),
        },
      },
      allOf: [
        {
          if: {
            properties: {
              _slug: {
                minLength: 1,
              },
            },
          },
          then: {
            properties: {
              _slug: {
                pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
              },
            },
          },
        },
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
                  orgUrlKey: "orgurlkey",
                },
              } as any,
            },
          },
        },
      ],
    });

    // orgUrlKey can be undefined in Enterprise
    const options2 = {
      id: "id",
    } as any;
    const result2 = addDynamicSlugValidation(schema, options2);
    expect(result2).toEqual({
      properties: {
        _slug: {
          maxLength: 256 - ("slug".length + 1) - ("".length + 1),
        },
      },
      allOf: [
        {
          if: {
            properties: {
              _slug: {
                minLength: 1,
              },
            },
          },
          then: {
            properties: {
              _slug: {
                pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
              },
            },
          },
        },
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
                  orgUrlKey: "",
                },
              } as any,
            },
          },
        },
      ],
    });
  });
});
