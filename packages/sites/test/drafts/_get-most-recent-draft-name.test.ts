import { _getMostRecentDraftName } from "../../src/drafts";
import * as getDraftNameModule from "../../src/drafts/_get-draft-resource-names";
import * as portalModule from "@esri/arcgis-rest-portal";
import { IHubRequestOptions, IModel } from "@esri/hub-common";

describe("_getMostRecentDraftName", () => {
  const draftResourceNames = [
    "draft-444444444.json",
    "draft-222222222.json",
    "draft-111111111.json",
    "draft-333333333.json"
  ];
  const ro = ({
    portal: "my-portal",
    authentication: "my-auth"
  } as unknown) as IHubRequestOptions;

  let getDraftSpy: jasmine.Spy;
  beforeEach(function() {
    getDraftSpy = spyOn(
      getDraftNameModule,
      "_getDraftResourceNames"
    ).and.returnValue(Promise.resolve(draftResourceNames));
  });

  it("resolves to the most recent draft name", async () => {
    const chk = await _getMostRecentDraftName("1234", ro);
    expect(chk).toEqual("draft-111111111.json");
  });
});
