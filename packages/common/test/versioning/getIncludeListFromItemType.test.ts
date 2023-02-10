import { IModel } from "../../src/types";
import { getIncludeListFromItemType } from "../../src/versioning/_internal/getIncludeListFromItemType";

describe("getIncludeListFromItemType", () => {
  it("throws for unsupported entity type", async () => {
    const model = {
      item: {},
    } as IModel;
    expect(() => getIncludeListFromItemType(model)).toThrowError(
      "Entity type does not support versioning"
    );
  });

  it("returns the appropriate include list for site", async () => {
    const model = {
      item: {
        type: "Hub Site Application",
      },
    } as IModel;
    const result = getIncludeListFromItemType(model);
    const expected = [
      "data.values.layout",
      "data.values.theme",
      "data.values.headContent",
    ];
    expect(result).toEqual(expected);
  });

  it("returns the appropriate include list for page", async () => {
    const model = {
      item: {
        type: "Hub Page",
      },
    } as IModel;
    const result = getIncludeListFromItemType(model);
    const expected = ["data.values.layout", "data.values.headContent"];
    expect(result).toEqual(expected);
  });
});
