import { buildUiSchema } from "../../../src/initiative-templates/_internal/InitiativeTemplateUiSchemaEdit";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";
import { UiSchemaMessageTypes } from "../../../src/core/schemas/types";

describe("buildUiSchema: initiative template edit", () => {
  it("returns the full initiative template edit uiSchema", async () => {
    const uiSchema = await buildUiSchema(
      "some.scope",
      { thumbnailUrl: "https://some-thumbnail-url.com" } as any,
      MOCK_CONTEXT
    );
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Control",
          scope: "/properties/name",
          labelKey: `some.scope.fields.name.label`,
          options: {
            messages: [
              {
                type: UiSchemaMessageTypes.error,
                keyword: "required",
                icon: true,
                labelKey: `some.scope.fields.name.requiredError`,
              },
            ],
          },
        },
        {
          type: "Control",
          scope: "/properties/previewUrl",
          labelKey: `some.scope.fields.previewUrl.label`,
          options: {
            helperText: {
              labelKey: "some.scope.fields.previewUrl.helperText",
            },
            messages: [
              {
                type: "ERROR",
                keyword: "if",
                hidden: true,
              },
            ],
          },
        },
        {
          type: "Control",
          scope: "/properties/summary",
          labelKey: `some.scope.fields.summary.label`,
          options: {
            control: "hub-field-input-input",
            type: "textarea",
          },
        },
        {
          type: "Control",
          scope: "/properties/description",
          labelKey: `some.scope.fields.description.label`,
          options: {
            control: "hub-field-input-input",
            type: "textarea",
          },
        },
        {
          type: "Control",
          scope: "/properties/_thumbnail",
          labelKey: `some.scope.fields._thumbnail.label`,
          options: {
            control: "hub-field-input-image-picker",
            imgSrc: "https://some-thumbnail-url.com",
            maxWidth: 727,
            maxHeight: 484,
            aspectRatio: 1.5,
            helperText: {
              labelKey: "some.scope.fields._thumbnail.helperText",
            },
            sizeDescription: {
              labelKey: "some.scope.fields._thumbnail.sizeDescription",
            },
          },
        },
        {
          type: "Control",
          scope: "/properties/recommendedTemplates",
          labelKey: `some.scope.fields.recommendedTemplates.label`,
          options: {
            control: "hub-field-input-gallery-picker",
            targetEntity: "item",
            catalogs: [
              {
                schemaVersion: 1,
                title:
                  "{{initiativeTemplate.fields.recommendedTemplates.catalog.myContent:translate}}",
                scopes: {
                  item: {
                    targetEntity: "item",
                    filters: [
                      {
                        predicates: [{ owner: "mock_user" }],
                      },
                    ],
                  },
                },
                collections: [
                  {
                    targetEntity: "item",
                    key: "recommendedTemplates",
                    label:
                      "some.scope.fields.recommendedTemplates.collection.label",
                    scope: {
                      targetEntity: "item",
                      filters: [
                        {
                          predicates: [
                            {
                              typekeywords: {
                                not: ["hubSolutionType|hubSiteApplication"],
                              },
                            },
                          ],
                        },
                        {
                          predicates: [
                            {
                              typekeywords: {
                                any: [
                                  "hubSolutionType|storymap",
                                  "hubSolutionType|webmap",
                                  "hubSolutionType|dashboard",
                                  "hubSolutionType|hubpage",
                                  "hubSolutionType|webexperience",
                                  "hubSolutionType|webmappingapplication",
                                  "hubSolutionType|form",
                                  "hubSolutionType|featureservice",
                                  "Template",
                                ],
                              },
                            },
                          ],
                          operation: "OR",
                        },
                        {
                          predicates: [
                            {
                              typekeywords: ["hubSolutionTemplate"],
                            },
                            {
                              type: "Solution",
                              typekeywords: ["Template"],
                            },
                          ],
                          operation: "OR",
                        },
                      ],
                    },
                  },
                ],
              },
              {
                schemaVersion: 1,
                title:
                  "{{initiativeTemplate.fields.recommendedTemplates.catalog.favorites:translate}}",
                scopes: {
                  item: {
                    targetEntity: "item",
                    filters: [
                      {
                        predicates: [{ group: "456abc" }],
                      },
                    ],
                  },
                },
                collections: [
                  {
                    targetEntity: "item",
                    key: "recommendedTemplates",
                    label:
                      "some.scope.fields.recommendedTemplates.collection.label",
                    scope: {
                      targetEntity: "item",
                      filters: [
                        {
                          predicates: [
                            {
                              typekeywords: {
                                not: ["hubSolutionType|hubSiteApplication"],
                              },
                            },
                          ],
                        },
                        {
                          predicates: [
                            {
                              typekeywords: {
                                any: [
                                  "hubSolutionType|storymap",
                                  "hubSolutionType|webmap",
                                  "hubSolutionType|dashboard",
                                  "hubSolutionType|hubpage",
                                  "hubSolutionType|webexperience",
                                  "hubSolutionType|webmappingapplication",
                                  "hubSolutionType|form",
                                  "hubSolutionType|featureservice",
                                  "Template",
                                ],
                              },
                            },
                          ],
                          operation: "OR",
                        },
                        {
                          predicates: [
                            {
                              typekeywords: ["hubSolutionTemplate"],
                            },
                            {
                              type: "Solution",
                              typekeywords: ["Template"],
                            },
                          ],
                          operation: "OR",
                        },
                      ],
                    },
                  },
                ],
              },
              {
                schemaVersion: 1,
                title:
                  "{{initiativeTemplate.fields.recommendedTemplates.catalog.organization:translate}}",
                scopes: {
                  item: {
                    targetEntity: "item",
                    filters: [
                      {
                        predicates: [{ orgid: "789def" }],
                      },
                    ],
                  },
                },
                collections: [
                  {
                    targetEntity: "item",
                    key: "recommendedTemplates",
                    label:
                      "some.scope.fields.recommendedTemplates.collection.label",
                    scope: {
                      targetEntity: "item",
                      filters: [
                        {
                          predicates: [
                            {
                              typekeywords: {
                                not: ["hubSolutionType|hubSiteApplication"],
                              },
                            },
                          ],
                        },
                        {
                          predicates: [
                            {
                              typekeywords: {
                                any: [
                                  "hubSolutionType|storymap",
                                  "hubSolutionType|webmap",
                                  "hubSolutionType|dashboard",
                                  "hubSolutionType|hubpage",
                                  "hubSolutionType|webexperience",
                                  "hubSolutionType|webmappingapplication",
                                  "hubSolutionType|form",
                                  "hubSolutionType|featureservice",
                                  "Template",
                                ],
                              },
                            },
                          ],
                          operation: "OR",
                        },
                        {
                          predicates: [
                            {
                              typekeywords: ["hubSolutionTemplate"],
                            },
                            {
                              type: "Solution",
                              typekeywords: ["Template"],
                            },
                          ],
                          operation: "OR",
                        },
                      ],
                    },
                  },
                ],
              },
              {
                schemaVersion: 1,
                title:
                  "{{initiativeTemplate.fields.recommendedTemplates.catalog.world:translate}}",
                scopes: {
                  item: {
                    targetEntity: "item",
                    filters: [
                      {
                        predicates: [{ type: { not: ["code attachment"] } }],
                      },
                    ],
                  },
                },
                collections: [
                  {
                    targetEntity: "item",
                    key: "recommendedTemplates",
                    label:
                      "some.scope.fields.recommendedTemplates.collection.label",
                    scope: {
                      targetEntity: "item",
                      filters: [
                        {
                          predicates: [
                            {
                              typekeywords: {
                                not: ["hubSolutionType|hubSiteApplication"],
                              },
                            },
                          ],
                        },
                        {
                          predicates: [
                            {
                              typekeywords: {
                                any: [
                                  "hubSolutionType|storymap",
                                  "hubSolutionType|webmap",
                                  "hubSolutionType|dashboard",
                                  "hubSolutionType|hubpage",
                                  "hubSolutionType|webexperience",
                                  "hubSolutionType|webmappingapplication",
                                  "hubSolutionType|form",
                                  "hubSolutionType|featureservice",
                                  "Template",
                                ],
                              },
                            },
                          ],
                          operation: "OR",
                        },
                        {
                          predicates: [
                            {
                              typekeywords: ["hubSolutionTemplate"],
                            },
                            {
                              type: "Solution",
                              typekeywords: ["Template"],
                            },
                          ],
                          operation: "OR",
                        },
                      ],
                    },
                  },
                ],
              },
            ],
            facets: [
              {
                label: `{{some.scope.fields.recommendedTemplates.facets.sharing:translate}}`,
                key: "access",
                field: "access",
                display: "multi-select",
                operation: "OR",
              },
            ],
            drag: false,
            linkTarget: "workspaceRelative",
          },
        },
      ],
    });
  });
});
