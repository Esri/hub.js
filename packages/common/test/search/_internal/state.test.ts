import { ICollection, ICollectionState } from "../../../src";
import { applyCollectionState } from "../../../src/search/_internal";

fdescribe("state", () => {
  describe("apply Collection state", () => {
    let collection: ICollection;

    beforeEach(() => {
      collection = {
        label: "fake collection",
        key: "fake",
        filter: {
          filterType: "content",
          owner: "vader",
        },
        sortOption: {
          label: "Title",
          attribute: "title",
          order: "asc",
          defaultOrder: "asc",
        },
        facets: [
          {
            label: "Type",
            key: "type",
            display: "single-select",
            options: [
              {
                label: "Map",
                key: "map",
                selected: true,
                filter: {
                  filterType: "content",
                  type: "Map",
                },
              },
              {
                label: "Service",
                key: "service",
                selected: false,
                filter: {
                  filterType: "content",
                  type: ["Map Service", "Feature Service"],
                },
              },
            ],
          },
          {
            label: "Tags",
            key: "tags",
            display: "multi-select",
            options: [
              {
                label: "water (123)",
                key: "water",
                selected: false,
                filter: {
                  filterType: "content",
                  tags: "water",
                },
              },
              {
                label: "river (12)",
                key: "river",
                selected: false,
                filter: {
                  filterType: "content",
                  tags: "river",
                },
              },
            ],
          },
        ],
      };
    });

    it("should copy query and sort", () => {
      const state: ICollectionState = {
        query: "yellow",
        sort: "Created|created|desc",
      };
      const chk = applyCollectionState(collection, state);
      expect(chk.facets.length).toBe(2, "should not change facets");
      expect(chk.defaultQuery).toBe("yellow");
      expect(chk.sortOption.label).toBe("Created");
      expect(chk.sortOption.attribute).toBe("created");
      expect(chk.sortOption.order).toBe("desc");
    });
    it("leaves query and sort if not in state", () => {
      const state: ICollectionState = {};
      const chk = applyCollectionState(collection, state);
      expect(chk.facets.length).toBe(2, "should not change facets");
      expect(chk.defaultQuery).not.toBeDefined();
      expect(chk.sortOption.label).toBe("Title");
    });
    it("should apply facet state", () => {
      const state: ICollectionState = {
        query: "yellow",
        sort: "created|desc",
        facetState: {
          tags: "water,river",
          type: "service",
        },
      };
      const chk = applyCollectionState(collection, state);
      expect(chk.facets.length).toBe(2, "should not change facets");
      expect(chk.defaultQuery).toBe("yellow");
      expect(chk.facets[0].options[1].selected).toBe(true);
      expect(chk.facets[1].options[0].selected).toBe(true);
      expect(chk.facets[1].options[1].selected).toBe(true);
    });
  });
});
