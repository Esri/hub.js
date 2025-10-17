import { getRecommendedTemplatesCatalog } from "../../../src/initiative-templates/_internal/getRecommendedTemplatesCatalog";
import { MOCK_CONTEXT } from "../../mocks/mock-auth";

describe("getRecommendedTemplatesCatalog", () => {
  it("returns the correct catalog", () => {
    const catalog = getRecommendedTemplatesCatalog(
      MOCK_CONTEXT.currentUser,
      "some.scope"
    );
    expect(catalog).toEqual([
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
            label: "some.scope.fields.recommendedTemplates.collection.label",
            scope: {
              targetEntity: "item",
              filters: [
                {
                  predicates: [
                    {
                      type: "Solution",
                    },
                  ],
                },
                {
                  predicates: [
                    {
                      typekeywords: ["hubSolutionTemplate"],
                    },
                    {
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
            label: "some.scope.fields.recommendedTemplates.collection.label",
            scope: {
              targetEntity: "item",
              filters: [
                {
                  predicates: [
                    {
                      type: "Solution",
                    },
                  ],
                },
                {
                  predicates: [
                    {
                      typekeywords: ["hubSolutionTemplate"],
                    },
                    {
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
    ]);
  });
});
