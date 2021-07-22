import { getDataForSiteItem } from "../src";
import * as portalModule from "@esri/arcgis-rest-portal";
import * as commonModule from "@esri/hub-common";
import { SITE_DATA_RESPONSE } from "./site-responses.test";
import { IHubRequestOptions, IModel } from "@esri/hub-common";

describe("getDataForSiteItem", () => {
  it("gets the data", async () => {
    const getDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
      Promise.resolve(SITE_DATA_RESPONSE)
    );
    const schemaSpy = spyOn(commonModule, "upgradeSiteSchema").and.callFake(
      (m: IModel) => m
    );

    const item = {
      id: "some-item",
    } as portalModule.IItem;

    const res = await getDataForSiteItem(item, {} as IHubRequestOptions);

    const model = { item, data: SITE_DATA_RESPONSE };
    expect(res).toEqual(model);
    expect(getDataSpy).toHaveBeenCalledWith("some-item", {});
    expect(schemaSpy).toHaveBeenCalledWith(model);
  });
});
