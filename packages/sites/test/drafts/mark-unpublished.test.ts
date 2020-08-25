import { markUnpublished, UNPUBLISHED_CHANGES_KW } from "../../src/drafts";
import { IModel } from "@esri/hub-common";

describe("markUnpublished", () => {
  it("marks model as not published", async () => {
    const model = ({
      item: {
        typeKeywords: ["foobarbaz"]
      }
    } as unknown) as IModel;

    const chk = markUnpublished(model);

    expect(chk).not.toBe(model, "returns NEW object");
    expect(chk.item.typeKeywords).toEqual(
      ["foobarbaz", UNPUBLISHED_CHANGES_KW],
      "adds unpublished changes KW"
    );
  });
});
