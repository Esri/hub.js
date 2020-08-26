import {
  hasUnpublishedChanges,
  UNPUBLISHED_CHANGES_KW
} from "../../src/drafts";
import { IModel } from "@esri/hub-common";

describe("hasUnpublishedChanges", () => {
  it("correctly identifies models marked with unpublished changes", async () => {
    const modelWithChanges = ({
      item: {
        typeKeywords: [UNPUBLISHED_CHANGES_KW]
      }
    } as unknown) as IModel;
    const modelNoChanges = ({
      item: {
        typeKeywords: []
      }
    } as unknown) as IModel;

    expect(hasUnpublishedChanges(modelWithChanges)).toBeTruthy();
    expect(hasUnpublishedChanges(modelNoChanges)).toBeFalsy();
  });
});
