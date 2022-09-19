import { subsetSchema } from "../../../../src/core/schemas/internal/subsetSchema";
import {
  IConfigurationSchema,
  IUiSchema,
} from "../../../../src/core/schemas/types";

describe("subsetSchema util:", () => {
  it("returns schema limited to props passed in", () => {
    const chk = subsetSchema(schema, ["name", "summary"]);
    expect(chk.properties?.description).not.toBeDefined();
  });
});

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
