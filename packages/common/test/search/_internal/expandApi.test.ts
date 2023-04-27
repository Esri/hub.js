import { expandApi } from "../../../src/search/_internal/commonHelpers/expandApi";

describe("expandApi", () => {
  it("passes through objects", () => {
    const chk = expandApi({
      url: "https://my.enterprise.com/instance",
      type: "arcgis",
    });
    expect(chk.type).toBe("arcgis");
  });
});
