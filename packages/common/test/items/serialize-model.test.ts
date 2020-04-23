import { IModel, serializeModel } from "../../src";

describe("serializeModel", function() {
  it("serializes the model", function() {
    const model: IModel = {
      item: {
        id: "someId",
        owner: "owner",
        created: 123,
        modified: 123,
        tags: [],
        numViews: 3,
        size: 3,
        title: "title",
        type: "Hub Site Application"
      },
      data: { foo: "bar", baz: { boop: "beep" } }
    };

    const serialized = serializeModel(model);

    expect(serialized.text).toEqual(`{"foo":"bar","baz":{"boop":"beep"}}`);
  });
});
