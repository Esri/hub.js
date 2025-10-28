import * as fetchMock from "fetch-mock";
import { getModel } from "../../src/models/getModel";

afterEach(() => {
  fetchMock.restore();
});

describe("getModel", () => {
  it("fetches item and data", async () => {
    fetchMock
      .get("end:items/some-id?f=json", { id: "some-id" })
      .get("end:items/some-id/data?f=json", { prop: "im-a-prop" });

    const model = await getModel("some-id", {});

    expect(fetchMock.done()).toBeTruthy();
    expect(model.item.id).toEqual("some-id");
    expect(model.data.prop).toEqual("im-a-prop");
  });
});
import * as fetchMock from "fetch-mock";
import { getModel } from "../../src/models/getModel";
import { afterEach, describe, expect, it } from "vitest";

describe("getModel", function () {
  afterEach(() => {
    const fm: any = fetchMock as any;
    fm.restore();
  });

  it("fetches item and data", async function () {
    const fm: any = fetchMock as any;
    fm.get("end:items/some-id?f=json", { id: "some-id" }).get(
      "end:items/some-id/data?f=json",
      { prop: "im-a-prop" }
    );

    const model = await getModel("some-id", {} as any);

    expect(fm.done()).toBeTruthy();
    expect(model.item.id).toEqual("some-id");
    expect(model.data.prop).toEqual("im-a-prop");
  });
});
