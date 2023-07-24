import { IApiDefinition } from "../../../src";
import { getDiscussionsApiDefinition } from "../../../src/search/_internal/commonHelpers/getDiscussionsApiDefinition";

describe("getDiscussionsApiDefinition", () => {
  it("should return expected api definition", () => {
    const result = {
      type: "arcgis-hub",
      url: null,
    } as unknown as IApiDefinition;
    expect(getDiscussionsApiDefinition()).toEqual(result);
  });
});
