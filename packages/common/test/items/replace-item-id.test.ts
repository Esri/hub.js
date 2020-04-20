import { replaceItemId } from "../../src";

describe("replaceItemId", function() {
  it("replaces an item id", function() {
    const itemId = "12345";

    const itemModel = {
      item: {
        id: itemId
      },
      data: {
        ownid: itemId
      }
    };

    const replaced = replaceItemId(itemModel, itemId);

    expect(replaced).toEqual({
      item: {
        id: "{{appid}}"
      },
      data: {
        ownid: "{{appid}}"
      }
    });
  });

  it("can override default replacement", function() {
    const itemId = "12345";

    const itemModel = {
      item: {
        id: itemId
      },
      data: {
        ownid: itemId
      }
    };

    const overridenVal = "overridden-val";
    const replaced = replaceItemId(itemModel, itemId, overridenVal);

    expect(replaced).toEqual({
      item: {
        id: overridenVal
      },
      data: {
        ownid: overridenVal
      }
    });
  });
});
