import {
  CANNOT_DISCUSS,
  isDiscussable,
  setDiscussableKeyword,
} from "../../src";

describe("discussions utils", () => {
  describe("isDiscussable", () => {
    it("returns true if CANNOT_DISCUSS is not present", () => {
      const subject = {
        typeKeywords: ["some keyword"],
      };
      const result = isDiscussable(subject);
      expect(result).toBeTruthy();
    });
    it("returns false if CANNOT_DISCUSS is present", () => {
      const subject = {
        typeKeywords: [CANNOT_DISCUSS],
      };
      const result = isDiscussable(subject);
      expect(result).toBeFalsy();
    });
    it("returns true if typeKeywords property does not exist", () => {
      const subject = {};
      const result = isDiscussable(subject);
      expect(result).toBeTruthy();
    });
  });
  describe("setDiscussableKeyword", () => {
    it("returns array without CANNOT_DISCUSS when isDiscussable is true", () => {
      const result = setDiscussableKeyword([CANNOT_DISCUSS], true);
      expect(result).toEqual([]);
    });
    it("returns array with CANNOT_DISCUSS when isDiscussable is false", () => {
      const result = setDiscussableKeyword([], false);
      expect(result).toEqual([CANNOT_DISCUSS]);
    });
  });
});
