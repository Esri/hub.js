import { fetchDraft } from "../../src/drafts/fetch-draft";
import * as _getDraftResourceNameModule from "../../src/drafts/_get-draft-resource-name";
import * as _getJsonResourceModule from "../../src/drafts/_get-json-resource";
import { IHubRequestOptions } from "@esri/hub-common";

describe("fetchDraft", () => {
  const draftName = "draft-12345678.json";
  const draftModel = { my: "draft" };
  const ro = ({
    authentication: "auth",
    portal: "portal"
  } as unknown) as IHubRequestOptions;

  it("returns draft if exists", async () => {
    const getDraftNameSpy = spyOn(
      _getDraftResourceNameModule,
      "_getDraftResourceName"
    ).and.returnValue(Promise.resolve(draftName));
    const getResourceSpy = spyOn(
      _getJsonResourceModule,
      "_getJsonResource"
    ).and.returnValue(Promise.resolve(draftModel));

    const chk = await fetchDraft("site-id", ro);

    expect(chk).toEqual(draftModel);
    expect(getDraftNameSpy).toHaveBeenCalledWith("site-id", ro);
    expect(getResourceSpy).toHaveBeenCalledWith("site-id", draftName, {
      authentication: ro.authentication,
      portal: ro.portal
    });
  });

  it("returns null if not exists", async () => {
    const getDraftNameSpy = spyOn(
      _getDraftResourceNameModule,
      "_getDraftResourceName"
    ).and.returnValue(Promise.resolve(""));
    const getResourceSpy = spyOn(
      _getJsonResourceModule,
      "_getJsonResource"
    ).and.returnValue(Promise.resolve(draftModel));

    const chk = await fetchDraft("site-id", ro);

    expect(chk).toBeNull("returns null");
    expect(getDraftNameSpy).toHaveBeenCalledWith("site-id", ro);
    expect(getResourceSpy).not.toHaveBeenCalled();
  });
});
