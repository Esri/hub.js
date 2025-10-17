import { buildUiSchema } from "../../../src/initiatives/_internal/InitiativeUiSchemaAssociations";
import {
  MOCK_CONTEXT,
  getMockContextWithPrivilenges,
} from "../../mocks/mock-auth";

describe("InitiativeUiSchemaAssociations", () => {
  it("creates the uiSchema without privileges", async () => {
    const uiSchema = await buildUiSchema("some.scope", {}, MOCK_CONTEXT);
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          elements: [
            {
              labelKey: `some.scope.fields.groupAccess.label`,
              scope: "/properties/_associations/properties/groupAccess",
              type: "Control",
              options: {
                control: "hub-field-input-tile-select",
                layout: "horizontal",
                helperText: {
                  labelKey: `some.scope.fields.groupAccess.helperText`,
                },
                labels: [
                  `{{some.scope.fields.groupAccess.private.label:translate}}`,
                  `{{some.scope.fields.groupAccess.org.label:translate}}`,
                  `{{some.scope.fields.groupAccess.public.label:translate}}`,
                ],
                descriptions: [
                  `{{some.scope.fields.groupAccess.private.description:translate}}`,
                  `{{some.scope.fields.groupAccess.org.description:translate}}`,
                  `{{some.scope.fields.groupAccess.public.description:translate}}`,
                ],
                icons: ["users", "organization", "globe"],
                styles: { "max-width": "45rem" },
              },
            },
            {
              labelKey: `some.scope.fields.membershipAccess.label`,
              scope: "/properties/_associations/properties/membershipAccess",
              type: "Control",
              options: {
                control: "hub-field-input-radio",
                labels: [
                  `{{some.scope.fields.membershipAccess.org:translate}}`,
                  `{{some.scope.fields.membershipAccess.collab:translate}}`,
                  `{{some.scope.fields.membershipAccess.any:translate}}`,
                ],
                disabled: [false, true, true],
              },
            },
          ],
        },
      ],
    });
  });

  it("creates the uiSchema with privileges", async () => {
    const uiSchema = await buildUiSchema(
      "some.scope",
      {},
      getMockContextWithPrivilenges(["portal:user:addExternalMembersToGroup"])
    );
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          elements: [
            {
              labelKey: `some.scope.fields.groupAccess.label`,
              scope: "/properties/_associations/properties/groupAccess",
              type: "Control",
              options: {
                control: "hub-field-input-tile-select",
                layout: "horizontal",
                helperText: {
                  labelKey: `some.scope.fields.groupAccess.helperText`,
                },
                labels: [
                  `{{some.scope.fields.groupAccess.private.label:translate}}`,
                  `{{some.scope.fields.groupAccess.org.label:translate}}`,
                  `{{some.scope.fields.groupAccess.public.label:translate}}`,
                ],
                descriptions: [
                  `{{some.scope.fields.groupAccess.private.description:translate}}`,
                  `{{some.scope.fields.groupAccess.org.description:translate}}`,
                  `{{some.scope.fields.groupAccess.public.description:translate}}`,
                ],
                icons: ["users", "organization", "globe"],
                styles: { "max-width": "45rem" },
              },
            },
            {
              labelKey: `some.scope.fields.membershipAccess.label`,
              scope: "/properties/_associations/properties/membershipAccess",
              type: "Control",
              options: {
                control: "hub-field-input-radio",
                labels: [
                  `{{some.scope.fields.membershipAccess.org:translate}}`,
                  `{{some.scope.fields.membershipAccess.collab:translate}}`,
                  `{{some.scope.fields.membershipAccess.any:translate}}`,
                ],
                disabled: [false, false, false],
              },
            },
          ],
        },
      ],
    });
  });
});
