import { fetchDraft } from "../../src/drafts/fetch-draft";
import * as _getDraftResourceNameModule from "../../src/drafts/_get-most-recent-draft-name";
import * as upgradeDraftSchemaModule from "../../src/drafts/upgrade-draft-schema";
import * as portalModule from "@esri/arcgis-rest-portal";
import { IHubRequestOptions } from "@esri/hub-common";
import { IDraft } from "@esri/hub-common/src";

describe("fetchDraft", () => {
  const draftName = "draft-12345678.json";
  const siteDraft = ({
    item: {},
    data: { values: { capabilities: [], theme: {} } }
  } as unknown) as IDraft;
  const pageDraft = ({ item: {}, data: { values: {} } } as unknown) as IDraft;

  const schemaUpgradedDraft = ({
    item: { properties: { schemaVersion: 1.4 } },
    data: { values: {} }
  } as unknown) as IDraft;
  const ro = ({
    authentication: "auth",
    portal: "portal"
  } as unknown) as IHubRequestOptions;

  let getDraftNameSpy: jasmine.Spy;
  let getResourceSpy: jasmine.Spy;
  let upgradeSchemaSpy: jasmine.Spy;
  beforeEach(function() {
    getDraftNameSpy = spyOn(
      _getDraftResourceNameModule,
      "_getMostRecentDraftName"
    ).and.returnValue(Promise.resolve(draftName));
    getResourceSpy = spyOn(portalModule, "getItemResource").and.returnValue(
      Promise.resolve(siteDraft)
    );
    upgradeSchemaSpy = spyOn(
      upgradeDraftSchemaModule,
      "upgradeDraftSchema"
    ).and.returnValue(schemaUpgradedDraft);
  });

  it("returns draft if exists", async () => {
    const chk = await fetchDraft("site-id", ro);

    expect(chk).toEqual(schemaUpgradedDraft);
    expect(getDraftNameSpy).toHaveBeenCalledWith("site-id", ro);
    expect(getResourceSpy).toHaveBeenCalledWith("site-id", {
      fileName: draftName,
      readAs: "json",
      authentication: ro.authentication,
      portal: ro.portal
    });
    expect(upgradeSchemaSpy).toHaveBeenCalledWith(siteDraft);
  });

  it("doesnt apply schema migrations if not a site", async () => {
    getResourceSpy.and.returnValue(Promise.resolve(pageDraft));

    const chk = await fetchDraft("site-id", ro);

    expect(chk).toEqual(pageDraft);
    expect(getDraftNameSpy).toHaveBeenCalledWith("site-id", ro);
    expect(getResourceSpy).toHaveBeenCalledWith("site-id", {
      fileName: draftName,
      readAs: "json",
      authentication: ro.authentication,
      portal: ro.portal
    });
    // IMPORTANT...
    expect(upgradeSchemaSpy).not.toHaveBeenCalled();
  });

  it("returns null if not exists", async () => {
    getDraftNameSpy.and.returnValue(Promise.resolve(""));

    const chk = await fetchDraft("site-id", ro);

    expect(chk).toBeNull("returns null");
    expect(getDraftNameSpy).toHaveBeenCalledWith("site-id", ro);
    expect(getResourceSpy).not.toHaveBeenCalled();
    expect(upgradeSchemaSpy).not.toHaveBeenCalled();
  });
});
