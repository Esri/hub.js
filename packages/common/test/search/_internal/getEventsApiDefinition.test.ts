import { IApiDefinition } from "../../../src";
import { getEventsApiDefinition } from "../../../src/search/_internal/commonHelpers/getEventsApiDefinition";

describe("getDiscussionsApiDefinition", () => {
  it("should return expected api definition", () => {
    const result = {
      type: "arcgis-hub",
      url: null,
    } as unknown as IApiDefinition;
    expect(getEventsApiDefinition()).toEqual(result);
  });
});
