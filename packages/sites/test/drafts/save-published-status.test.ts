import { savePublishedStatus, UNPUBLISHED_CHANGES_KW } from "../../src/drafts";
import * as pagesModule from "../../src/pages";
import * as updateSiteModule from "../../src/update-site";
import { getSiteItemType, getPageItemType } from "../../src";
import { IHubRequestOptions, IModel, cloneObject } from "@esri/hub-common";

describe("savePublishedStatus", () => {
  const ro = {
    isPortal: false
  } as IHubRequestOptions;

  const siteModel = {
    item: {
      type: getSiteItemType(ro.isPortal),
      typeKeywords: [UNPUBLISHED_CHANGES_KW]
    },
    data: {}
  } as IModel;

  const pageModel = {
    item: {
      type: getPageItemType(ro.isPortal),
      typeKeywords: [UNPUBLISHED_CHANGES_KW]
    },
    data: {}
  } as IModel;

  let updatePageSpy: jasmine.Spy;
  let updateSiteSpy: jasmine.Spy;
  beforeEach(function() {
    updatePageSpy = spyOn(pagesModule, "updatePage").and.returnValue(
      Promise.resolve()
    );
    updateSiteSpy = spyOn(updateSiteModule, "updateSite").and.returnValue(
      Promise.resolve()
    );
  });

  it("saves the draft status of a site", async () => {
    await savePublishedStatus(siteModel, ro);
    expect(updateSiteSpy).toHaveBeenCalledWith(siteModel, {
      ...ro,
      allowList: ["item.typeKeywords"],
      updateVersions: false
    });
    expect(updatePageSpy).not.toHaveBeenCalled();
  });

  it("saves the published status of a site", async () => {
    const cloned = cloneObject(siteModel);
    cloned.item.typeKeywords = [];
    await savePublishedStatus(cloned, ro);

    expect(updateSiteSpy).toHaveBeenCalledWith(cloned, {
      ...ro,
      allowList: ["item.typeKeywords"],
      updateVersions: true
    });
    expect(updatePageSpy).not.toHaveBeenCalled();
  });

  it("saves the published status of a page", async () => {
    await savePublishedStatus(pageModel, ro);

    expect(updatePageSpy).toHaveBeenCalledWith(
      pageModel,
      ["item.typeKeywords"],
      ro
    );
    expect(updateSiteSpy).not.toHaveBeenCalled();
  });

  it("throws when not site or page", async () => {
    expect(() =>
      savePublishedStatus({ item: { type: "Form" } } as IModel, ro)
    ).toThrowError();
  });
});
