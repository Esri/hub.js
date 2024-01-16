import { filterSchemaToUiSchema } from "../../../../src/core/schemas/internal/filterSchemaToUiSchema";
import {
  IConfigurationSchema,
  IUiSchema,
} from "../../../../src/core/schemas/types";

describe("filterSchemaToUiSchema util:", () => {
  it("returns schema limited to props in UiSchema", () => {
    const schema: IConfigurationSchema = {
      required: ["name"],
      type: "object",
      properties: {
        name: {
          type: "string",
          minLength: 1,
          maxLength: 250,
        },
        summary: {
          type: "string",
        },
        description: {
          type: "string",
        },
      },
    };

    const SteppedUiSchema: IUiSchema = {
      type: "Layout",
      elements: [
        {
          type: "Section",
          labelKey: "section1.label.key",
          options: {
            section: "stepper",
            open: true,
          },
          elements: [
            {
              type: "Step",
              labelKey: "step1.label.key",
              elements: [
                {
                  labelKey: "property1.label.key",
                  scope: "/properties/name",
                  type: "Control",
                },
                {
                  labelKey: "property2.label.key",
                  scope: "/properties/summary",
                  type: "Control",
                },
              ],
            },
          ],
        },
      ],
    };
    const chk = filterSchemaToUiSchema(schema, SteppedUiSchema);
    expect(chk.properties?.description).not.toBeDefined();
  });

  it("returns schema limited to props in UiSchema when there is a conditional that does not apply", () => {
    const schema: IConfigurationSchema = {
      required: ["title"],
      properties: {
        status: {
          type: "string",
        },
        groups: {
          type: "array",
        },
        title: {
          type: "string",
        },
        _metric: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: ["static", "dynamic"],
            },
            value: {
              type: "string",
            },
          },
        },
      },
      allOf: [
        {
          if: {
            properties: {
              _metric: {
                properties: {
                  type: {
                    const: "static",
                  },
                },
              },
            },
          },
          then: {
            properties: {
              _metric: {
                required: ["value"],
              },
            },
          },
        },
      ],
    };

    const uiSchema: IUiSchema = {
      type: "Layout",
      elements: [
        {
          type: "Control",
          scope: "/properties/title",
          labelKey: "title",
        },
        {
          type: "Control",
          scope: "/properties/status",
          labelKey: "status",
        },
        {
          type: "Control",
          scope: "/properties/groups",
          labelKey: "groups",
        },
      ],
    };

    const chk = filterSchemaToUiSchema(schema, uiSchema);
    expect(chk).toEqual({
      required: ["title"],
      properties: {
        status: {
          type: "string",
        },
        groups: {
          type: "array",
        },
        title: {
          type: "string",
        },
      },
      allOf: [
        {
          if: { properties: {} },
          then: { properties: {} },
        },
      ],
    });
    expect(chk.properties?._metric).not.toBeDefined();
  });
});
