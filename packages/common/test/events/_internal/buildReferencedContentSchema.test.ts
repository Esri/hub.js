import { IArcGISContext } from "../../../src/ArcGISContext";
import { IUiSchemaElement } from "../../../src/core/schemas/types";
import { buildReferencedContentSchema } from "../../../src/events/_internal/buildReferencedContentSchema";
import * as wellKnownCatalogModule from "../../../src/search/wellKnownCatalog";

describe("buildReferencedContentSchema", () => {
  const catalog = { catalog: true };
  const i18nScope = "myI18nScope";
  const context = {
    currentUser: {
      username: "user1",
      orgId: "org1",
    },
  } as unknown as IArcGISContext;

  let getWellKnownCatalogSpy: jasmine.Spy;

  beforeEach(() => {
    getWellKnownCatalogSpy = spyOn(
      wellKnownCatalogModule,
      "getWellKnownCatalog"
    ).and.returnValue(catalog);
  });

  it("should return the schema element for referenced content without a label", () => {
    const result = buildReferencedContentSchema(i18nScope, context);
    expect(getWellKnownCatalogSpy).toHaveBeenCalledTimes(1);
    expect(getWellKnownCatalogSpy).toHaveBeenCalledWith(
      `${i18nScope}.fields.referencedContent`,
      "organization",
      "item",
      {
        user: context.currentUser,
        collectionNames: ["site", "initiative", "project"],
        filters: [],
        context,
      }
    );
    expect(result).toEqual({
      scope: "/properties/referencedContentIds",
      type: "Control",
      label: undefined,
      options: {
        control: "hub-field-input-gallery-picker",
        helperText: {
          labelKey: "myI18nScope.fields.referencedContent.helperText.label",
        },
        targetEntity: "item",
        catalogs: [{ catalog: true }],
        facets: [
          {
            label:
              "{{myI18nScope.fields.referencedContent.facets.from.label:translate}}",
            key: "from",
            display: "single-select",
            operation: "OR",
            options: [
              {
                label:
                  "{{myI18nScope.fields.referencedContent.facets.from.myContent.label:translate}}",
                key: "myContent",
                selected: true,
                predicates: [{ owner: "user1" }],
              },
              {
                label:
                  "{{myI18nScope.fields.referencedContent.facets.from.myOrganization.label:translate}}",
                key: "myOrganization",
                selected: false,
                predicates: [{ orgId: "org1" }],
              },
            ],
          },
          {
            label:
              "{{myI18nScope.fields.referencedContent.facets.access.label:translate}}",
            key: "access",
            field: "access",
            display: "multi-select",
            operation: "OR",
          },
        ],
      },
    });
  });

  it("should return the schema element for referenced content with the provided label", () => {
    const result = buildReferencedContentSchema(
      i18nScope,
      context,
      "some.label"
    );
    expect(getWellKnownCatalogSpy).toHaveBeenCalledTimes(1);
    expect(getWellKnownCatalogSpy).toHaveBeenCalledWith(
      `${i18nScope}.fields.referencedContent`,
      "organization",
      "item",
      {
        user: context.currentUser,
        collectionNames: ["site", "initiative", "project"],
        filters: [],
        context,
      }
    );
    expect(result).toEqual({
      scope: "/properties/referencedContentIds",
      type: "Control",
      label: "some.label",
      options: {
        control: "hub-field-input-gallery-picker",
        helperText: {
          labelKey: "myI18nScope.fields.referencedContent.helperText.label",
        },
        targetEntity: "item",
        catalogs: [{ catalog: true }],
        facets: [
          {
            label:
              "{{myI18nScope.fields.referencedContent.facets.from.label:translate}}",
            key: "from",
            display: "single-select",
            operation: "OR",
            options: [
              {
                label:
                  "{{myI18nScope.fields.referencedContent.facets.from.myContent.label:translate}}",
                key: "myContent",
                selected: true,
                predicates: [{ owner: "user1" }],
              },
              {
                label:
                  "{{myI18nScope.fields.referencedContent.facets.from.myOrganization.label:translate}}",
                key: "myOrganization",
                selected: false,
                predicates: [{ orgId: "org1" }],
              },
            ],
          },
          {
            label:
              "{{myI18nScope.fields.referencedContent.facets.access.label:translate}}",
            key: "access",
            field: "access",
            display: "multi-select",
            operation: "OR",
          },
        ],
      },
    });
  });
});
