import { _getMostRecentDraftName } from "../../src/drafts";
import * as getDraftNameModule from "../../src/drafts/_get-draft-resource-names";
import { IHubRequestOptions } from "@esri/hub-common";

describe("_getMostRecentDraftName", () => {
  const draftResourceNames = [
    "draft-1601501122.json",
    "draft-1599773122.json",
    "draft-968621122.json",
    "draft-968621122.json",
    "draft-1599773123.json",
  ];
  const ro = {
    portal: "my-portal",
    authentication: "my-auth",
  } as unknown as IHubRequestOptions;

  let getDraftSpy: jasmine.Spy;
  beforeEach(function () {
    getDraftSpy = spyOn(
      getDraftNameModule,
      "_getDraftResourceNames"
    ).and.returnValue(Promise.resolve(draftResourceNames));
  });

  it("resolves to the most recent draft name", async () => {
    const chk = await _getMostRecentDraftName("1234", ro);
    expect(chk).toEqual("draft-1601501122.json");
  });

  it("doesn't blow up with empty array", async () => {
    getDraftSpy.and.returnValue(Promise.resolve([]));
    try {
      await _getMostRecentDraftName("1234", ro);
    } catch {
      fail("shouldnt reject");
    }
  });
});
