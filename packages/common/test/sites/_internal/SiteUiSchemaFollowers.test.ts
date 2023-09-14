import { buildUiSchema } from "../../../src/sites/_internal/SiteUiSchemaFollowers";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";
import * as getLocationExtentModule from "../../../src/core/schemas/internal/getLocationExtent";
import * as getLocationOptionsModule from "../../../src/core/schemas/internal/getLocationOptions";
import * as getSharableGroupsComboBoxItemsModule from "../../../src/core/schemas/internal/getSharableGroupsComboBoxItems";
import * as checkPermissionModule from "../../../src/permissions/checkPermission";

describe("buildUiSchema: site followers", () => {
  it("returns the full site followers uiSchema", async () => {
    spyOn(getLocationExtentModule, "getLocationExtent").and.returnValue(
      Promise.resolve([])
    );
    spyOn(getLocationOptionsModule, "getLocationOptions").and.returnValue(
      Promise.resolve([])
    );
    spyOn(
      getSharableGroupsComboBoxItemsModule,
      "getSharableGroupsComboBoxItems"
    ).and.returnValue([]);
    spyOn(checkPermissionModule, "checkPermission").and.returnValue(false);

    const uiSchema = await buildUiSchema("some.scope", {} as any, MOCK_CONTEXT);
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          elements: [
            {
              labelKey: "some.scope.fields.followers.groupAccess.label",
              scope: "/properties/_followers/properties/groupAccess",
              type: "Control",
              options: {
                control: "hub-field-input-tile-select",
                layout: "horizontal",
                helperText: {
                  labelKey:
                    "some.scope.fields.followers.groupAccess.helperText",
                },
                labels: [
                  "{{some.scope.fields.followers.groupAccess.private.label:translate}}",
                  "{{some.scope.fields.followers.groupAccess.org.label:translate}}",
                  "{{some.scope.fields.followers.groupAccess.public.label:translate}}",
                ],
                descriptions: [
                  "{{some.scope.fields.followers.groupAccess.private.description:translate}}",
                  "{{some.scope.fields.followers.groupAccess.org.description:translate}}",
                  "{{some.scope.fields.followers.groupAccess.public.description:translate}}",
                ],
                icons: ["users", "organization", "globe"],
                styles: { "max-width": "45rem" },
              },
            },
            {
              labelKey: "some.scope.fields.followers.showFollowAction.label",
              scope: "/properties/_followers/properties/showFollowAction",
              type: "Control",
              options: {
                control: "hub-field-input-switch",
                layout: "inline-space-between",
                helperText: {
                  labelKey:
                    "some.scope.fields.followers.showFollowAction.helperText",
                },
              },
            },
          ],
        },
      ],
    });
  });
});
