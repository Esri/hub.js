import {
  cloneObject,
  IFacet,
  ISortOption,
  serializeFacetState,
  serializeSortState,
} from "../../src";

describe("stateSerializers Module:", () => {
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
        expect(chk).toEqual({});
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
        expect(chk).toEqual({});
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
