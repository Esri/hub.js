import { serializeItemParams } from "../../../../src/rest/portal/_internal/helpers";

describe("serializeItemParams", () => {
  it("should serialize item params correctly", () => {
    const requestOptions = {
      params: { someParam: "someValue" },
      item: {
        id: "123",
        title: "Test Item",
        data: "test",
      },
    } as any;

    const result = serializeItemParams(requestOptions);

    expect((result as any).params).toEqual({
      someParam: "someValue",
      id: "123",
      title: "Test Item",
      text: requestOptions.item.data,
    });
  });
});
