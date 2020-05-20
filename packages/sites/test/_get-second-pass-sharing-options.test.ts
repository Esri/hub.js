import { _getSecondPassSharingOptions } from "../src";
import { IModel } from "@esri/hub-common";

describe("_getSecondPassSharingOptions", () => {
  it("gets the second pass sharing options", async () => {
    const model = {
      item: {
        properties: {
          contentGroupId: "content-id",
          collaborationGroupId: "collab-id"
        }
      }
    } as IModel;

    const chk = _getSecondPassSharingOptions(model);

    expect(chk).toContain(
      {
        id: "content-id",
        confirmItemControl: false
      },
      "got content group config"
    );
    expect(chk).toContain(
      {
        id: "collab-id",
        confirmItemControl: true
      },
      "got collab group config"
    );
  });

  it("doesnt blow up if things dont exist", async () => {
    const model = {
      item: {
        properties: {
          // nothing
        }
      }
    } as IModel;

    let opts: any[];
    expect(() => {
      opts = _getSecondPassSharingOptions(model);
    }).not.toThrow();
    expect(opts).toEqual([]);
  });
});
