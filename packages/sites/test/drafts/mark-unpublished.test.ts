import { markUnpublished, UNPUBLISHED_CHANGES_KW } from "../../src/drafts";
import { IModel, cloneObject } from "@esri/hub-common";

describe("markUnpublished", () => {
  const model = ({
    item: {
      typeKeywords: ["foobarbaz"]
    }
  } as unknown) as IModel;

  it("marks model as not published", async () => {
    const chk = markUnpublished(model);

    expect(chk).not.toBe(model, "returns NEW object");
    expect(chk.item.typeKeywords).toEqual(
      ["foobarbaz", UNPUBLISHED_CHANGES_KW],
      "adds unpublished changes KW"
    );
  });

  it("does nothing if already marked", async () => {
    const localModel = cloneObject(model);
    localModel.item.typeKeywords.push(UNPUBLISHED_CHANGES_KW);

    const chk = markUnpublished(localModel);

    expect(chk).not.toBe(localModel, "returns NEW object");
    expect(chk.item.typeKeywords).toEqual(
      ["foobarbaz", UNPUBLISHED_CHANGES_KW],
      "adds unpublished changes KW"
    );
  });
});
