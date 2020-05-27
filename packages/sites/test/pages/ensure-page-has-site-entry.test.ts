import { ensurePageHasSiteEntry } from "../../src";
import { IModel, cloneObject } from "@esri/hub-common";

describe("ensurePageHasSiteEntry", () => {
  const siteModel = {
    item: {
      id: "site-id",
      properties: {
        parentInitiativeId: "parent-init"
      }
    }
  } as IModel;

  const pageModel = ({
    data: {
      values: {
        sites: [{ id: "some-site" }, { id: "parent-init" }]
      }
    }
  } as unknown) as IModel;

  it("swaps parent initiative id with site id", async () => {
    const chk = ensurePageHasSiteEntry(
      cloneObject(siteModel),
      cloneObject(pageModel)
    );
    expect(chk.data.values.sites[1].id).toEqual("site-id");
  });

  it("doesnt swap ids if no initiative site entry", async () => {
    const localSiteModel = cloneObject(siteModel);
    const localPageModel = cloneObject(pageModel);
    localPageModel.data.values.sites = [{ id: "site-id" }];

    const chk = ensurePageHasSiteEntry(localSiteModel, localPageModel);
    expect(chk.data.values.sites[0].id).toEqual("site-id");
  });

  it("adds site entry if not exists", async () => {
    const localSiteModel = cloneObject(siteModel);
    localSiteModel.item.properties.parentInitiativeId = "";
    const localPageModel = cloneObject(pageModel);
    localPageModel.data.values.sites = [];

    const chk = ensurePageHasSiteEntry(localSiteModel, localPageModel);
    expect(chk.data.values.sites[0].id).toEqual("site-id");
    expect(chk.data.values.sites[0].title).toEqual(
      "Current Site to ensure clean removal"
    );
  });
});
