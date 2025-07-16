import { fetchCategoriesUiSchemaElement } from "../../../../src/core/schemas/internal/fetchCategoriesUiSchemaElement";
import * as fetchOrgCategoriesModule from "../../../../src/core/schemas/internal/categories/fetchOrgCategories";
import * as fetchQueryCategoriesModule from "../../../../src/core/schemas/internal/categories/fetchQueryCategories";
import { IArcGISContext } from "../../../../src/types/IArcGISContext";
import { UiSchemaRuleEffects } from "../../../../src/core/schemas/types";
import { IQuery } from "../../../../src/search/types/IHubCatalog";

describe("fetchCategoriesUiSchemaElement:", () => {
  describe("when source is 'org'", () => {
    it("fetches categories and builds UI schema element", async () => {
      const fetchOrgCategoriesSpy = spyOn(
        fetchOrgCategoriesModule,
        "fetchOrgCategories"
      ).and.returnValue(
        Promise.resolve([
          "/Categories/Trending",
          "/Categories/Trending/New and noteworthy",
        ])
      );
      const context = {
        hubRequestOptions: {},
        portal: {
          id: "some-org-id",
          url: "some-org-url",
        },
      } as unknown as IArcGISContext;
      const uiSchema = await fetchCategoriesUiSchemaElement({
        source: "org",
        context,
      });
      expect(fetchOrgCategoriesSpy).toHaveBeenCalledTimes(1);
      expect(fetchOrgCategoriesSpy).toHaveBeenCalledWith(
        context.portal.id,
        context.hubRequestOptions
      );
      expect(uiSchema.length).toBe(2);
      // The first element is a control for categories
      expect(uiSchema[0].type).toBe("Control");
      expect(uiSchema[0].scope).toBe("/properties/categories");
      expect(uiSchema[0].options.groups.length).toBe(1);
      expect(uiSchema[0].options.groups[0].items).toEqual([
        {
          label: "Trending",
          value: "/Categories/Trending",
          children: [
            {
              label: "New and noteworthy",
              value: "/Categories/Trending/New and noteworthy",
              children: [],
            },
          ],
        },
      ]);
      expect(uiSchema[0].rules).toEqual([
        {
          effect: UiSchemaRuleEffects.DISABLE,
          conditions: [false], // Guarantees that the control will be enabled
        },
      ]);
      // The second element is a notice
      expect(uiSchema[1].type).toBe("Notice");
      expect(uiSchema[1].rules).toEqual([
        {
          effect: UiSchemaRuleEffects.SHOW,
          conditions: [false], // Guarantees that the notice will be hidden,
        },
      ]);
    });
    it("handles current values", async () => {
      spyOn(fetchOrgCategoriesModule, "fetchOrgCategories").and.returnValue(
        Promise.resolve([
          "/Categories/Trending",
          "/Categories/Trending/New and noteworthy",
        ])
      );
      const context = {
        portal: {
          id: "some-org-id",
          url: "some-org-url",
        },
      } as unknown as IArcGISContext;
      const uiSchema = await fetchCategoriesUiSchemaElement({
        source: "org",
        context,
        currentValues: [
          "/Categories/Trending", // recognized
          "/Categories/Unrecognized/Nested", // unrecognized fully qualified
          "Partial Category", // unrecognized partial
        ],
      });
      expect(uiSchema.length).toBe(2);
      // The first element is a control for categories
      expect(uiSchema[0].type).toBe("Control");
      expect(uiSchema[0].scope).toBe("/properties/categories");
      expect(uiSchema[0].options.groups.length).toBe(2);
      // The first group contains unrecognized categories
      expect(uiSchema[0].options.groups[0].items).toEqual([
        // unrecognized partial categories go first
        {
          label: "Partial Category",
          value: "Partial Category",
          children: [],
        },
        // then unrecognized fully qualified categories
        {
          label: "Unrecognized",
          value: "/Categories/Unrecognized",
          children: [
            {
              label: "Nested",
              value: "/Categories/Unrecognized/Nested",
              children: [],
            },
          ],
        },
      ]);
      // The second group contains recognized categories
      expect(uiSchema[0].options.groups[1].items).toEqual([
        {
          label: "Trending",
          value: "/Categories/Trending",
          children: [
            {
              label: "New and noteworthy",
              value: "/Categories/Trending/New and noteworthy",
              children: [],
            },
          ],
        },
      ]);
      expect(uiSchema[0].rules).toEqual([
        {
          effect: UiSchemaRuleEffects.DISABLE,
          conditions: [false], // Guarantees that the control will be enabled
        },
      ]);
      // The second element is a notice
      expect(uiSchema[1].type).toBe("Notice");
      expect(uiSchema[1].rules).toEqual([
        {
          effect: UiSchemaRuleEffects.SHOW,
          conditions: [false], // Guarantees that the notice will be hidden,
        },
      ]);
    });
  });

  describe("when source is 'query'", () => {
    it("fetches categories and builds UI schema element", async () => {
      const fetchQueryCategoriesSpy = spyOn(
        fetchQueryCategoriesModule,
        "fetchQueryCategories"
      ).and.returnValue(
        Promise.resolve([
          // NOTE: query aggregation categories are all lowercase
          "/categories/trending",
          "/categories/trending/new and noteworthy",
        ])
      );
      const context = {
        hubRequestOptions: {},
      } as unknown as IArcGISContext;
      const query = { filters: [] } as unknown as IQuery;
      const uiSchema = await fetchCategoriesUiSchemaElement({
        source: "query",
        context,
        query,
      });
      expect(fetchQueryCategoriesSpy).toHaveBeenCalledTimes(1);
      expect(fetchQueryCategoriesSpy).toHaveBeenCalledWith(
        query,
        context.hubRequestOptions
      );
      expect(uiSchema.length).toBe(2);
      // The first element is a control for categories
      expect(uiSchema[0].type).toBe("Control");
      expect(uiSchema[0].scope).toBe("/properties/categories");
      expect(uiSchema[0].options.groups.length).toBe(1);
      expect(uiSchema[0].options.groups[0].items).toEqual([
        {
          label: "Trending", // label get sentence cased
          value: "/categories/trending",
          children: [
            {
              label: "New and noteworthy", // label get sentence cased
              value: "/categories/trending/new and noteworthy",
              children: [],
            },
          ],
        },
      ]);
      expect(uiSchema[0].rules).toEqual([
        {
          effect: UiSchemaRuleEffects.DISABLE,
          conditions: [false], // Guarantees that the control will be enabled
        },
      ]);
      // The second element is a notice
      expect(uiSchema[1].type).toBe("Notice");
      expect(uiSchema[1].rules).toEqual([
        {
          effect: UiSchemaRuleEffects.SHOW,
          conditions: [false], // Guarantees that the notice will be hidden,
        },
      ]);
    });
    it("fetches categories and builds UI schema element", async () => {
      spyOn(fetchQueryCategoriesModule, "fetchQueryCategories").and.returnValue(
        Promise.resolve([
          // NOTE: query aggregation categories are all lowercase
          "/categories/trending",
          "/categories/trending/new and noteworthy",
        ])
      );
      const context = {} as unknown as IArcGISContext;
      const query = { filters: [] } as unknown as IQuery;
      const uiSchema = await fetchCategoriesUiSchemaElement({
        source: "query",
        context,
        query,
        currentValues: [
          "/categories/trending", // recognized
          "/categories/unrecognized/nested", // unrecognized fully qualified
          "partial category", // unrecognized partial
        ],
      });
      expect(uiSchema.length).toBe(2);
      // The first element is a control for categories
      expect(uiSchema[0].type).toBe("Control");
      expect(uiSchema[0].scope).toBe("/properties/categories");
      expect(uiSchema[0].options.groups.length).toBe(2);
      expect(uiSchema[0].options.groups[0].items).toEqual([
        // unrecognized partial categories go first
        {
          label: "partial category", // We don't manipulate the label for partial categories
          value: "partial category",
          children: [],
        },
        // then unrecognized fully qualified categories
        {
          label: "Unrecognized", // label get sentence cased
          value: "/categories/unrecognized",
          children: [
            {
              label: "Nested", // label get sentence cased
              value: "/categories/unrecognized/nested",
              children: [],
            },
          ],
        },
      ]);
      expect(uiSchema[0].options.groups[1].items).toEqual([
        {
          label: "Trending", // label get sentence cased
          value: "/categories/trending",
          children: [
            {
              label: "New and noteworthy", // label get sentence cased
              value: "/categories/trending/new and noteworthy",
              children: [],
            },
          ],
        },
      ]);
      expect(uiSchema[0].rules).toEqual([
        {
          effect: UiSchemaRuleEffects.DISABLE,
          conditions: [false], // Guarantees that the control will be enabled
        },
      ]);
      // The second element is a notice
      expect(uiSchema[1].type).toBe("Notice");
      expect(uiSchema[1].rules).toEqual([
        {
          effect: UiSchemaRuleEffects.SHOW,
          conditions: [false], // Guarantees that the notice will be hidden,
        },
      ]);
    });
  });

  describe("When no recognized categories are available", () => {
    it("Disables controls and includes the no categories notice if no unrecognized categories are present", async () => {
      spyOn(fetchOrgCategoriesModule, "fetchOrgCategories").and.returnValue(
        Promise.resolve([])
      );
      const context = {
        portal: {
          id: "some-org-id",
          url: "some-org-url",
        },
      } as unknown as IArcGISContext;
      const uiSchema = await fetchCategoriesUiSchemaElement({
        source: "org",
        context,
      });

      expect(uiSchema.length).toBe(2);
      // The first element is a control for categories
      expect(uiSchema[0].type).toBe("Control");
      expect(uiSchema[0].scope).toBe("/properties/categories");
      expect(uiSchema[0].rules).toEqual([
        {
          effect: UiSchemaRuleEffects.DISABLE,
          conditions: [true], // Guarantees that the control will be disabled
        },
      ]);
      // The second element is a notice
      expect(uiSchema[1].type).toBe("Notice");
      expect(uiSchema[1].rules).toEqual([
        {
          effect: UiSchemaRuleEffects.SHOW,
          conditions: [true], // Guarantees that the notice will be shown,
        },
      ]);
    });
    it("Leave the controls enabled and hides the categories notice if unrecognized categories are", async () => {
      spyOn(fetchOrgCategoriesModule, "fetchOrgCategories").and.returnValue(
        Promise.resolve([])
      );
      const context = {
        portal: {
          id: "some-org-id",
          url: "some-org-url",
        },
      } as unknown as IArcGISContext;
      const uiSchema = await fetchCategoriesUiSchemaElement({
        source: "org",
        context,
        currentValues: [
          "Partial Category", // unrecognized partial
        ],
      });
      expect(uiSchema.length).toBe(2);
      // The first element is a control for categories
      expect(uiSchema[0].type).toBe("Control");
      expect(uiSchema[0].scope).toBe("/properties/categories");
      // only the unrecognized categories group is present
      expect(uiSchema[0].options.groups.length).toBe(1);
      expect(uiSchema[0].options.groups[0].items).toEqual([
        // unrecognized partial categories go first
        {
          label: "Partial Category",
          value: "Partial Category",
          children: [],
        },
      ]);
      expect(uiSchema[0].rules).toEqual([
        {
          effect: UiSchemaRuleEffects.DISABLE,
          conditions: [false], // Guarantees that the control will be enabled
        },
      ]);
      // The second element is a notice
      expect(uiSchema[1].type).toBe("Notice");
      expect(uiSchema[1].rules).toEqual([
        {
          effect: UiSchemaRuleEffects.SHOW,
          conditions: [false], // Guarantees that the notice will be hidden,
        },
      ]);
    });
  });
});
