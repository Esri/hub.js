import { EntityType } from "../../src";
import {
  getWellKnownCatalog,
  getWellknownCollections,
  WellKnownCollection,
} from "../../src/search/wellKnownCatalog";
import { mockUser } from "../test-helpers/fake-user";

describe("getWellKnownCatalog", () => {
  it("returns the expected catalog", () => {
    const chk = getWellKnownCatalog("myContent", "item", mockUser);
    expect(chk.scopes).toBeDefined();
    expect(chk.scopes?.item?.filters).toEqual([
      { predicates: [{ owner: "vader" }] },
    ]);
    expect(chk.collections?.length).toBe(6);
  });
  it("throws if not passed a user for a catalog that requires it", () => {
    expect(() => getWellKnownCatalog("myContent", "item")).toThrowError(
      'User needed to get "myContent" catalog'
    );
    expect(() => getWellKnownCatalog("favorites", "item")).toThrowError(
      'User needed to get "favorites" catalog'
    );
  });
  it("does not throw if not passed a user for a catalog that does not require it", () => {
    const chk = getWellKnownCatalog("organization", "item");
    expect(chk.scopes).toBeDefined();
    expect(chk.scopes?.item?.filters).toEqual([
      { predicates: [{ access: "org" }] },
    ]);
    expect(chk.collections?.length).toBe(6);
  });
  it("throws if passed an invalid entity type", () => {
    expect(() =>
      getWellKnownCatalog("myContent", "villain" as EntityType)
    ).toThrowError('Wellknown catalog not implemented for "villain"');
  });
  it("returns the catalog with specific collection requested", () => {
    const chk = getWellKnownCatalog("organization", "item", undefined, [
      "document",
      "feedback",
    ]);
    expect(chk.collections?.length).toBe(2);
  });
  it("returns no collections if passed an invalid collection name ", () => {
    const chk = getWellKnownCatalog("organization", "item", undefined, [
      "fakeContent" as WellKnownCollection,
    ]);
    expect(chk.collections?.length).toBe(0);
  });
});

describe("getWellknownCollections", () => {
  it("returns the default collections", () => {
    const chk = getWellknownCollections("item");
    expect(chk.length).toBe(6);
    expect(chk[1].scope.filters[0].predicates[0].type).toEqual([
      "CSV Collection",
      "CSV",
      "Feature Collection",
      "Feature Layer",
      "File Geodatabase",
      "GeoJSON",
      "GeoJson",
      "KML Collection",
      "KML",
      "Shapefile",
      "Stream Service",
      "Table",
      "Image Service",
    ]);
  });
  it("returns the catalog with specific collection requested", () => {
    const chk = getWellKnownCatalog("organization", "item", undefined, [
      "appAndMap",
      "dataset",
      "template",
    ]);
    expect(chk.collections?.length).toBe(3);
  });
});
