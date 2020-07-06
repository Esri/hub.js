import { getSiteById } from "../src";
import * as commonModule from "@esri/hub-common";
import * as upgradeSchemaModule from "../src/upgrade-site-schema";
import { IHubRequestOptions, IModel } from "@esri/hub-common";

describe("getDataForSiteItem", () => {
  it("gets the model and applies schema upgrades", async () => {
    const model = ({
      verify: true
    } as unknown) as IModel;

    const getModelSpy = spyOn(commonModule, "getModel").and.returnValue(
      Promise.resolve(model)
    );
    const schemaSpy = spyOn(
      upgradeSchemaModule,
      "upgradeSiteSchema"
    ).and.callFake((m: IModel) => m);

    const res = await getSiteById("some-id", {} as IHubRequestOptions);

    expect(res).toEqual(model);
    expect(getModelSpy).toHaveBeenCalledWith("some-id", {});
    expect(schemaSpy).toHaveBeenCalledWith(model);
  });
});
