import { deepFilter } from "../../src/objects/deepFilter";

describe("deepFilter:", () => {
  describe("predicate:", () => {
    it("filters entries in an array", () => {
      const test = ["a", "b", "c"];
      const predicate = (obj: any) => obj !== "b";
      const chk = deepFilter(test, predicate);

      expect(chk.length).toBe(2);
      expect(chk).toEqual(["a", "c"]);
    });
    it("filters object entries in array", () => {
      const test = [{ notid: "a" }, { id: "b" }, { id: "c" }];
      const predicate = (obj: any) => obj?.id !== "b";
      const chk = deepFilter(test, predicate);

      expect(chk.length).toBe(2);
      expect(chk).toEqual([{ notid: "a" }, { id: "c" }]);
    });
    it("filters simple objects", () => {
      const test = { id: "a", someProp: { id: "b" } };
      const predicate = (obj: any) => obj.id !== "b";
      const chk = deepFilter(test, predicate);

      expect(chk).toEqual({ id: "a" });
    });
    it("filters deeply nested entries in an array", () => {
      const predicate = (link: any) => link.key !== "00a";
      const test = [
        {
          key: "001",
          label: "Stop the Spotted Lanternfly",
        },
        {
          key: "002",
          label: "Create a Map",
          children: [
            {
              key: "00a",
              label: "ArcGIS Map Viewer",
            },
            {
              key: "00b",
              label: "ArcGIS Map Viewer Classic",
            },
          ],
        },
      ];

      const chk = deepFilter(test, predicate);

      expect(chk.length).toBe(2);
      expect(chk[0].key).toBe("001");
      expect(chk[1].key).toBe("002");
      expect(chk[1].children.length).toBe(1);
      expect(chk[1].children[0].key).toBe("00b");
    });
    it("filters deeply nested arrays in an object", () => {
      const predicate = (link: any) => link.status !== "not-started";
      const test = {
        key: "001",
        status: "in-progress",
        children: [
          {
            key: "00a",
            status: "not-started",
          },
          {
            key: "00b",
            status: "in-progress",
            children: [
              {
                key: "00c",
                status: "not-started",
              },
              {
                key: "00d",
                status: "complete",
              },
            ],
          },
        ],
      };

      const chk = deepFilter(test, predicate);

      expect(chk.status).toBe("in-progress");
      expect(chk.children.length).toBe(1);
      expect(chk.children[0].children.length).toBe(1);
    });
    it("filters deeply nested objects in an object", () => {
      const predicate = (link: any) => link.status !== "complete";
      const test = {
        status: "in-progress",
        level1: {
          status: "in-progress",
          level2: {
            status: "in-progress",
            level3a: {
              status: "complete",
            },
            level3b: {
              status: "not-started",
            },
          },
        },
      };

      const chk = deepFilter(test, predicate);

      expect(chk.status).toBe("in-progress");
      expect(chk.level1.level2.level3a).toBeUndefined();
      expect(chk.level1.level2.level3b.status).toBe("not-started");
    });
    it("skips dates", () => {
      const test = new Date();
      const predicate = (obj: any) => obj.id === "b";
      const chk = deepFilter(test, predicate);

      expect(chk).toBeUndefined();
    });
    it("skips fns", () => {
      const test = () => 2;
      test.id = "b";
      const predicate = (obj: any) => obj.id === "b";
      const chk = deepFilter(test, predicate);
      expect(chk).toBeUndefined();
    });
    it("skips regex", () => {
      const test = new RegExp("b");
      const predicate = (obj: any) => obj.id === "b";
      const chk = deepFilter(test, predicate);
      expect(chk).toBeUndefined();
    });
  });
});
