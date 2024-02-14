import * as portalModule from "@esri/arcgis-rest-portal";
import * as slugModule from "../../src/items/slugs";
import { MOCK_AUTH } from "../groups/add-users-workflow/fixtures";
import { ISearchOptions } from "@esri/arcgis-rest-portal";

describe("slug utils: ", () => {
  describe("createSlug:", () => {
    it("combined org and dasherized title", () => {
      expect(slugModule.constructSlug("Hello World", "DCdev")).toBe(
        "dcdev|hello-world"
      );
      expect(slugModule.constructSlug("E2E Test Project", "qa-bas-hub")).toBe(
        "qa-bas-hub|e2e-test-project"
      );
      expect(
        slugModule.constructSlug(
          "A really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really long title",
          "qa-bas-hub"
        )
      ).toBe(
        "qa-bas-hub|a-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-rea",
        "does not exceed 256 chars taking into account slug prefix and orgKey"
      );
      expect(
        slugModule.constructSlug(
          "A really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really reallllly really long title",
          "qa-bas-hub"
        )
      ).toBe(
        "qa-bas-hub|a-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-reallllly",
        "does not end with hyphen"
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
      const searchResult = {
        id: "3ef",
        title: "Fake",
        typeKeywords: ["one", "slug|foo-bar"],
      } as any as portalModule.IItem;
      const itemResult = {
        ...searchResult,
        orgId: "ghi",
      } as any as portalModule.IItem;
      const requestOptions = {
        authentication: MOCK_AUTH,
      };
      const searchSpy = spyOn(portalModule, "searchItems").and.returnValue(
        Promise.resolve({
          results: [searchResult],
        })
      );
      const getByIdSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve(itemResult)
      );

      const result = await slugModule.getItemBySlug("foo-bar", requestOptions);
      expect(result).toBe(itemResult);
      // check if
      expect(searchSpy.calls.count()).toBe(1);
      const args = searchSpy.calls.argsFor(0)[0] as unknown as ISearchOptions;
      expect(args.filter).toBe(`typekeywords:"slug|foo-bar"`);
      expect(args.authentication).toBe(MOCK_AUTH);
      expect(getByIdSpy).toHaveBeenCalledTimes(1);
      expect(getByIdSpy).toHaveBeenCalledWith(searchResult.id, requestOptions);
    });
    it("searches by converted uri typekeyword", async () => {
      const searchResult = {
        id: "3ef",
        title: "Fake",
        typeKeywords: ["one", "slug|my-org|foo-bar"],
      } as any as portalModule.IItem;
      const itemResult = {
        ...searchResult,
        orgId: "ghi",
      } as any as portalModule.IItem;
      const requestOptions = {
        authentication: MOCK_AUTH,
      };
      const searchSpy = spyOn(portalModule, "searchItems").and.returnValue(
        Promise.resolve({
          results: [searchResult],
        })
      );
      const getByIdSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve(itemResult)
      );

      const result = await slugModule.getItemBySlug(
        "myorg::foo-bar",
        requestOptions
      );
      expect(result).toBe(itemResult);
      // check if
      expect(searchSpy.calls.count()).toBe(1);
      const args = searchSpy.calls.argsFor(0)[0] as unknown as ISearchOptions;
      expect(args.filter).toBe(`typekeywords:"slug|myorg|foo-bar"`);
      expect(args.authentication).toBe(MOCK_AUTH);
      expect(getByIdSpy).toHaveBeenCalledTimes(1);
      expect(getByIdSpy).toHaveBeenCalledWith(searchResult.id, requestOptions);
    });
    it("returns null if no result found", async () => {
      const searchSpy = spyOn(portalModule, "searchItems").and.returnValue(
        Promise.resolve({
          results: [],
        })
      );
      const getByIdSpy = spyOn(portalModule, "getItem");

      const result = await slugModule.getItemBySlug("foo-bar", {
        authentication: MOCK_AUTH,
      });
      expect(result).toBeNull();
      // check if
      expect(searchSpy.calls.count()).toBe(1);
      const args = searchSpy.calls.argsFor(0)[0] as unknown as ISearchOptions;
      expect(args.filter).toBe(`typekeywords:"slug|foo-bar"`);
      expect(args.authentication).toBe(MOCK_AUTH);
      expect(getByIdSpy).not.toHaveBeenCalled();
    });
    it("throws lower level errors", async () => {
      const searchSpy = spyOn(portalModule, "searchItems").and.returnValue(
        Promise.reject(new Error("An error occurred"))
      );

      try {
        await slugModule.getItemBySlug("foo-bar", {
          authentication: MOCK_AUTH,
        });
      } catch (ex) {
        expect(ex).toBeDefined();
        expect(ex.message).toBe("An error occurred");
        expect(searchSpy.calls.count()).toBe(1);
      }
    });
  });

  describe("findItemsBySlug:", () => {
    it("excludes specific item", async () => {
      const searchSpy = spyOn(portalModule, "searchItems").and.returnValue(
        Promise.resolve({
          results: [
            { id: "3ef", title: "Fake", typeKeywords: ["one", "slug|foo-bar"] },
          ],
        })
      );

      const results = await slugModule.findItemsBySlug(
        { slug: "foo-bar", exclude: "bc3" },
        {
          authentication: MOCK_AUTH,
        }
      );
      expect(results[0].id).toBe("3ef");
      // check if
      expect(searchSpy.calls.count()).toBe(1);
      const args = searchSpy.calls.argsFor(0)[0] as unknown as ISearchOptions;
      expect(args.filter).toBe(`typekeywords:"slug|foo-bar"`);
      expect(args.q).toBe(`NOT id:bc3`);
      expect(args.authentication).toBe(MOCK_AUTH);
    });

    it("does not add slug prefix when already present", async () => {
      const searchSpy = spyOn(portalModule, "searchItems").and.returnValue(
        Promise.resolve({
          results: [
            { id: "3ef", title: "Fake", typeKeywords: ["one", "slug|foo-bar"] },
          ],
        })
      );

      const results = await slugModule.findItemsBySlug(
        { slug: "slug|foo-bar", exclude: "bc3" },
        {
          authentication: MOCK_AUTH,
        }
      );
      expect(results[0].id).toBe("3ef");
      // check if
      expect(searchSpy.calls.count()).toBe(1);
      const args = searchSpy.calls.argsFor(0)[0] as unknown as ISearchOptions;
      expect(args.filter).toBe(`typekeywords:"slug|foo-bar"`);
      expect(args.q).toBe(`NOT id:bc3`);
      expect(args.authentication).toBe(MOCK_AUTH);
    });

    it("passes an undefined q query when no exclusion is provided", async () => {
      const searchSpy = spyOn(portalModule, "searchItems").and.returnValue(
        Promise.resolve({
          results: [
            { id: "3ef", title: "Fake", typeKeywords: ["one", "slug|foo-bar"] },
          ],
        })
      );

      const results = await slugModule.findItemsBySlug(
        { slug: "foo-bar" },
        {
          authentication: MOCK_AUTH,
        }
      );
      expect(results[0].id).toBe("3ef");
      // check if
      expect(searchSpy.calls.count()).toBe(1);
      const args = searchSpy.calls.argsFor(0)[0] as unknown as ISearchOptions;
      expect(args.filter).toBe(`typekeywords:"slug|foo-bar"`);
      expect(args.q).not.toBeDefined();
      expect(args.authentication).toBe(MOCK_AUTH);
    });

    it("passes a portal url when no auth is provided", async () => {
      const searchSpy = spyOn(portalModule, "searchItems").and.returnValue(
        Promise.resolve({
          results: [
            { id: "3ef", title: "Fake", typeKeywords: ["one", "slug|foo-bar"] },
          ],
        })
      );

      const results = await slugModule.findItemsBySlug(
        { slug: "foo-bar" },
        {
          portal: "mock-portal",
        }
      );
      expect(results[0].id).toBe("3ef");
      // check if
      expect(searchSpy.calls.count()).toBe(1);
      const args = searchSpy.calls.argsFor(0)[0] as unknown as ISearchOptions;
      expect(args.filter).toBe(`typekeywords:"slug|foo-bar"`);
      expect(args.authentication).toBe(undefined);
      expect(args.portal).toBe("mock-portal");
    });

    it("handles when neither portal nor auth are provided", async () => {
      const searchSpy = spyOn(portalModule, "searchItems").and.returnValue(
        Promise.resolve({
          results: [
            { id: "3ef", title: "Fake", typeKeywords: ["one", "slug|foo-bar"] },
          ],
        })
      );

      const results = await slugModule.findItemsBySlug({ slug: "foo-bar" }, {});
      expect(results[0].id).toBe("3ef");
      // check if
      expect(searchSpy.calls.count()).toBe(1);
      const args = searchSpy.calls.argsFor(0)[0] as unknown as ISearchOptions;
      expect(args.filter).toBe(`typekeywords:"slug|foo-bar"`);
      expect(args.authentication).toBe(undefined);
      expect(args.portal).toBe(undefined);
    });

    it("can re-throw original error", async () => {
      const searchSpy = spyOn(portalModule, "searchItems").and.throwError(
        "Error occurred"
      );

      try {
        await slugModule.findItemsBySlug(
          { slug: "foo-bar" },
          {
            portal: "mock-portal",
          }
        );
        // Never reach here
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeDefined();
        expect(err.message).toBe("Error occurred");
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
      const slug = await slugModule.getUniqueSlug(
        { slug: "foo-bar" },
        {
          authentication: MOCK_AUTH,
        }
      );

      expect(searchSpy.calls.count()).toBe(1);
      const args = searchSpy.calls.argsFor(0)[0] as unknown as ISearchOptions;
      expect(args.filter).toBe(`typekeywords:"slug|foo-bar"`);
      expect(args.authentication).toBe(MOCK_AUTH);
      expect(slug).toBe("foo-bar");
    });
    it("excludes item with existingId", async () => {
      const searchSpy = spyOn(portalModule, "searchItems").and.returnValue(
        Promise.resolve({
          results: [],
        })
      );
      const slug = await slugModule.getUniqueSlug(
        { slug: "foo-bar", existingId: "31c" },
        {
          authentication: MOCK_AUTH,
        }
      );

      expect(searchSpy.calls.count()).toBe(1);
      const args = searchSpy.calls.argsFor(0)[0] as unknown as ISearchOptions;
      expect(args.filter).toBe(`typekeywords:"slug|foo-bar"`);
      expect(args.authentication).toBe(MOCK_AUTH);
      expect(args.q).toBe("NOT id:31c");
      expect(slug).toBe("foo-bar");
    });
    it("increments if item found", async () => {
      let callCount = 0;
      // semantics for jasmine spies are lacking
      const searchSpy = spyOn(portalModule, "searchItems").and.callFake(() => {
        const response = {
          results: [] as portalModule.IItem[],
        };
        if (callCount < 2) {
          response.results.push({
            id: "3ef",
            title: "Fake",
            typeKeywords: ["one", "slug|foo-bar"],
          } as portalModule.IItem);
          callCount++;
        }
        return Promise.resolve(response);
      });

      const slug = await slugModule.getUniqueSlug(
        { slug: "foo-bar" },
        {
          authentication: MOCK_AUTH,
        }
      );
      expect(slug).toBe("foo-bar-2");
      expect(searchSpy.calls.count()).toBe(3);
      const args = searchSpy.calls.argsFor(0)[0] as unknown as ISearchOptions;
      expect(args.filter).toBe(`typekeywords:"slug|foo-bar"`);
      const args2 = searchSpy.calls.argsFor(1)[0] as unknown as ISearchOptions;
      expect(args2.filter).toBe(`typekeywords:"slug|foo-bar-1"`);
      const args3 = searchSpy.calls.argsFor(2)[0] as unknown as ISearchOptions;
      expect(args3.filter).toBe(`typekeywords:"slug|foo-bar-2"`);
    });
    it("re-throws exceptions", async () => {
      const searchSpy = spyOn(portalModule, "searchItems").and.returnValue(
        Promise.reject()
      );

      try {
        await slugModule.getUniqueSlug(
          { slug: "foo-bar" },
          {
            authentication: MOCK_AUTH,
          }
        );
      } catch (ex) {
        expect(ex).toBeDefined();
        expect(searchSpy.calls.count()).toBe(1);
      }
    });
  });
});
