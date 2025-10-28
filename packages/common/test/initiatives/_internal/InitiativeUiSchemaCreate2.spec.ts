import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
} from "vitest";

import { buildUiSchema } from "../../../src/initiatives/_internal/InitiativeUiSchemaCreate2";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";
import * as buildCatalogModule from "../../../src/core/schemas/internal/buildCatalogSetupUiSchemaElement";

describe("buildUiSchema: initiative create", () => {
  const mockCatalogSetupElements = [
    { scope: "/properties/_catalogSetup", type: "Control", options: {} },
  ];
  beforeEach(() => {
    vi.spyOn(
      buildCatalogModule,
      "buildCatalogSetupUiSchemaElement"
    ).mockReturnValue(mockCatalogSetupElements);
  });
  it("returns the full initiative create uiSchema", async () => {
    const uiSchema = await buildUiSchema("some.scope", {} as any, MOCK_CONTEXT);
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          labelKey: `some.scope.fields.name.label`,
          scope: "/properties/name",
          type: "Control",
          options: {
            messages: [
              {
                type: "ERROR",
                keyword: "required",
                icon: true,
                labelKey: `some.scope.fields.name.requiredError`,
              },
              {
                type: "ERROR",
                keyword: "maxLength",
                icon: true,
                labelKey: `some.scope.fields.name.maxLengthError`,
              },
              {
                type: "ERROR",
                keyword: "format",
                icon: true,
                labelKey: `some.scope.fields.name.entityTitleValidatorError`,
              },
            ],
          },
        },
        ...mockCatalogSetupElements,
      ],
    });
  });
});
