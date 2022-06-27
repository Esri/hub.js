import { IItem, ISearchResult } from "@esri/arcgis-rest-portal";
import { convertPortalAggregations } from "../../../src/search/_internal/portalSearchUtils";
describe("portalSearchUtils module", () => {
  describe("convertPortalAggregations:", () => {
    it("returns empty array if no aggregations are present", () => {
      const sr: ISearchResult<IItem> = {
        query: "",
        total: 0,
        start: 0,
        num: 0,
        nextStart: 0,
        results: [],
      };
      const chk = convertPortalAggregations(sr);
      expect(chk.length).toBe(0);
    });

    it("converts portal aggregations", () => {
      const sr: ISearchResult<IItem> = {
        query: "",
        total: 0,
        start: 0,
        num: 0,
        nextStart: 0,
        results: [],
        aggregations: {
          counts: [
            {
              fieldName: "tags",
              fieldValues: [
                { value: "hub site", count: 4 },
                { value: "hubproject", count: 2 },
                { value: "marks projects", count: 2 },
              ],
            },
          ],
        },
      };
      const chk = convertPortalAggregations(sr);
      expect(chk.length).toBe(1);
      expect(chk[0].mode).toBe("terms");
      expect(chk[0].values.length).toBe(3);
      expect(chk[0].values).toEqual([
        { value: "hub site", count: 4 },
        { value: "hubproject", count: 2 },
        { value: "marks projects", count: 2 },
      ]);
    });
  });
});
