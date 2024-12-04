import * as portalModule from "@esri/arcgis-rest-portal";
import * as slugModule from "../../src/items/slugs";
import * as _internalSlugModule from "../../src/items/_internal/slugs";
import { fetchItem } from "../../src/items/fetch";
import { MOCK_AUTH } from "../groups/add-users-workflow/fixtures";

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
    const parseIdentifierSpy = spyOn(
      _internalSlugModule,
      "parseIdentifier"
    ).and.returnValue(parsedIdentifier);
    const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
      Promise.resolve(item)
    );

    const result = await fetchItem(identifier, requestOptions);

    expect(result).toBe(item);
    expect(parseIdentifierSpy.calls.count()).toBe(1);
    expect(parseIdentifierSpy).toHaveBeenCalledWith(identifier);
    expect(getItemSpy.calls.count()).toBe(1);
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
      const parseIdentifierSpy = spyOn(
        _internalSlugModule,
        "parseIdentifier"
      ).and.returnValue(parsedIdentifier);
      const findItemsBySlugSpy = spyOn(
        slugModule,
        "findItemsBySlug"
      ).and.returnValue(Promise.resolve([searchResult]));
      const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve(item)
      );

      const result = await fetchItem(identifier, requestOptions);

      expect(result).toBe(item);
      expect(parseIdentifierSpy.calls.count()).toBe(1);
      expect(parseIdentifierSpy).toHaveBeenCalledWith(identifier);
      expect(findItemsBySlugSpy.calls.count()).toBe(1);
      expect(findItemsBySlugSpy).toHaveBeenCalledWith(slugInfo, requestOptions);
      expect(getItemSpy.calls.count()).toBe(1);
      expect(getItemSpy).toHaveBeenCalledWith(searchResult.id, requestOptions);
    });
    it('falls back to "siteOrgKey" when org key is missing from slug', async () => {
      const identifier = slug;
      const parsedIdentifier = {
        slug,
      };
      const slugInfo = { slug: `${siteOrgKey}|${slug}` };
      const parseIdentifierSpy = spyOn(
        _internalSlugModule,
        "parseIdentifier"
      ).and.returnValue(parsedIdentifier);
      const findItemsBySlugSpy = spyOn(
        slugModule,
        "findItemsBySlug"
      ).and.returnValue(Promise.resolve([searchResult]));
      const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve(item)
      );

      const result = await fetchItem(identifier, requestOptions);

      expect(result).toBe(item);
      expect(parseIdentifierSpy.calls.count()).toBe(1);
      expect(parseIdentifierSpy).toHaveBeenCalledWith(identifier);
      expect(findItemsBySlugSpy.calls.count()).toBe(1);
      expect(findItemsBySlugSpy).toHaveBeenCalledWith(slugInfo, requestOptions);
      expect(getItemSpy.calls.count()).toBe(1);
      expect(getItemSpy).toHaveBeenCalledWith(searchResult.id, requestOptions);
    });
    it("returns null if no item found by slug", async () => {
      const identifier = `${orgKey}::${slug}`;
      const parsedIdentifier = {
        slug,
        orgKey,
      };
      const slugInfo = { slug: `${orgKey}|${slug}` };
      const parseIdentifierSpy = spyOn(
        _internalSlugModule,
        "parseIdentifier"
      ).and.returnValue(parsedIdentifier);
      const findItemsBySlugSpy = spyOn(
        slugModule,
        "findItemsBySlug"
      ).and.returnValue(Promise.resolve([]));
      const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve(item)
      );

      const result = await fetchItem(identifier, requestOptions);

      expect(result).toBeNull();
      expect(parseIdentifierSpy.calls.count()).toBe(1);
      expect(parseIdentifierSpy).toHaveBeenCalledWith(identifier);
      expect(findItemsBySlugSpy.calls.count()).toBe(1);
      expect(findItemsBySlugSpy).toHaveBeenCalledWith(slugInfo, requestOptions);
      expect(getItemSpy.calls.count()).toBe(0);
    });
  });
});
