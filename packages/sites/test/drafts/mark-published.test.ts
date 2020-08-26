import { markPublished, UNPUBLISHED_CHANGES_KW } from "../../src/drafts";
import { IModel } from "@esri/hub-common";

describe("markPublished", () => {
  it("marks model as published", async () => {
    const model = ({
      item: {
        typeKeywords: ["foobarbaz", UNPUBLISHED_CHANGES_KW]
      }
    } as unknown) as IModel;

    const chk = markPublished(model);

    expect(chk).not.toBe(model, "returns NEW object");
    expect(chk.item.typeKeywords).toEqual(
      ["foobarbaz"],
      "removes unpublished changes KW"
    );
  });
});
