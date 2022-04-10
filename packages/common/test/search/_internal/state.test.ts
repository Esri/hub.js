import {
  cloneObject,
  ICollection,
  ICollectionState,
  IFacet,
  IFacetState,
  ISortOption,
} from "../../../src";
import {
  applySortState,
  applyFacetState,
  applyMultiSelectFacetState,
  applySingleSelectFacetState,
  serializeMultiSelectFacetState,
  serializeSingleSelectFacetState,
  serializeSortState,
  serializeFacetState,
} from "../../../src/search/_internal";

const singleSelectFacet: IFacet = {
  label: "Tags",
  key: "tags",
  display: "single-select",
  options: [
    {
      label: "River",
      key: "river",
      selected: false,
      filter: {
        filterType: "content",
      },
    },
    {
      label: "Lake",
      key: "lake",
      selected: false,
      filter: {
        filterType: "content",
      },
    },
  ],
};

const multiSelectFacet: IFacet = {
  label: "Tags",
  key: "tags",
  display: "multi-select",
  options: [
    {
      label: "River",
      key: "river",
      selected: false,
      filter: {
        filterType: "content",
      },
    },
    {
      label: "Lake",
      key: "lake",
      selected: false,
      filter: {
        filterType: "content",
      },
    },
  ],
};

describe("state utils", () => {
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

  describe("applySortState:", () => {
    it("returns clone with no changes if state is null/empty", () => {
      const opt: ISortOption = {
        label: "Created",
        attribute: "created",
        defaultOrder: "asc",
        order: "asc",
      };
      let chk = applySortState(opt, null);
      expect(chk).not.toBe(opt);
      expect(chk).toEqual(opt);
      chk = applySortState(opt, null);
      expect(chk).not.toBe(opt);
      expect(chk).toEqual(opt);
    });

    it("applies the sort state to a SortOption", () => {
      const opt: ISortOption = {
        label: "Created",
        attribute: "created",
        defaultOrder: "asc",
        order: "asc",
      };
      const state = "Title|title|desc";
      const chk = applySortState(opt, state);
      expect(chk.label).toBe("Title");
      expect(chk.attribute).toBe("title");
      expect(chk.order).toBe("desc");
    });
  });

  describe("applyFacetState:", () => {
    it("returns clone for unknown facet type", () => {
      const f: IFacet = {
        key: "some-facet",
        display: "other-type",
      } as unknown as IFacet;
      const state: IFacetState = {
        foo: "bar",
      };
      expect(applyFacetState(f, state)).toEqual(f);
      f.display = "histogram";
      expect(applyFacetState(f, state)).toEqual(f);
      f.display = "date-range";
      expect(applyFacetState(f, state)).toEqual(f);
    });
    it("handles singleSelect facet", () => {
      const state: IFacetState = {
        tags: "lake",
      };
      const chk = applyFacetState(singleSelectFacet, state);
      expect(chk.options[0].selected).toBe(false);
      expect(chk.options[1].selected).toBe(true);
    });
    it("handles multiSelect facet", () => {
      const state: IFacetState = {
        tags: "lake,river",
      };
      const chk = applyFacetState(multiSelectFacet, state);
      expect(chk.options[0].selected).toBe(true);
      expect(chk.options[1].selected).toBe(true);
    });
  });

  describe("applySingleSelectFacetState:", () => {
    it("returns clone w/o changes if state is not relevant", () => {
      const state: IFacetState = {
        other: "value",
      };
      const chk = applySingleSelectFacetState(singleSelectFacet, state);
      expect(chk).not.toBe(singleSelectFacet);
      expect(chk).toEqual(singleSelectFacet);
    });
    it("applies state correctly", () => {
      const state: IFacetState = {
        tags: "lake",
      };
      const chk = applySingleSelectFacetState(singleSelectFacet, state);
      expect(chk.options[0].selected).toBe(false);
      expect(chk.options[1].selected).toBe(true);
    });
  });
  describe("applyMultiSelectFacetState:", () => {
    it("returns clone w/o changes if state not relevant", () => {
      const state: IFacetState = {
        other: "value",
      };
      const chk = applyMultiSelectFacetState(multiSelectFacet, state);
      expect(chk).not.toBe(multiSelectFacet);
      expect(chk).toEqual(multiSelectFacet);
    });
    it("applies state correctly", () => {
      const state: IFacetState = {
        tags: "lake,river",
      };
      const chk = applyMultiSelectFacetState(multiSelectFacet, state);
      expect(chk.options[0].selected).toBe(true);
      expect(chk.options[1].selected).toBe(true);
    });
  });
  describe("serializeSingleSelectFacetState", () => {
    it("returns key:null if no selected", () => {
      const f = cloneObject(singleSelectFacet);
      const chk = serializeSingleSelectFacetState(f);
      expect(chk).toEqual({ tags: null });
    });
    it("returns key with selected entry key", () => {
      const f = cloneObject(singleSelectFacet);
      f.options[1].selected = true;
      const chk = serializeSingleSelectFacetState(f);
      expect(chk).toEqual({
        tags: "lake",
      });
    });
  });
  describe("serializeMultiSelectFacetState", () => {
    it("returns key:null if no selected", () => {
      const f = cloneObject(multiSelectFacet);
      const chk = serializeMultiSelectFacetState(f);
      expect(chk).toEqual({ tags: null });
    });
    it("returns key with selected entry key", () => {
      const f = cloneObject(multiSelectFacet);
      f.options[0].selected = true;
      f.options[1].selected = true;
      const chk = serializeMultiSelectFacetState(f);
      expect(chk).toEqual({
        tags: "river,lake",
      });
    });
  });

  describe("serializeSortState", () => {
    it("returns string from a sortOption", () => {
      const opt: ISortOption = {
        label: "Created",
        attribute: "created",
        defaultOrder: "asc",
        order: "asc",
      };
      const chk = serializeSortState(opt);
      expect(chk).toEqual("Created|created|asc");
    });
  });

  describe("serializeFacetState:", () => {
    describe("single-select:", () => {
      it("returns empty object if no selected", () => {
        const f = cloneObject(singleSelectFacet);
        const chk = serializeFacetState(f);
        expect(chk).toEqual({ tags: null });
      });
      it("returns key with selected entry key", () => {
        const f = cloneObject(singleSelectFacet);
        f.options[1].selected = true;
        const chk = serializeFacetState(f);
        expect(chk).toEqual({
          tags: "lake",
        });
      });
    });
    describe("multi-select:", () => {
      it("returns empty object if no selected", () => {
        const f = cloneObject(multiSelectFacet);
        const chk = serializeFacetState(f);
        expect(chk).toEqual({ tags: null });
      });
      it("returns key with selected entry key", () => {
        const f = cloneObject(multiSelectFacet);
        f.options[0].selected = true;
        f.options[1].selected = true;
        const chk = serializeFacetState(f);
        expect(chk).toEqual({
          tags: "river,lake",
        });
      });
    });
    describe("other types", () => {
      it("returns empty state for other types", () => {
        const f1 = cloneObject(multiSelectFacet);
        f1.display = "date-range";
        expect(serializeFacetState(f1)).toEqual({});
        f1.display = "histogram";
        expect(serializeFacetState(f1)).toEqual({});
        const other = {
          display: "other",
        } as unknown as IFacet;
        expect(serializeFacetState(other)).toEqual({});
      });
    });
  });
});
