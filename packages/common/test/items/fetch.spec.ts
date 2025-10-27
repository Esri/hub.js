vi.mock(
  "@esri/arcgis-rest-portal",
  async (importOriginal) =>
    ({
      ...(await importOriginal()),
      getItem: vi.fn(),
    } as any)
);

import * as portalModule from "@esri/arcgis-rest-portal";
import * as slugModule from "../../src/items/slugs";
import * as _internalSlugModule from "../../src/items/_internal/slugs";
import { fetchItem } from "../../src/items/fetch";
import { MOCK_AUTH } from "../groups/add-users-workflow/fixtures";

afterEach(() => vi.restoreAllMocks());

describe("fetchItem", () => {
  const authentication = MOCK_AUTH;
  const siteOrgKey = "site-org";
  const requestOptions = {
    authentication,
    siteOrgKey,
  };
  it("calls getItem with id when identifier is or contains an id", async () => {
    const identifier = "67be0486253a423891042361843d1b0a";
    const id = identifier;
    const parsedIdentifier = {
      id,
    };
    const item = {
      id,
    } as any as portalModule.IItem;
    const parseIdentifierSpy = vi
      .spyOn(_internalSlugModule as any, "parseIdentifier")
      .mockReturnValue(parsedIdentifier);
    const getItemSpy = vi
      .spyOn(portalModule as any, "getItem")
      .mockResolvedValue(item);

    const result = await fetchItem(identifier, requestOptions);

    expect(result).toBe(item);
    expect((parseIdentifierSpy as any).mock.calls.length).toBe(1);
    expect((parseIdentifierSpy as any).mock.calls[0][0]).toBe(identifier);
    expect((getItemSpy as any).mock.calls.length).toBe(1);
    expect((getItemSpy as any).mock.calls[0][0]).toBe(identifier);
  });
  describe("when identifier is a slug w/ no id", () => {
    const slug = "some-slug";
    const orgKey = "some-org";
    const searchResult = {
      id: "3ef",
    };
    const item = searchResult as any as portalModule.IItem;
    it("returns first item found by slug w/ org key", async () => {
      const identifier = `${orgKey}::${slug}`;
      const parsedIdentifier = {
        slug,
        orgKey,
      };
      const slugInfo = { slug: `${orgKey}|${slug}` };
      const parseIdentifierSpy = vi
        .spyOn(_internalSlugModule as any, "parseIdentifier")
        .mockReturnValue(parsedIdentifier);
      const findItemsBySlugSpy = vi
        .spyOn(slugModule as any, "findItemsBySlug")
        .mockResolvedValue([searchResult]);
      const getItemSpy = vi
        .spyOn(portalModule as any, "getItem")
        .mockResolvedValue(item);

      const result = await fetchItem(identifier, requestOptions);

      expect(result).toBe(item);
      expect((parseIdentifierSpy as any).mock.calls.length).toBe(1);
      expect((parseIdentifierSpy as any).mock.calls[0][0]).toBe(identifier);
      expect((findItemsBySlugSpy as any).mock.calls.length).toBe(1);
      expect((findItemsBySlugSpy as any).mock.calls[0][0]).toEqual(slugInfo);
      expect((getItemSpy as any).mock.calls.length).toBe(1);
      expect((getItemSpy as any).mock.calls[0][0]).toBe(searchResult.id);
    });
    it('falls back to "siteOrgKey" when org key is missing from slug', async () => {
      const identifier = slug;
      const parsedIdentifier = {
        slug,
      };
      const slugInfo = { slug: `${siteOrgKey}|${slug}` };
      const parseIdentifierSpy = vi
        .spyOn(_internalSlugModule as any, "parseIdentifier")
        .mockReturnValue(parsedIdentifier);
      const findItemsBySlugSpy = vi
        .spyOn(slugModule as any, "findItemsBySlug")
        .mockResolvedValue([searchResult]);
      const getItemSpy = vi
        .spyOn(portalModule as any, "getItem")
        .mockResolvedValue(item);

      const result = await fetchItem(identifier, requestOptions);

      expect(result).toBe(item);
      expect((parseIdentifierSpy as any).mock.calls.length).toBe(1);
      expect((parseIdentifierSpy as any).mock.calls[0][0]).toBe(identifier);
      expect((findItemsBySlugSpy as any).mock.calls.length).toBe(1);
      expect((findItemsBySlugSpy as any).mock.calls[0][0]).toEqual(slugInfo);
      expect((getItemSpy as any).mock.calls.length).toBe(1);
      expect((getItemSpy as any).mock.calls[0][0]).toBe(searchResult.id);
    });
    it("returns null if no item found by slug", async () => {
      const identifier = `${orgKey}::${slug}`;
      const parsedIdentifier = {
        slug,
        orgKey,
      };
      const slugInfo = { slug: `${orgKey}|${slug}` };
      const parseIdentifierSpy = vi
        .spyOn(_internalSlugModule as any, "parseIdentifier")
        .mockReturnValue(parsedIdentifier);
      const findItemsBySlugSpy = vi
        .spyOn(slugModule as any, "findItemsBySlug")
        .mockResolvedValue([]);
      const getItemSpy = vi
        .spyOn(portalModule as any, "getItem")
        .mockResolvedValue(item);

      const result = await fetchItem(identifier, requestOptions);

      expect(result).toBeNull();
      expect((parseIdentifierSpy as any).mock.calls.length).toBe(1);
      expect((parseIdentifierSpy as any).mock.calls[0][0]).toBe(identifier);
      expect((findItemsBySlugSpy as any).mock.calls.length).toBe(2);
      expect((findItemsBySlugSpy as any).mock.calls[0][0]).toEqual(slugInfo);
      expect((findItemsBySlugSpy as any).mock.calls[1][0]).toEqual({ slug });
      expect((getItemSpy as any).mock.calls.length).toBe(0);
    });
  });
});
// make ESM namespace spyable
vi.mock("@esri/arcgis-rest-portal", async (importOriginal: any) => {
  const mod = await importOriginal();
  return Object.assign({}, mod, {
    getItem: vi.fn(),
    searchItems: vi.fn(),
  });
});

import * as portalModule from "@esri/arcgis-rest-portal";
import * as slugModule from "../../src/items/slugs";
import * as _internalSlugModule from "../../src/items/_internal/slugs";
import { fetchItem } from "../../src/items/fetch";
import { MOCK_AUTH } from "../groups/add-users-workflow/fixtures";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("fetchItem", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const authentication = MOCK_AUTH;
  const siteOrgKey = "site-org";
  const requestOptions = {
    authentication,
    siteOrgKey,
  } as any;

  it("calls getItem with id when identifier is or contains an id", async () => {
    const identifier = "67be0486253a423891042361843d1b0a";
    const id = identifier;
    const parsedIdentifier = {
      id,
    };
    const item = {
      id,
    } as any as portalModule.IItem;
    const parseIdentifierSpy = vi
      .spyOn(_internalSlugModule as any, "parseIdentifier")
      .mockReturnValue(parsedIdentifier);
    const getItemSpy = vi
      .spyOn(portalModule as any, "getItem")
      .mockReturnValue(Promise.resolve(item));

    const result = await fetchItem(identifier, requestOptions);

    expect(result).toBe(item);
    expect(parseIdentifierSpy).toHaveBeenCalledTimes(1);
    expect(parseIdentifierSpy).toHaveBeenCalledWith(identifier);
    expect(getItemSpy).toHaveBeenCalledTimes(1);
    expect(getItemSpy).toHaveBeenCalledWith(identifier, requestOptions);
  });

  describe("when identifier is a slug w/ no id", () => {
    const slug = "some-slug";
    const orgKey = "some-org";
    const searchResult = {
      id: "3ef",
    };
    const item = searchResult as any as portalModule.IItem;
    it("returns first item found by slug w/ org key", async () => {
      const identifier = `${orgKey}::${slug}`;
      const parsedIdentifier = {
        slug,
        orgKey,
      };
      const slugInfo = { slug: `${orgKey}|${slug}` };
      const parseIdentifierSpy = vi
        .spyOn(_internalSlugModule as any, "parseIdentifier")
        .mockReturnValue(parsedIdentifier);
      const findItemsBySlugSpy = vi
        .spyOn(slugModule as any, "findItemsBySlug")
        .mockReturnValue(Promise.resolve([searchResult]));
      const getItemSpy = vi
        .spyOn(portalModule as any, "getItem")
        .mockReturnValue(Promise.resolve(item));

      const result = await fetchItem(identifier, requestOptions);

      expect(result).toBe(item);
      expect(parseIdentifierSpy).toHaveBeenCalledTimes(1);
      expect(parseIdentifierSpy).toHaveBeenCalledWith(identifier);
      expect(findItemsBySlugSpy).toHaveBeenCalledTimes(1);
      expect(findItemsBySlugSpy).toHaveBeenCalledWith(slugInfo, requestOptions);
      expect(getItemSpy).toHaveBeenCalledTimes(1);
      expect(getItemSpy).toHaveBeenCalledWith(searchResult.id, requestOptions);
    });
    it('falls back to "siteOrgKey" when org key is missing from slug', async () => {
      const identifier = slug;
      const parsedIdentifier = {
        slug,
      };
      const slugInfo = { slug: `${siteOrgKey}|${slug}` };
      const parseIdentifierSpy = vi
        .spyOn(_internalSlugModule as any, "parseIdentifier")
        .mockReturnValue(parsedIdentifier);
      const findItemsBySlugSpy = vi
        .spyOn(slugModule as any, "findItemsBySlug")
        .mockReturnValue(Promise.resolve([searchResult]));
      const getItemSpy = vi
        .spyOn(portalModule as any, "getItem")
        .mockReturnValue(Promise.resolve(item));

      const result = await fetchItem(identifier, requestOptions);

      expect(result).toBe(item);
      expect(parseIdentifierSpy).toHaveBeenCalledTimes(1);
      expect(parseIdentifierSpy).toHaveBeenCalledWith(identifier);
      expect(findItemsBySlugSpy).toHaveBeenCalledTimes(1);
      expect(findItemsBySlugSpy).toHaveBeenCalledWith(slugInfo, requestOptions);
      expect(getItemSpy).toHaveBeenCalledTimes(1);
      expect(getItemSpy).toHaveBeenCalledWith(searchResult.id, requestOptions);
    });
    it("returns null if no item found by slug", async () => {
      const identifier = `${orgKey}::${slug}`;
      const parsedIdentifier = {
        slug,
        orgKey,
      };
      const slugInfo = { slug: `${orgKey}|${slug}` };
      const parseIdentifierSpy = vi
        .spyOn(_internalSlugModule as any, "parseIdentifier")
        .mockReturnValue(parsedIdentifier);
      const findItemsBySlugSpy = vi
        .spyOn(slugModule as any, "findItemsBySlug")
        .mockReturnValue(Promise.resolve([]));
      const getItemSpy = vi
        .spyOn(portalModule as any, "getItem")
        .mockReturnValue(Promise.resolve(item));

      const result = await fetchItem(identifier, requestOptions);

      expect(result).toBeNull();
      expect(parseIdentifierSpy).toHaveBeenCalledTimes(1);
      expect(parseIdentifierSpy).toHaveBeenCalledWith(identifier);
      expect(findItemsBySlugSpy).toHaveBeenCalledTimes(2);
      expect(findItemsBySlugSpy).toHaveBeenCalledWith(slugInfo, requestOptions);
      expect(findItemsBySlugSpy).toHaveBeenCalledWith({ slug }, requestOptions);
      expect(getItemSpy).toHaveBeenCalledTimes(0);
    });
  });
});
