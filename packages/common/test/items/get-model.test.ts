import { getModel } from "../../src";
import * as fetchMock from "fetch-mock";

describe("getModel", function() {
  afterEach(fetchMock.restore);

  it("fetches item and data", async function() {
    fetchMock
      .get("end:items/some-id?f=json", { id: "some-id" })
      .get("end:items/some-id/data?f=json", { prop: "im-a-prop" });

    const model = await getModel("some-id", {});

    expect(fetchMock.done()).toBeTruthy(
      "Fetch got called the expected number of times"
    );
    expect(model.item.id).toEqual("some-id", "Item loaded");
    expect(model.data.prop).toEqual("im-a-prop", "Data loaded");
  });
});
