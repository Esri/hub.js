import { _mergeLocalChanges } from "../src";
import { IModel } from "@esri/hub-common";

describe("_mergeLocalChanges", () => {
  it("only applies the extant allow-list props to upstream", async () => {
    const local = ({
      item: {
        bleep: "blop"
      },
      data: {
        foo: "bar",
        baz: "boop"
      }
    } as unknown) as IModel;

    const upstream = {
      item: {},
      data: {}
    } as IModel;

    const allowList = ["data.foo", "item.bleep", "item.noexist"];

    expect(_mergeLocalChanges(local, upstream, allowList)).toEqual(({
      item: {
        bleep: "blop"
      },
      data: {
        foo: "bar"
      }
    } as unknown) as IModel);
  });

  it("returns local copy if no allow list", async () => {
    const local = ({
      item: {
        bleep: "blop"
      },
      data: {
        foo: "bar",
        baz: "boop"
      }
    } as unknown) as IModel;

    const upstream = {
      item: {},
      data: {}
    } as IModel;

    const allowList: string[] = null;

    expect(_mergeLocalChanges(local, upstream, allowList)).toEqual(local);
  });
});
