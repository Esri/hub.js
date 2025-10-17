import * as upgradeSchemaModule from "../../src/sites/upgrade-site-schema";
import * as getModelModule from "../../src/models/getModel";
import { IHubRequestOptions, IModel } from "../../src/hub-types";
import { getSiteById } from "../../src/sites/get-site-by-id";

describe("getDataForSiteItem", () => {
  it("gets the model and applies schema upgrades", async () => {
    const model = {
      verify: true,
    } as unknown as IModel;

    const getModelSpy = vi
      .spyOn(getModelModule, "getModel")
      .mockReturnValue(Promise.resolve(model));
    const schemaSpy = vi
      .spyOn(upgradeSchemaModule, "upgradeSiteSchema")
      .mockImplementation((m: IModel) => m);

    const res = await getSiteById("some-id", {} as IHubRequestOptions);

    expect(res).toEqual(model);
    expect(getModelSpy).toHaveBeenCalledWith("some-id", {});
    expect(schemaSpy).toHaveBeenCalledWith(model);
  });
});
