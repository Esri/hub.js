import { getShortenedCategories } from "../../src/content/_internal/internalContentUtils";

describe("getShortenedCategories", () => {
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
});
