import { IModel } from "../../src/types";
import { IVersion } from "../../src/versioning/types/IVersion";
import { applyVersion } from "../../src/versioning/utils";

describe("applyVersion", () => {
  const model = {
    item: {
      id: "abc123",
      type: "Hub Site Application",
    },
    data: {
      values: {
        foo: "foo",
        bar: "bar",
        layout: "layout",
      },
    },
  } as unknown as IModel;

  const version = {
    data: {
      data: {
        values: {
          foo: "foooooo",
          layout: "this is the versioned layout",
        },
      },
    },
  } as unknown as IVersion;

  it("applies the appropriate data to the model", async () => {
    const result = applyVersion(model, version);

    const expected = {
      ...model,
      data: {
        values: {
          foo: "foo",
          bar: "bar",
          layout: "this is the versioned layout",
        },
      },
    };
    expect(result).toEqual(expected);
  });

  it("applies the appropriate data to the model when provided an includeList", async () => {
    const result = applyVersion(model, version, [
      "data.values.layout",
      "data.values.foo",
    ]);

    const expected = {
      ...model,
      data: {
        values: {
          foo: "foooooo",
          bar: "bar",
          layout: "this is the versioned layout",
        },
      },
    };
    expect(result).toEqual(expected);
  });
});
