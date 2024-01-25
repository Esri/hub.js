import { CardEditorOptions } from "../../../../../src/core/schemas/internal/EditorOptions";
import { buildUiSchema } from "../../../../../src/core/schemas/internal/follow/FollowCardUiSchema";
import { MOCK_CONTEXT } from "../../../../mocks/mock-auth";

describe("buildUiSchema: follow", () => {
  it("returns the full follow card uiSchema", async () => {
    const uiSchema = buildUiSchema("", {} as CardEditorOptions, MOCK_CONTEXT);

    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          label: "Select Entity to Follow",
          scope: "/properties/followedItemId",
          type: "Control",
          options: {
            control: "hub-field-input-gallery-picker",
            targetEntity: "item",
            catalogs: [
              {
                schemaVersion: 1,
                title: "Esri",
                scopes: {
                  item: {
                    targetEntity: "item",
                    filters: [
                      {
                        predicates: [
                          {
                            type: "Hub Project",
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            ],
            facets: [
              {
                label: "Access",
                key: "access",
                display: "multi-select",
                operation: "OR",
                options: [
                  {
                    label: "Public",
                    key: "public",
                    selected: false,
                    predicates: [
                      {
                        access: "public",
                      },
                    ],
                  },
                  {
                    label: "Shared",
                    key: "shared",
                    selected: false,
                    predicates: [
                      {
                        access: "shared",
                      },
                    ],
                  },
                  {
                    label: "Org",
                    key: "org",
                    selected: false,
                    predicates: [
                      {
                        access: "org",
                      },
                    ],
                  },
                  {
                    label: "Mine",
                    key: "mine",
                    selected: false,
                    predicates: [
                      {
                        owner: "paige_pa",
                      },
                    ],
                  },
                ],
              },
              {
                label: "Types",
                key: "types",
                display: "multi-select",
                pageSize: 4,
                operation: "OR",
                options: [
                  {
                    label: "Web Maps",
                    key: "webmaps",
                    selected: false,
                    predicates: [
                      {
                        type: "Web Map",
                      },
                    ],
                  },
                  {
                    label: "Sites",
                    key: "sites",
                    selected: false,
                    predicates: [
                      {
                        type: "Hub Site Application",
                      },
                    ],
                  },
                  {
                    label: "Services",
                    key: "services",
                    selected: false,
                    predicates: [
                      {
                        type: ["Feature Service", "Map Service"],
                      },
                    ],
                  },
                  {
                    label: "Document",
                    key: "documents",
                    selected: false,
                    predicates: [
                      {
                        typekeywords: {
                          any: ["Document"],
                          not: ["MapAreaPackage", "SMX"],
                        },
                        type: {
                          any: [
                            "Image",
                            "Layout",
                            "Desktop Style",
                            "Project Template",
                            "Report Template",
                            "Pro Report",
                            "Statistical Data Collection",
                            "360 VR Experience",
                            "netCDF",
                            "PDF",
                            "CSV",
                            "Administrative Report",
                            "Raster function template",
                          ],
                          not: [
                            "Image Service",
                            "Explorer Document",
                            "Explorer Map",
                            "Globe Document",
                            "Scene Document",
                            "Code Attachment",
                            "Featured Items",
                            "Symbol Set",
                            "ColorSet",
                            "Windows Viewer Add In",
                            "Windows Viewer Configuration",
                            "Map Area",
                            "Indoors Map Configuration",
                          ],
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          label: "Call-to-Action",
          scope: "/properties/callToAction",
          type: "Control",
        },
        {
          label: "Alignment",
          scope: "/properties/callToActionAlignment",
          type: "Control",
          options: {
            control: "hub-field-input-alignment",
          },
        },
        {
          label: "Button State",
          scope: "/properties/followStateText",
          type: "Control",
          options: {
            control: "hub-field-input-input",
            type: "textarea",
          },
        },
        {
          scope: "/properties/unfollowStateText",
          type: "Control",
          options: {
            control: "hub-field-input-input",
            type: "textarea",
          },
        },
        {
          label: "Button Alignment",
          scope: "/properties/callToActionAlignment",
          type: "Control",
          options: {
            control: "hub-field-input-alignment",
          },
        },
        {
          label: "Button Style",
          scope: "/properties/buttonStyle",
          type: "Control",
          options: {
            control: "hub-field-input-select",
            labels: ["Solid Background", "Ounline"],
          },
        },
      ],
    });
  });
});
