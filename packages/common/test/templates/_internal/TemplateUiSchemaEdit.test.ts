import { UiSchemaRuleEffects } from "../../../src/core/schemas/types";
import { buildUiSchema } from "../../../src/templates/_internal/TemplateUiSchemaEdit";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";

describe("buildUiSchema: template edit", () => {
  it("returns the full template edit uiSchema", async () => {
    const uiSchema = await buildUiSchema(
      "some.scope",
      {
        thumbnail: "thumbnail/custom.png",
        thumbnailUrl: "https://some-thumbnail-url.com",
      } as any,
      MOCK_CONTEXT
    );
    expect(uiSchema).toEqual({
      type: "Layout",
      elements: [
        {
          type: "Section",
          labelKey: "some.scope.sections.basicInfo.label",
          options: {
            helperText: {
              labelKey: "some.scope.sections.basicInfo.helperText",
            },
          },
          elements: [
            {
              type: "Control",
              scope: "/properties/name",
              labelKey: "some.scope.fields.name.label",
              options: {
                messages: [
                  {
                    type: "ERROR",
                    keyword: "required",
                    icon: true,
                    labelKey: "some.scope.fields.name.requiredError",
                  },
                  {
                    type: "ERROR",
                    keyword: "maxLength",
                    icon: true,
                    labelKey: "some.scope.fields.name.maxLengthError",
                  },
                  {
                    type: "ERROR",
                    keyword: "format",
                    icon: true,
                    labelKey:
                      "some.scope.fields.name.entityTitleValidatorError",
                  },
                ],
              },
            },
            {
              labelKey: "some.scope.fields.slug.label",
              scope: "/properties/_slug",
              type: "Control",
              options: {
                control: "hub-field-input-input",
                messages: [
                  {
                    type: "ERROR",
                    keyword: "pattern",
                    icon: true,
                    labelKey: "some.scope.fields.slug.patternError",
                  },
                  {
                    type: "ERROR",
                    keyword: "isUniqueSlug",
                    icon: true,
                    labelKey: "some.scope.fields.slug.isUniqueError",
                  },
                ],
              },
            },
            {
              type: "Control",
              scope: "/properties/summary",
              labelKey: "some.scope.fields.summary.label",
              options: {
                control: "hub-field-input-input",
                type: "textarea",
                rows: 4,
                messages: [
                  {
                    type: "ERROR",
                    keyword: "maxLength",
                    icon: true,
                    labelKey: "shared.fields.summary.maxLengthError",
                  },
                ],
              },
            },
            {
              labelKey: "shared.fields._thumbnail.label",
              scope: "/properties/_thumbnail",
              type: "Control",
              options: {
                control: "hub-field-input-image-picker",
                imgSrc: "https://some-thumbnail-url.com",
                defaultImgUrl:
                  "https://www.customUrl/apps/sites/ember-arcgis-opendata-components/assets/images/placeholders/content.png",
                maxWidth: 727,
                maxHeight: 484,
                aspectRatio: 1.5,
                sizeDescription: {
                  labelKey: "shared.fields._thumbnail.sizeDescription",
                },
              },
            },
            {
              type: "Section",
              labelKey: "some.scope.sections.description.label",
              options: {
                section: "block",
              },
              elements: [
                {
                  labelKey: "some.scope.fields.description.label",
                  scope: "/properties/description",
                  type: "Control",
                  options: {
                    control: "hub-field-input-rich-text",
                    type: "textarea",
                  },
                },
              ],
            },
            {
              type: "Section",
              labelKey: "some.scope.sections.discoverability.label",
              options: {
                section: "block",
                helperText: {
                  labelKey: "some.scope.sections.discoverability.helperText",
                },
              },
              elements: [
                {
                  labelKey: "some.scope.fields.tags.label",
                  scope: "/properties/tags",
                  type: "Control",
                  options: {
                    control: "hub-field-input-combobox",
                    items: [],
                    allowCustomValues: true,
                    selectionMode: "multiple",
                    placeholderIcon: "label",
                  },
                },
                {
                  labelKey: "shared.fields.categories.label",
                  scope: "/properties/categories",
                  type: "Control",
                  options: {
                    control: "hub-field-input-combobox",
                    items: [],
                    allowCustomValues: false,
                    selectionMode: "ancestors",
                    placeholderIcon: "select-category",
                  },
                  rules: [
                    {
                      effect: UiSchemaRuleEffects.DISABLE,
                      conditions: [true],
                    },
                  ],
                },
                {
                  type: "Notice",
                  options: {
                    notice: {
                      configuration: {
                        id: "no-categories-notice",
                        noticeType: "notice",
                        closable: false,
                        icon: "exclamation-mark-triangle",
                        kind: "warning",
                        scale: "m",
                      },
                      message:
                        "{{shared.fields.categories.noCategoriesNotice.body:translate}}",
                      autoShow: true,
                      actions: [
                        {
                          label:
                            "{{shared.fields.categories.noCategoriesNotice.link:translate}}",
                          icon: "launch",
                          href: "https://doc.arcgis.com/en/arcgis-online/reference/content-categories.htm",
                          target: "_blank",
                        },
                      ],
                    },
                  },
                  rules: [
                    {
                      effect: UiSchemaRuleEffects.SHOW,
                      conditions: [true],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "Section",
          labelKey: "some.scope.sections.templateDetails.label",
          elements: [
            {
              type: "Control",
              scope: "/properties/previewUrl",
              labelKey: "some.scope.fields.previewUrl.label",
              options: {
                helperText: {
                  labelKey: "some.scope.fields.previewUrl.helperText",
                },
                messages: [
                  {
                    type: "ERROR",
                    keyword: "format",
                    icon: true,
                    labelKey: "shared.errors.urlFormat",
                  },
                  {
                    type: "ERROR",
                    keyword: "if",
                    hidden: true,
                  },
                ],
              },
            },
          ],
        },
        {
          type: "Section",
          labelKey: "shared.sections.heroBanner.label",
          elements: [
            {
              type: "Section",
              labelKey: "shared.sections.heroActions.label",
              options: {
                section: "block",
                helperText: {
                  labelKey: "shared.sections.heroActions.helperText",
                },
              },
              elements: [
                {
                  scope: "/properties/view/properties/heroActions",
                  type: "Control",
                  options: {
                    control: "hub-composite-input-action-links",
                    type: "button",
                    catalogs: [
                      {
                        schemaVersion: 1,
                        title:
                          "{{shared.fields.featuredContent.catalog.myContent:translate}}",
                        scopes: {
                          item: {
                            targetEntity: "item",
                            filters: [
                              {
                                predicates: [
                                  {
                                    owner: "mock_user",
                                  },
                                ],
                              },
                            ],
                          },
                        },
                        collections: [
                          {
                            key: "appAndMap",
                            label:
                              "{{shared.fields.featuredContent.collection.appsAndMaps:translate}}",
                            targetEntity: "item",
                            include: [],
                            scope: {
                              targetEntity: "item",
                              filters: [
                                {
                                  predicates: [
                                    {
                                      type: [
                                        "Application",
                                        "City Engine Web Scene",
                                        "CityEngine Web Scene",
                                        "Dashboard",
                                        "Insights Page",
                                        "Insights Workbook",
                                        "Operation View",
                                        "Web Mapping Application",
                                        "StoryMap",
                                        "Web Experience",
                                        "Urban Model",
                                        "Image Collection",
                                        "Map Service Layer",
                                        "Map Service",
                                        "Scene Service",
                                        "Scene Layer",
                                        "Vector Tile Service",
                                        "Web Map Service",
                                        "Web Map Tile Service",
                                        "Web Map",
                                        "Web Scene",
                                        "WFS",
                                        "WMS",
                                        "WMTS",
                                        "Raster Layer",
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                          {
                            key: "dataset",
                            label:
                              "{{shared.fields.featuredContent.collection.dataset:translate}}",
                            targetEntity: "item",
                            include: [],
                            scope: {
                              targetEntity: "item",
                              filters: [
                                {
                                  predicates: [
                                    {
                                      type: [
                                        "CSV Collection",
                                        "CSV",
                                        "Feature Collection",
                                        "Feature Layer",
                                        "Feature Service",
                                        "File Geodatabase",
                                        "GeoJSON",
                                        "GeoJson",
                                        "KML Collection",
                                        "KML",
                                        "Shapefile",
                                        "Stream Service",
                                        "Table",
                                        "Image Service",
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                          {
                            key: "document",
                            label:
                              "{{shared.fields.featuredContent.collection.documents:translate}}",
                            targetEntity: "item",
                            include: [],
                            scope: {
                              targetEntity: "item",
                              filters: [
                                {
                                  predicates: [
                                    {
                                      type: [
                                        "Document Link",
                                        "Hub Page",
                                        "Site Page",
                                        "Image",
                                        "iWork Keynote",
                                        "iWork Numbers",
                                        "iWork Pages",
                                        "Microsoft Powerpoint",
                                        "Microsoft Visio",
                                        "Microsoft Word",
                                        "Notebook",
                                        "PDF",
                                        "Pro Map",
                                        "Microsoft Excel",
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                          {
                            key: "feedback",
                            label:
                              "{{shared.fields.featuredContent.collection.feedback:translate}}",
                            targetEntity: "item",
                            include: [],
                            scope: {
                              targetEntity: "item",
                              filters: [
                                {
                                  predicates: [
                                    {
                                      type: ["Form", "Quick Capture Project"],
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                          {
                            key: "site",
                            label:
                              "{{shared.fields.featuredContent.collection.sites:translate}}",
                            targetEntity: "item",
                            include: [],
                            scope: {
                              targetEntity: "item",
                              filters: [
                                {
                                  predicates: [
                                    {
                                      type: [
                                        "Hub Site Application",
                                        "Site Application",
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                          {
                            key: "project",
                            label:
                              "{{shared.fields.featuredContent.collection.projects:translate}}",
                            targetEntity: "item",
                            include: [],
                            scope: {
                              targetEntity: "item",
                              filters: [
                                {
                                  predicates: [
                                    {
                                      type: ["Hub Project"],
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                        ],
                      },
                      {
                        schemaVersion: 1,
                        title:
                          "{{shared.fields.featuredContent.catalog.favorites:translate}}",
                        scopes: {
                          item: {
                            targetEntity: "item",
                            filters: [
                              {
                                predicates: [
                                  {
                                    group: "456abc",
                                  },
                                ],
                              },
                            ],
                          },
                        },
                        collections: [
                          {
                            key: "appAndMap",
                            label:
                              "{{shared.fields.featuredContent.collection.appsAndMaps:translate}}",
                            targetEntity: "item",
                            include: [],
                            scope: {
                              targetEntity: "item",
                              filters: [
                                {
                                  predicates: [
                                    {
                                      type: [
                                        "Application",
                                        "City Engine Web Scene",
                                        "CityEngine Web Scene",
                                        "Dashboard",
                                        "Insights Page",
                                        "Insights Workbook",
                                        "Operation View",
                                        "Web Mapping Application",
                                        "StoryMap",
                                        "Web Experience",
                                        "Urban Model",
                                        "Image Collection",
                                        "Map Service Layer",
                                        "Map Service",
                                        "Scene Service",
                                        "Scene Layer",
                                        "Vector Tile Service",
                                        "Web Map Service",
                                        "Web Map Tile Service",
                                        "Web Map",
                                        "Web Scene",
                                        "WFS",
                                        "WMS",
                                        "WMTS",
                                        "Raster Layer",
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                          {
                            key: "dataset",
                            label:
                              "{{shared.fields.featuredContent.collection.dataset:translate}}",
                            targetEntity: "item",
                            include: [],
                            scope: {
                              targetEntity: "item",
                              filters: [
                                {
                                  predicates: [
                                    {
                                      type: [
                                        "CSV Collection",
                                        "CSV",
                                        "Feature Collection",
                                        "Feature Layer",
                                        "Feature Service",
                                        "File Geodatabase",
                                        "GeoJSON",
                                        "GeoJson",
                                        "KML Collection",
                                        "KML",
                                        "Shapefile",
                                        "Stream Service",
                                        "Table",
                                        "Image Service",
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                          {
                            key: "document",
                            label:
                              "{{shared.fields.featuredContent.collection.documents:translate}}",
                            targetEntity: "item",
                            include: [],
                            scope: {
                              targetEntity: "item",
                              filters: [
                                {
                                  predicates: [
                                    {
                                      type: [
                                        "Document Link",
                                        "Hub Page",
                                        "Site Page",
                                        "Image",
                                        "iWork Keynote",
                                        "iWork Numbers",
                                        "iWork Pages",
                                        "Microsoft Powerpoint",
                                        "Microsoft Visio",
                                        "Microsoft Word",
                                        "Notebook",
                                        "PDF",
                                        "Pro Map",
                                        "Microsoft Excel",
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                          {
                            key: "feedback",
                            label:
                              "{{shared.fields.featuredContent.collection.feedback:translate}}",
                            targetEntity: "item",
                            include: [],
                            scope: {
                              targetEntity: "item",
                              filters: [
                                {
                                  predicates: [
                                    {
                                      type: ["Form", "Quick Capture Project"],
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                          {
                            key: "site",
                            label:
                              "{{shared.fields.featuredContent.collection.sites:translate}}",
                            targetEntity: "item",
                            include: [],
                            scope: {
                              targetEntity: "item",
                              filters: [
                                {
                                  predicates: [
                                    {
                                      type: [
                                        "Hub Site Application",
                                        "Site Application",
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                          {
                            key: "project",
                            label:
                              "{{shared.fields.featuredContent.collection.projects:translate}}",
                            targetEntity: "item",
                            include: [],
                            scope: {
                              targetEntity: "item",
                              filters: [
                                {
                                  predicates: [
                                    {
                                      type: ["Hub Project"],
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                        ],
                      },
                      {
                        schemaVersion: 1,
                        title:
                          "{{shared.fields.featuredContent.catalog.organization:translate}}",
                        scopes: {
                          item: {
                            targetEntity: "item",
                            filters: [
                              {
                                predicates: [
                                  {
                                    orgid: "789def",
                                  },
                                ],
                              },
                            ],
                          },
                        },
                        collections: [
                          {
                            key: "appAndMap",
                            label:
                              "{{shared.fields.featuredContent.collection.appsAndMaps:translate}}",
                            targetEntity: "item",
                            include: [],
                            scope: {
                              targetEntity: "item",
                              filters: [
                                {
                                  predicates: [
                                    {
                                      type: [
                                        "Application",
                                        "City Engine Web Scene",
                                        "CityEngine Web Scene",
                                        "Dashboard",
                                        "Insights Page",
                                        "Insights Workbook",
                                        "Operation View",
                                        "Web Mapping Application",
                                        "StoryMap",
                                        "Web Experience",
                                        "Urban Model",
                                        "Image Collection",
                                        "Map Service Layer",
                                        "Map Service",
                                        "Scene Service",
                                        "Scene Layer",
                                        "Vector Tile Service",
                                        "Web Map Service",
                                        "Web Map Tile Service",
                                        "Web Map",
                                        "Web Scene",
                                        "WFS",
                                        "WMS",
                                        "WMTS",
                                        "Raster Layer",
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                          {
                            key: "dataset",
                            label:
                              "{{shared.fields.featuredContent.collection.dataset:translate}}",
                            targetEntity: "item",
                            include: [],
                            scope: {
                              targetEntity: "item",
                              filters: [
                                {
                                  predicates: [
                                    {
                                      type: [
                                        "CSV Collection",
                                        "CSV",
                                        "Feature Collection",
                                        "Feature Layer",
                                        "Feature Service",
                                        "File Geodatabase",
                                        "GeoJSON",
                                        "GeoJson",
                                        "KML Collection",
                                        "KML",
                                        "Shapefile",
                                        "Stream Service",
                                        "Table",
                                        "Image Service",
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                          {
                            key: "document",
                            label:
                              "{{shared.fields.featuredContent.collection.documents:translate}}",
                            targetEntity: "item",
                            include: [],
                            scope: {
                              targetEntity: "item",
                              filters: [
                                {
                                  predicates: [
                                    {
                                      type: [
                                        "Document Link",
                                        "Hub Page",
                                        "Site Page",
                                        "Image",
                                        "iWork Keynote",
                                        "iWork Numbers",
                                        "iWork Pages",
                                        "Microsoft Powerpoint",
                                        "Microsoft Visio",
                                        "Microsoft Word",
                                        "Notebook",
                                        "PDF",
                                        "Pro Map",
                                        "Microsoft Excel",
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                          {
                            key: "feedback",
                            label:
                              "{{shared.fields.featuredContent.collection.feedback:translate}}",
                            targetEntity: "item",
                            include: [],
                            scope: {
                              targetEntity: "item",
                              filters: [
                                {
                                  predicates: [
                                    {
                                      type: ["Form", "Quick Capture Project"],
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                          {
                            key: "site",
                            label:
                              "{{shared.fields.featuredContent.collection.sites:translate}}",
                            targetEntity: "item",
                            include: [],
                            scope: {
                              targetEntity: "item",
                              filters: [
                                {
                                  predicates: [
                                    {
                                      type: [
                                        "Hub Site Application",
                                        "Site Application",
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                          {
                            key: "project",
                            label:
                              "{{shared.fields.featuredContent.collection.projects:translate}}",
                            targetEntity: "item",
                            include: [],
                            scope: {
                              targetEntity: "item",
                              filters: [
                                {
                                  predicates: [
                                    {
                                      type: ["Hub Project"],
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                        ],
                      },
                      {
                        schemaVersion: 1,
                        title:
                          "{{shared.fields.featuredContent.catalog.world:translate}}",
                        scopes: {
                          item: {
                            targetEntity: "item",
                            filters: [
                              {
                                predicates: [
                                  {
                                    type: {
                                      not: ["code attachment"],
                                    },
                                  },
                                ],
                              },
                            ],
                          },
                        },
                        collections: [
                          {
                            key: "appAndMap",
                            label:
                              "{{shared.fields.featuredContent.collection.appsAndMaps:translate}}",
                            targetEntity: "item",
                            include: [],
                            scope: {
                              targetEntity: "item",
                              filters: [
                                {
                                  predicates: [
                                    {
                                      type: [
                                        "Application",
                                        "City Engine Web Scene",
                                        "CityEngine Web Scene",
                                        "Dashboard",
                                        "Insights Page",
                                        "Insights Workbook",
                                        "Operation View",
                                        "Web Mapping Application",
                                        "StoryMap",
                                        "Web Experience",
                                        "Urban Model",
                                        "Image Collection",
                                        "Map Service Layer",
                                        "Map Service",
                                        "Scene Service",
                                        "Scene Layer",
                                        "Vector Tile Service",
                                        "Web Map Service",
                                        "Web Map Tile Service",
                                        "Web Map",
                                        "Web Scene",
                                        "WFS",
                                        "WMS",
                                        "WMTS",
                                        "Raster Layer",
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                          {
                            key: "dataset",
                            label:
                              "{{shared.fields.featuredContent.collection.dataset:translate}}",
                            targetEntity: "item",
                            include: [],
                            scope: {
                              targetEntity: "item",
                              filters: [
                                {
                                  predicates: [
                                    {
                                      type: [
                                        "CSV Collection",
                                        "CSV",
                                        "Feature Collection",
                                        "Feature Layer",
                                        "Feature Service",
                                        "File Geodatabase",
                                        "GeoJSON",
                                        "GeoJson",
                                        "KML Collection",
                                        "KML",
                                        "Shapefile",
                                        "Stream Service",
                                        "Table",
                                        "Image Service",
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                          {
                            key: "document",
                            label:
                              "{{shared.fields.featuredContent.collection.documents:translate}}",
                            targetEntity: "item",
                            include: [],
                            scope: {
                              targetEntity: "item",
                              filters: [
                                {
                                  predicates: [
                                    {
                                      type: [
                                        "Document Link",
                                        "Hub Page",
                                        "Site Page",
                                        "Image",
                                        "iWork Keynote",
                                        "iWork Numbers",
                                        "iWork Pages",
                                        "Microsoft Powerpoint",
                                        "Microsoft Visio",
                                        "Microsoft Word",
                                        "Notebook",
                                        "PDF",
                                        "Pro Map",
                                        "Microsoft Excel",
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                          {
                            key: "feedback",
                            label:
                              "{{shared.fields.featuredContent.collection.feedback:translate}}",
                            targetEntity: "item",
                            include: [],
                            scope: {
                              targetEntity: "item",
                              filters: [
                                {
                                  predicates: [
                                    {
                                      type: ["Form", "Quick Capture Project"],
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                          {
                            key: "site",
                            label:
                              "{{shared.fields.featuredContent.collection.sites:translate}}",
                            targetEntity: "item",
                            include: [],
                            scope: {
                              targetEntity: "item",
                              filters: [
                                {
                                  predicates: [
                                    {
                                      type: [
                                        "Hub Site Application",
                                        "Site Application",
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                          {
                            key: "project",
                            label:
                              "{{shared.fields.featuredContent.collection.projects:translate}}",
                            targetEntity: "item",
                            include: [],
                            scope: {
                              targetEntity: "item",
                              filters: [
                                {
                                  predicates: [
                                    {
                                      type: ["Hub Project"],
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                        ],
                      },
                    ],
                    facets: [
                      {
                        label: "shared.fields.callToAction.facets.type",
                        key: "type",
                        display: "multi-select",
                        field: "type",
                        options: [],
                        operation: "OR",
                        aggLimit: 100,
                      },
                      {
                        label: "shared.fields.callToAction.facets.sharing",
                        key: "access",
                        display: "multi-select",
                        field: "access",
                        options: [],
                        operation: "OR",
                      },
                    ],
                    showAllCollectionFacet: true,
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
