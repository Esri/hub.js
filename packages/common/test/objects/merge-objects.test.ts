import { mergeObjects } from "../../src/objects/merge-objects";

describe("mergeObjects", () => {
  it("only applies the extant allow-list props to upstream", async () => {
    const local = {
      item: {
        bleep: "blop"
      },
      data: {
        foo: "bar",
        baz: "boop"
      }
    };

    const upstream = {
      item: {},
      data: {}
    };

    const allowList = ["data.foo", "item.bleep", "item.noexist"];

    expect(mergeObjects(local, upstream, allowList)).toEqual({
      item: {
        bleep: "blop"
      },
      data: {
        foo: "bar"
      }
    });
  });

  it("returns local copy if no allow list", async () => {
    const local = {
      item: {
        bleep: "blop"
      },
      data: {
        foo: "bar",
        baz: "boop"
      }
    } as unknown;

    const upstream = {
      item: {},
      data: {}
    };

    const allowList: string[] = null;

    expect(mergeObjects(local, upstream, allowList)).toEqual(local);
  });
});
