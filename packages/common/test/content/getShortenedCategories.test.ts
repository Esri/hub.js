import { getShortenedCategories } from "../../src/content/_internal/internalContentUtils";

describe("getShortenedCategories", () => {
  beforeAll(() => {
    // suppress deprecation warnings
    // tslint:disable-next-line: no-empty
    spyOn(console, "warn").and.callFake(() => {});
  });
  it("returns an empty array when no categories are provided", () => {
    const result = getShortenedCategories([]);
    expect(result).toEqual([]);
  });
  it("returns the shortened categories", () => {
    const mockCategories = [
      "/categories/infrastructure/agriculture",
      "/categories/imagery",
    ];
    const result = getShortenedCategories(mockCategories);
    expect(result).toEqual(["agriculture", "imagery"]);
  });
  it("removes empty categories", () => {
    const mockCategories = [
      "/categories/infrastructure/agriculture",
      "/categories/imagery",
      "",
    ];
    const result = getShortenedCategories(mockCategories);
    expect(result).toEqual(["agriculture", "imagery"]);
  });
});
