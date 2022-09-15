import { applyUiSchemaElementOptions } from "../../../../src/core/schemas/internal/applyUiSchemaElementOptions";
import {
  IUiSchema,
  UiSchemaElementOptions,
  UiSchemaRuleEffects,
} from "../../../../src/core/schemas/types";
import { deepFind, getProp } from "../../../../src/objects";
import { cloneObject } from "../../../../src/util";

describe("applySchemaElementOptions util:", () => {
  it("returns a clone with out changes if no options passed", () => {
    const cloneSchema = cloneObject(SteppedUiSchema);
    expect(applyUiSchemaElementOptions(cloneSchema)).toEqual(cloneSchema);
  });
  it("works if element not found", () => {
    const opts: UiSchemaElementOptions[] = [
      {
        scope: "/properties/doesnotexist",
        options: {
          color: "red",
          parent: "3ef",
          deep: {
            object: "is deep",
          },
        },
      },
    ];
    const cloneSchema = cloneObject(SteppedUiSchema);
    const chk = applyUiSchemaElementOptions(cloneSchema, opts);
    expect(chk).toEqual(cloneSchema);
  });
  it("injects configuration into deep schema", () => {
    const opts: UiSchemaElementOptions[] = [
      {
        scope: "/properties/property2",
        options: {
          color: "red",
          parent: "3ef",
          deep: {
            object: "is deep",
          },
        },
      },
    ];
    const cloneSchema = cloneObject(SteppedUiSchema);
    const chk = applyUiSchemaElementOptions(cloneSchema, opts);
    // get the property2 element out of the deep graph
    const target = deepFind(chk, (entry) => {
      return entry.scope === "/properties/property2";
    });
    // verify that .options has been merged into the element
    expect(target.options).toEqual(opts[0].options);
  });
  it("injects configuration into deep schema, preserving other props", () => {
    const opts: UiSchemaElementOptions[] = [
      {
        scope: "/properties/property3",
        options: {
          color: "red",
          parent: "3ef",
          deep: {
            object: "is deep",
          },
        },
      },
    ];
    const cloneSchema = cloneObject(SteppedUiSchema);
    const chk = applyUiSchemaElementOptions(cloneSchema, opts);
    // get the property3 element out of the deep graph
    const target = deepFind(chk, (entry) => {
      return !entry.schema && entry.scope === opts[0].scope;
    });

    // verify that .options has been merged into the element
    expect(target.options).toEqual({
      ...{ existing: "prop" },
      ...opts[0].options,
    });
  });
});

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
          type: "Step",
          labelKey: "step2.label.key",
          elements: [
            {
              labelKey: "property3.label.key",
              scope: "/properties/property3",
              type: "Control",
              options: {
                existing: "prop",
              },
            },
            {
              labelKey: "property4.label.key",
              scope: "/properties/property4",
              type: "Control",
              rule: {
                effect: UiSchemaRuleEffects.DISABLE,
                condition: {
                  scope: "/properties/property3",
                  schema: { enum: ["hello"] },
                },
              },
            },
          ],
        },
      ],
    },
  ],
};
