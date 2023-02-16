import { IModel } from "../../src/types";
import { getVersionData } from "../../src/versioning/_internal/getVersionData";

describe("getVersionData", () => {
  it("returns expected data", async () => {
    const model = {
      item: {
        id: "abc123",
        type: "Hub Site Application",
      },
      data: {
        values: {
          foo: "foo",
          bar: "bar",
        },
      },
    } as unknown as IModel;
    const result = getVersionData(model, [
      "data.values.foo",
      "item.id",
      "foo.bar.baz",
    ]);
    const expected = {
      item: {
        id: "abc123",
      },
      data: {
        values: {
          foo: "foo",
        },
      },
    };
    expect(result).toEqual(expected);
  });
});
