import { addConditionalSlugValidation } from "../../../../src/core/schemas/internal/addConditionalSlugValidation";

describe("addConditionalSlugValidation", () => {
  it("returns the schema if no slug is present on properties", () => {
    const schema = {
      properties: {},
    };
    const options = {};
    const result = addConditionalSlugValidation(schema, options);
    expect(result).toBe(schema);
  });
  it("returns the schema if no properties", () => {
    const schema = {};
    const options = {};
    const result = addConditionalSlugValidation(schema, options);
    expect(result).toBe(schema);
  });
  it("adds the conditional validation", () => {
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
    const result = addConditionalSlugValidation(schema, options);
    expect(result).toEqual({
      properties: {
        _slug: {
          pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
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
