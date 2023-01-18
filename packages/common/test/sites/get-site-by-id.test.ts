import * as upgradeSchemaModule from "../../src/sites/upgrade-site-schema";
import * as modelModule from "../../src/models";
import { IHubRequestOptions, IModel } from "../../src/types";
import { getSiteById } from "../../src/sites";

describe("getDataForSiteItem", () => {
  it("gets the model and applies schema upgrades", async () => {
    const model = {
      verify: true,
    } as unknown as IModel;

    const getModelSpy = spyOn(modelModule, "getModel").and.returnValue(
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
