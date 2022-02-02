import * as portalModule from "@esri/arcgis-rest-portal";
import * as slugModule from "../../src/items/slugs";
import { MOCK_AUTH } from "../groups/add-users-workflow/fixtures";
import { ISearchOptions } from "@esri/arcgis-rest-portal";

describe("slug utils: ", () => {
  describe("createSlug:", () => {
    it("combined org and dasherized title", () => {
      expect(slugModule.constructSlug("Hello World", "DCdev")).toBe(
        "dcdev-hello-world"
      );
    });
  });
  describe("setSlugKeyword:", () => {
    it("removes existing slug keyword, add new one", () => {
      const chk = slugModule.setSlugKeyword(["slug|old-slug"], "hello-world");
      expect(chk.length).toBe(1);
      expect(chk[0]).toBe("slug|hello-world");
    });
    it("adds slug entry", () => {
      const chk = slugModule.setSlugKeyword(["otherKeyword"], "hello-world");
      expect(chk.length).toBe(2);
      expect(chk[1]).toBe("slug|hello-world");
    });
  });

  describe("getItemBySlug:", () => {
    it("searches by typekeyword", async () => {
      const searchSpy = spyOn(portalModule, "searchItems").and.returnValue(
        Promise.resolve({
          results: [
            { id: "3ef", title: "Fake", typeKeywords: ["one", "slug|foo-bar"] },
          ],
        })
      );

      const result = await slugModule.getItemBySlug("foo-bar", {
        authentication: MOCK_AUTH,
      });
      expect(result.id).toBe("3ef");
      // check if
      expect(searchSpy.calls.count()).toBe(1);
      const args = searchSpy.calls.argsFor(0)[0] as unknown as ISearchOptions;
      expect(args.filter).toBe(`typeKeywords:"slug|foo-bar"`);
      expect(args.authentication).toBe(MOCK_AUTH);
    });
    it("returns null if no result found", async () => {
      const searchSpy = spyOn(portalModule, "searchItems").and.returnValue(
        Promise.resolve({
          results: [],
        })
      );

      const result = await slugModule.getItemBySlug("foo-bar", {
        authentication: MOCK_AUTH,
      });
      expect(result).toBeNull();
      // check if
      expect(searchSpy.calls.count()).toBe(1);
      const args = searchSpy.calls.argsFor(0)[0] as unknown as ISearchOptions;
      expect(args.filter).toBe(`typeKeywords:"slug|foo-bar"`);
      expect(args.authentication).toBe(MOCK_AUTH);
    });
    it("throws lower level errors", async () => {
      const searchSpy = spyOn(portalModule, "searchItems").and.returnValue(
        Promise.reject()
      );

      try {
        await slugModule.getItemBySlug("foo-bar", {
          authentication: MOCK_AUTH,
        });
      } catch (ex) {
        expect(ex).toBeDefined();
        expect(searchSpy.calls.count()).toBe(1);
      }
    });
  });

  describe("getUniqueSlug:", () => {
    /**
     * Note: for whatever reason, we can't spy on slugModule.getItemBySlug
     * which means these tests "know" about the internals more than we'd like
     * but I can't seem to find a way around this
     */
    it("returns original if no items found", async () => {
      const searchSpy = spyOn(portalModule, "searchItems").and.returnValue(
        Promise.resolve({
          results: [],
        })
      );
      const slug = await slugModule.getUniqueSlug("foo-bar", {
        authentication: MOCK_AUTH,
      });

      expect(searchSpy.calls.count()).toBe(1);
      const args = searchSpy.calls.argsFor(0)[0] as unknown as ISearchOptions;
      expect(args.filter).toBe(`typeKeywords:"slug|foo-bar"`);
      expect(args.authentication).toBe(MOCK_AUTH);
      expect(slug).toBe("foo-bar");
    });
    it("increments if item found", async () => {
      let callCount = 0;
      // semantics for jasmine spies are lacking
      const searchSpy = spyOn(portalModule, "searchItems").and.callFake(() => {
        const response = {
          results: [] as portalModule.IItem[],
        };
        if (callCount === 0) {
          response.results.push({
            id: "3ef",
            title: "Fake",
            typeKeywords: ["one", "slug|foo-bar"],
          } as portalModule.IItem);
          callCount++;
        }
        return Promise.resolve(response);
      });

      const slug = await slugModule.getUniqueSlug("foo-bar", {
        authentication: MOCK_AUTH,
      });
      expect(slug).toBe("foo-bar-1");
      expect(searchSpy.calls.count()).toBe(2);
      const args = searchSpy.calls.argsFor(0)[0] as unknown as ISearchOptions;
      expect(args.filter).toBe(`typeKeywords:"slug|foo-bar"`);
      const args2 = searchSpy.calls.argsFor(1)[0] as unknown as ISearchOptions;
      expect(args2.filter).toBe(`typeKeywords:"slug|foo-bar-1"`);
    });
    it("re-throws exceptions", async () => {
      const searchSpy = spyOn(portalModule, "searchItems").and.returnValue(
        Promise.reject()
      );

      try {
        await slugModule.getUniqueSlug("foo-bar", {
          authentication: MOCK_AUTH,
        });
      } catch (ex) {
        expect(ex).toBeDefined();
        expect(searchSpy.calls.count()).toBe(1);
      }
    });
  });
});
