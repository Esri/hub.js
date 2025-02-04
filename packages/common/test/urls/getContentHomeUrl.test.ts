import { getContentHomeUrl } from "../../src/urls/getContentHomeUrl";

describe("getContentHomeUrl", () => {
  it("returns content home url", () => {
    const result = getContentHomeUrl("https://portal.com");
    expect(result).toEqual("https://portal.com/home/content.html");
  });
});
