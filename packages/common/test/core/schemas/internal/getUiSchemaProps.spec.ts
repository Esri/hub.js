import { getUiSchemaProps } from "../../../../src/core/schemas/internal/getUiSchemaProps";
import { IUiSchema } from "../../../../src/core/schemas/types";

describe("getUiSchemaProps util:", () => {
  it("returns unique prop names from a sectioned schema with deep props", () => {
    const chk = getUiSchemaProps(SectionedUiSchema);
    expect(chk).toEqual([
      "property1",
      "property2",
      "link", // there are two entries for link b/c it's an object
      "property3",
      "property4",
    ]);
  });
  it("returns prop names from accordion schema", () => {
    const chk = getUiSchemaProps(AccordionUiSchema);
    expect(chk).toEqual(["property1", "property2", "property3", "property4"]);
  });

  it("returns prop names from stepped schema", () => {
    const chk = getUiSchemaProps(SteppedUiSchema);
    expect(chk).toEqual(["property1", "property2", "property3", "property4"]);
  });
});

const SectionedUiSchema: IUiSchema = {
  type: "Layout",
  elements: [
    {
      type: "Section",
      options: { headerTag: "h4" },
      labelKey: "section1.label.key",
      elements: [
        {
          labelKey: "property1.label.key",
          scope: "/properties/property1",
          type: "Control",
        },
        {
          labelKey: "property2.label.key",
          scope: "/properties/property2",
          type: "Control",
        },
        {
          labelKey: "link.href",
          scope: "/properties/link/properties/href",
          type: "Control",
        },
        {
          labelKey: "link.title",
          scope: "/properties/link/properties/title",
          type: "Control",
        },
      ],
    },
    {
      type: "Section",
      labelKey: "section2.label.key",
      elements: [
        {
          labelKey: "property3.label.key",
          scope: "/properties/property3",
          type: "Control",
        },
        {
          labelKey: "property4.label.key",
          scope: "/properties/property4",
          type: "Control",
        },
      ],
    },
  ],
};

const AccordionUiSchema: IUiSchema = {
  type: "Layout",
  elements: [
    {
      type: "Section",
      labelKey: "section1.label.key",
      options: {
        section: "accordion",
        open: true,
      },
      elements: [
        {
          labelKey: "property1.label.key",
          scope: "/properties/property1",
          type: "Control",
        },
        {
          labelKey: "property2.label.key",
          scope: "/properties/property2",
          type: "Control",
        },
      ],
    },
    {
      type: "Section",
      labelKey: "section2.label.key",
      options: {
        section: "accordion",
      },
      elements: [
        {
          labelKey: "property3.label.key",
          scope: "/properties/property3",
          type: "Control",
        },
        {
          labelKey: "property4.label.key",
          scope: "/properties/property4",
          type: "Control",
        },
      ],
    },
  ],
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
          type: "Section",
          labelKey: "step1.label.key",
          options: {
            section: "step",
          },
          elements: [
            {
              labelKey: "property1.label.key",
              scope: "/properties/property1",
              type: "Control",
            },
            {
              labelKey: "property2.label.key",
              scope: "/properties/property2",
              type: "Control",
            },
          ],
        },
        {
          type: "Section",
          labelKey: "step2.label.key",
          options: {
            section: "step",
          },
          elements: [
            {
              labelKey: "property3.label.key",
              scope: "/properties/property3",
              type: "Control",
            },
            {
              labelKey: "property4.label.key",
              scope: "/properties/property4",
              type: "Control",
            },
          ],
        },
      ],
    },
  ],
};
