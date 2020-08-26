import { fetchAndApplyDraft } from "../../src/drafts/fetch-and-apply-draft";
import * as fetchDraftModule from "../../src/drafts/fetch-draft";
import * as applyDraftModule from "../../src/drafts/apply-draft";
import { IHubRequestOptions, IModel } from "@esri/hub-common";

describe("fetchAndApplyDraft", () => {
  it("fetches and applies a draft", async () => {
    const draftModel = { my: "draft" };
    const fetchDraftSpy = spyOn(fetchDraftModule, "fetchDraft").and.returnValue(
      Promise.resolve(draftModel)
    );
    const applyDraftSpy = spyOn(applyDraftModule, "applyDraft").and.returnValue(
      draftModel
    );

    const ro = { isPortal: false } as IHubRequestOptions;

    const siteModel = ({ my: "site", item: { id: "id" } } as unknown) as IModel;

    const chk = await fetchAndApplyDraft(siteModel, ro);

    expect(fetchDraftSpy).toHaveBeenCalledWith("id", ro);
    expect(applyDraftSpy).toHaveBeenCalledWith(siteModel, draftModel, false);
    expect(chk).toEqual(draftModel);
  });
});
