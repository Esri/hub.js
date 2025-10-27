vi.mock(
  "@esri/arcgis-rest-portal",
  async (importOriginal) =>
    ({
      ...(await importOriginal()),
      searchItems: vi.fn(),
      getItem: vi.fn(),
    } as any)
);

import * as portalModule from "@esri/arcgis-rest-portal";
import * as slugModule from "../../src/items/slugs";
import { MOCK_AUTH } from "../groups/add-users-workflow/fixtures";
import { ISearchOptions } from "@esri/arcgis-rest-portal";

afterEach(() => vi.restoreAllMocks());

describe("slug utils:", () => {
  describe("createSlug:", () => {
    it("combined org and dasherized title", () => {
      expect(slugModule.constructSlug("Hello World", "DCdev")).toBe(
        "dcdev|hello-world"
      );
      expect(slugModule.constructSlug("E2E Test Project", "qa-bas-hub")).toBe(
        "qa-bas-hub|e2e-test-project"
      );
      expect(slugModule.constructSlug("E2E Test Project", undefined)).toBe(
        "e2e-test-project"
      );
      expect(slugModule.constructSlug("!!!@@@###", "myorg")).toBe("");
      expect(slugModule.constructSlug("", "myorg")).toBe("");
      expect(slugModule.constructSlug("!!!@@@###")).toBe("");
      expect(slugModule.constructSlug("")).toBe("");
      expect(slugModule.constructSlug("-")).toBe("");
    });
  });

  describe("setSlugKeyword:", () => {
    it("removes existing slug keyword, add new one", () => {
      const chk = slugModule.setSlugKeyword(["slug|old-slug"], "hello-world");
      expect(chk.length).toBe(1);
      expect(chk[0]).toBe("slug|hello-world");
    });
    it("handles mixed case", () => {
      const chk = slugModule.setSlugKeyword(["slug|old-slug"], "Hello-World");
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
      const searchSpy = vi
        .spyOn(portalModule as any, "searchItems")
        .mockResolvedValue({ results: [searchResult] });
      const getByIdSpy = vi
        .spyOn(portalModule as any, "getItem")
        .mockResolvedValue(itemResult);

      const result = await slugModule.getItemBySlug("foo-bar", requestOptions);
      expect(result).toBe(itemResult);
      expect((searchSpy as any).mock.calls.length).toBe(1);
      const args = (searchSpy as any).mock
        .calls[0][0] as unknown as ISearchOptions;
      expect(args.filter).toBe(`typekeywords:"slug|foo-bar"`);
      expect(args.authentication).toBe(MOCK_AUTH);
      expect(getByIdSpy).toHaveBeenCalledTimes(1);
      expect(getByIdSpy).toHaveBeenCalledWith(searchResult.id, requestOptions);
    });

    it("returns null if no result found", async () => {
      const searchSpy = vi
        .spyOn(portalModule as any, "searchItems")
        .mockResolvedValue({ results: [] });
      const getByIdSpy = vi
        .spyOn(portalModule as any, "getItem")
        .mockResolvedValue(undefined);

      const result = await slugModule.getItemBySlug("foo-bar", {
        authentication: MOCK_AUTH,
      });
      expect(result).toBeNull();
      expect((searchSpy as any).mock.calls.length).toBe(1);
      const args = (searchSpy as any).mock
        .calls[0][0] as unknown as ISearchOptions;
      expect(args.filter).toBe(`typekeywords:"slug|foo-bar"`);
      expect(args.authentication).toBe(MOCK_AUTH);
      expect(getByIdSpy).not.toHaveBeenCalled();
    });
  });
});
// make ESM namespace spyable
vi.mock("@esri/arcgis-rest-portal", async (importOriginal: any) => {
  const mod = await importOriginal();
  return Object.assign({}, mod, {
    searchItems: vi.fn(),
    getItem: vi.fn(),
  });
});

import * as portalModule from "@esri/arcgis-rest-portal";
import * as slugModule from "../../src/items/slugs";
import { MOCK_AUTH } from "../groups/add-users-workflow/fixtures";
import { ISearchOptions } from "@esri/arcgis-rest-portal";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("slug utils: ", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("createSlug:", () => {
    it("combined org and dasherized title", () => {
      expect(slugModule.constructSlug("Hello World", "DCdev")).toBe(
        "dcdev|hello-world"
      );
      expect(slugModule.constructSlug("E2E Test Project", "qa-bas-hub")).toBe(
        "qa-bas-hub|e2e-test-project"
      );
      expect(slugModule.constructSlug("E2E Test Project", undefined)).toBe(
        "e2e-test-project"
      );
      expect(
        slugModule.constructSlug(
          "A really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really re",
          "qa-bas-hub"
        )
      ).toBe(
        "qa-bas-hub|a-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-rea"
      );
      expect(
        slugModule.constructSlug(
          "A really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really reallllly really long title",
          "qa-bas-hub"
        )
      ).toBe(
        "qa-bas-hub|a-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-really-reallllly"
      );
      expect(slugModule.constructSlug("!!!@@@###", "myorg")).toBe("");
      expect(slugModule.constructSlug("", "myorg")).toBe("");
      expect(slugModule.constructSlug("!!!@@@###")).toBe("");
      expect(slugModule.constructSlug("")).toBe("");
      expect(slugModule.constructSlug("-")).toBe("");
    });
  });
  describe("setSlugKeyword:", () => {
    it("removes existing slug keyword, add new one", () => {
      const chk = slugModule.setSlugKeyword(["slug|old-slug"], "hello-world");
      expect(chk.length).toBe(1);
      expect(chk[0]).toBe("slug|hello-world");
    });
    it("handles mixed case", () => {
      const chk = slugModule.setSlugKeyword(["slug|old-slug"], "Hello-World");
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
      } as any;
      const searchSpy = vi
        .spyOn(portalModule as any, "searchItems")
        .mockReturnValue(Promise.resolve({ results: [searchResult] }));
      const getByIdSpy = vi
        .spyOn(portalModule as any, "getItem")
        .mockReturnValue(Promise.resolve(itemResult));

      const result = await slugModule.getItemBySlug("foo-bar", requestOptions);
      expect(result).toBe(itemResult);
      expect(searchSpy).toHaveBeenCalledTimes(1);
      const args = searchSpy.mock.calls[0][0] as ISearchOptions;
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
      } as any;
      const searchSpy = vi
        .spyOn(portalModule as any, "searchItems")
        .mockReturnValue(Promise.resolve({ results: [searchResult] }));
      const getByIdSpy = vi
        .spyOn(portalModule as any, "getItem")
        .mockReturnValue(Promise.resolve(itemResult));

      const result = await slugModule.getItemBySlug(
        "myorg::foo-bar",
        requestOptions
      );
      expect(result).toBe(itemResult);
      expect(searchSpy).toHaveBeenCalledTimes(1);
      const args = searchSpy.mock.calls[0][0] as ISearchOptions;
      expect(args.filter).toBe(`typekeywords:"slug|myorg|foo-bar"`);
      expect(args.authentication).toBe(MOCK_AUTH);
      expect(getByIdSpy).toHaveBeenCalledTimes(1);
      expect(getByIdSpy).toHaveBeenCalledWith(searchResult.id, requestOptions);
    });
    it("returns null if no result found", async () => {
      const searchSpy = vi
        .spyOn(portalModule as any, "searchItems")
        .mockReturnValue(Promise.resolve({ results: [] }));
      const getByIdSpy = vi.spyOn(portalModule as any, "getItem");

      const result = await slugModule.getItemBySlug("foo-bar", {
        authentication: MOCK_AUTH,
      } as any);
      expect(result).toBeNull();
      expect(searchSpy).toHaveBeenCalledTimes(1);
      const args = searchSpy.mock.calls[0][0] as ISearchOptions;
      expect(args.filter).toBe(`typekeywords:"slug|foo-bar"`);
      expect(args.authentication).toBe(MOCK_AUTH);
      expect(getByIdSpy).not.toHaveBeenCalled();
    });
    it("throws lower level errors", async () => {
      const searchSpy = vi
        .spyOn(portalModule as any, "searchItems")
        .mockReturnValue(Promise.reject(new Error("An error occurred")));

      try {
        await slugModule.getItemBySlug("foo-bar", {
          authentication: MOCK_AUTH,
        } as any);
      } catch (ex) {
        const error = ex as { message?: string };
        expect(error).toBeDefined();
        expect(error.message).toBe("An error occurred");
        expect(searchSpy).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe("findItemsBySlug:", () => {
    it("short-circuits with an empty array when slugInfo.slug is falsey", async () => {
      const searchSpy = vi
        .spyOn(portalModule as any, "searchItems")
        .mockReturnValue(Promise.resolve({ results: [] }));

      const results = await slugModule.findItemsBySlug(
        { slug: "", exclude: "bc3" },
        {
          authentication: MOCK_AUTH,
        } as any
      );
      expect(results).toEqual([]);
      expect(searchSpy).toHaveBeenCalledTimes(0);
    });
    it("excludes specific item", async () => {
      const searchSpy = vi
        .spyOn(portalModule as any, "searchItems")
        .mockReturnValue(
          Promise.resolve({
            results: [
              {
                id: "3ef",
                title: "Fake",
                typeKeywords: ["one", "slug|foo-bar"],
              },
            ],
          })
        );

      const results = await slugModule.findItemsBySlug(
        { slug: "foo-bar", exclude: "bc3" },
        {
          authentication: MOCK_AUTH,
        } as any
      );
      expect(results[0].id).toBe("3ef");
      expect(searchSpy).toHaveBeenCalledTimes(1);
      const args = searchSpy.mock.calls[0][0] as ISearchOptions;
      expect(args.filter).toBe(`typekeywords:"slug|foo-bar"`);
      expect(args.q).toBe(`NOT id:bc3`);
      expect(args.authentication).toBe(MOCK_AUTH);
    });

    it("does not add slug prefix when already present", async () => {
      const searchSpy = vi
        .spyOn(portalModule as any, "searchItems")
        .mockReturnValue(
          Promise.resolve({
            results: [
              {
                id: "3ef",
                title: "Fake",
                typeKeywords: ["one", "slug|foo-bar"],
              },
            ],
          })
        );

      const results = await slugModule.findItemsBySlug(
        { slug: "slug|foo-bar", exclude: "bc3" },
        {
          authentication: MOCK_AUTH,
        } as any
      );
      expect(results[0].id).toBe("3ef");
      expect(searchSpy).toHaveBeenCalledTimes(1);
      const args = searchSpy.mock.calls[0][0] as ISearchOptions;
      expect(args.filter).toBe(`typekeywords:"slug|foo-bar"`);
      expect(args.q).toBe(`NOT id:bc3`);
      expect(args.authentication).toBe(MOCK_AUTH);
    });

    it("passes an undefined q query when no exclusion is provided", async () => {
      const searchSpy = vi
        .spyOn(portalModule as any, "searchItems")
        .mockReturnValue(
          Promise.resolve({
            results: [
              {
                id: "3ef",
                title: "Fake",
                typeKeywords: ["one", "slug|foo-bar"],
              },
            ],
          })
        );

      const results = await slugModule.findItemsBySlug({ slug: "foo-bar" }, {
        authentication: MOCK_AUTH,
      } as any);
      expect(results[0].id).toBe("3ef");
      expect(searchSpy).toHaveBeenCalledTimes(1);
      const args = searchSpy.mock.calls[0][0] as ISearchOptions;
      expect(args.filter).toBe(`typekeywords:"slug|foo-bar"`);
      expect(args.q).not.toBeDefined();
      expect(args.authentication).toBe(MOCK_AUTH);
    });

    it("passes a portal url when no auth is provided", async () => {
      const searchSpy = vi
        .spyOn(portalModule as any, "searchItems")
        .mockReturnValue(
          Promise.resolve({
            results: [
              {
                id: "3ef",
                title: "Fake",
                typeKeywords: ["one", "slug|foo-bar"],
              },
            ],
          })
        );

      const results = await slugModule.findItemsBySlug({ slug: "foo-bar" }, {
        portal: "mock-portal",
      } as any);
      expect(results[0].id).toBe("3ef");
      expect(searchSpy).toHaveBeenCalledTimes(1);
      const args = searchSpy.mock.calls[0][0] as ISearchOptions;
      expect(args.filter).toBe(`typekeywords:"slug|foo-bar"`);
      expect(args.authentication).toBe(undefined);
      expect(args.portal).toBe("mock-portal");
    });

    it("handles when neither portal nor auth are provided", async () => {
      const searchSpy = vi
        .spyOn(portalModule as any, "searchItems")
        .mockReturnValue(
          Promise.resolve({
            results: [
              {
                id: "3ef",
                title: "Fake",
                typeKeywords: ["one", "slug|foo-bar"],
              },
            ],
          })
        );

      const results = await slugModule.findItemsBySlug(
        { slug: "foo-bar" },
        {} as any
      );
      expect(results[0].id).toBe("3ef");
      expect(searchSpy).toHaveBeenCalledTimes(1);
      const args = searchSpy.mock.calls[0][0] as ISearchOptions;
      expect(args.filter).toBe(`typekeywords:"slug|foo-bar"`);
      expect(args.authentication).toBe(undefined);
      expect(args.portal).toBe(undefined);
    });

    it("can re-throw original error", async () => {
      vi.spyOn(portalModule as any, "searchItems").mockImplementation(() => {
        throw new Error("Error occurred");
      });

      try {
        await slugModule.findItemsBySlug({ slug: "foo-bar" }, {
          portal: "mock-portal",
        } as any);
        expect(true).toBe(false);
      } catch (err) {
        const error = err as { message?: string };
        expect(error).toBeDefined();
        expect(error.message).toBe("Error occurred");
      }
    });
  });

  describe("getUniqueSlug:", () => {
    it("returns original if no items found", async () => {
      const searchSpy = vi
        .spyOn(portalModule as any, "searchItems")
        .mockReturnValue(Promise.resolve({ results: [] }));
      const slug = await slugModule.getUniqueSlug({ slug: "foo-bar" }, {
        authentication: MOCK_AUTH,
      } as any);

      expect(searchSpy).toHaveBeenCalledTimes(1);
      const args = searchSpy.mock.calls[0][0] as ISearchOptions;
      expect(args.filter).toBe(`typekeywords:"slug|foo-bar"`);
      expect(args.authentication).toBe(MOCK_AUTH);
      expect(slug).toBe("foo-bar");
    });
    it("excludes item with existingId", async () => {
      const searchSpy = vi
        .spyOn(portalModule as any, "searchItems")
        .mockReturnValue(Promise.resolve({ results: [] }));
      const slug = await slugModule.getUniqueSlug(
        { slug: "foo-bar", existingId: "31c" },
        {
          authentication: MOCK_AUTH,
        } as any
      );

      expect(searchSpy).toHaveBeenCalledTimes(1);
      const args = searchSpy.mock.calls[0][0] as ISearchOptions;
      expect(args.filter).toBe(`typekeywords:"slug|foo-bar"`);
      expect(args.authentication).toBe(MOCK_AUTH);
      expect(args.q).toBe("NOT id:31c");
      expect(slug).toBe("foo-bar");
    });
    it("increments if item found", async () => {
      let callCount = 0;
      const searchSpy = vi
        .spyOn(portalModule as any, "searchItems")
        .mockImplementation(() => {
          const response = {
            results: [] as portalModule.IItem[],
          } as any;
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

      const slug = await slugModule.getUniqueSlug({ slug: "foo-bar" }, {
        authentication: MOCK_AUTH,
      } as any);
      expect(slug).toBe("foo-bar-2");
      expect(searchSpy).toHaveBeenCalledTimes(3);
      const args = searchSpy.mock.calls[0][0] as ISearchOptions;
      expect(args.filter).toBe(`typekeywords:"slug|foo-bar"`);
      const args2 = searchSpy.mock.calls[1][0] as ISearchOptions;
      expect(args2.filter).toBe(`typekeywords:"slug|foo-bar-1"`);
      const args3 = searchSpy.mock.calls[2][0] as ISearchOptions;
      expect(args3.filter).toBe(`typekeywords:"slug|foo-bar-2"`);
    });
    it("re-throws exceptions", async () => {
      const searchSpy = vi
        .spyOn(portalModule as any, "searchItems")
        .mockReturnValue(Promise.reject());

      try {
        await slugModule.getUniqueSlug({ slug: "foo-bar" }, {
          authentication: MOCK_AUTH,
        } as any);
      } catch (ex) {
        const error = ex as { message?: string };
        expect(error).toBeDefined();
        expect(searchSpy).toHaveBeenCalledTimes(1);
      }
    });
  });
});
